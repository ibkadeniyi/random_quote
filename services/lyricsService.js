const axios = require('axios');
const Quote = require('../models/Quote');

class LyricsService {
    constructor() {
        this.geniusBaseUrl = 'https://api.genius.com';
        this.musixmatchBaseUrl = 'https://api.musixmatch.com/ws/1.1';
        this.geniusToken = process.env.GENIUS_ACCESS_TOKEN;
        this.musixmatchKey = process.env.MUSIXMATCH_API_KEY;
    }

    // Search for Michael Jackson songs on Genius
    async searchGeniusSongs(query = 'Michael Jackson', limit = 20) {
        try {
            if (!this.geniusToken) {
                console.log('⚠️  Genius API token not configured');
                return [];
            }

            const response = await axios.get(`${this.geniusBaseUrl}/search`, {
                headers: {
                    'Authorization': `Bearer ${this.geniusToken}`
                },
                params: {
                    q: query,
                    per_page: limit
                }
            });

            return response.data.response.hits.map(hit => ({
                id: hit.result.id,
                title: hit.result.title,
                artist: hit.result.primary_artist.name,
                url: hit.result.url,
                album: hit.result.album?.name || 'Unknown Album',
                year: hit.result.release_date_components?.year
            }));
        } catch (error) {
            console.error('❌ Error searching Genius:', error.message);
            return [];
        }
    }

    // Get lyrics from Genius
    async getGeniusLyrics(songId) {
        try {
            if (!this.geniusToken) {
                throw new Error('Genius API token not configured');
            }

            // First get the song details
            const songResponse = await axios.get(`${this.geniusBaseUrl}/songs/${songId}`, {
                headers: {
                    'Authorization': `Bearer ${this.geniusToken}`
                }
            });

            const song = songResponse.data.response.song;
            
            // For lyrics, we'd need to scrape the page since Genius doesn't provide lyrics via API
            // For now, we'll return song info and use a fallback approach
            return {
                title: song.title,
                artist: song.primary_artist.name,
                album: song.album?.name || 'Unknown Album',
                year: song.release_date_components?.year,
                url: song.url,
                lyrics: null // Would need web scraping for actual lyrics
            };
        } catch (error) {
            console.error('❌ Error getting Genius lyrics:', error.message);
            throw error;
        }
    }

    // Search for Michael Jackson songs on Musixmatch
    async searchMusixmatchSongs(query = 'Michael Jackson', limit = 20) {
        try {
            if (!this.musixmatchKey) {
                console.log('⚠️  Musixmatch API key not configured');
                return [];
            }

            const response = await axios.get(`${this.musixmatchBaseUrl}/track.search`, {
                params: {
                    apikey: this.musixmatchKey,
                    q_artist: 'Michael Jackson',
                    q_track: query,
                    page_size: limit,
                    page: 1,
                    s_track_rating: 'desc'
                }
            });

            if (response.data.message.header.status_code === 200) {
                return response.data.message.body.track_list.map(track => ({
                    id: track.track.track_id,
                    title: track.track.track_name,
                    artist: track.track.artist_name,
                    album: track.track.album_name,
                    year: track.track.first_release_date?.split('-')[0]
                }));
            }
            return [];
        } catch (error) {
            console.error('❌ Error searching Musixmatch:', error.message);
            return [];
        }
    }

    // Get lyrics from Musixmatch
    async getMusixmatchLyrics(trackId) {
        try {
            if (!this.musixmatchKey) {
                throw new Error('Musixmatch API key not configured');
            }

            const response = await axios.get(`${this.musixmatchBaseUrl}/track.lyrics.get`, {
                params: {
                    apikey: this.musixmatchKey,
                    track_id: trackId
                }
            });

            if (response.data.message.header.status_code === 200) {
                const lyrics = response.data.message.body.lyrics;
                return {
                    lyrics: lyrics.lyrics_body,
                    copyright: lyrics.lyrics_copyright
                };
            }
            throw new Error('No lyrics found');
        } catch (error) {
            console.error('❌ Error getting Musixmatch lyrics:', error.message);
            throw error;
        }
    }

    // Fallback: Use predefined Michael Jackson lyrics
    async getFallbackLyrics() {
        const fallbackQuotes = [
            {
                text: "Don't stop 'til you get enough",
                song: "Don't Stop 'Til You Get Enough",
                album: "Off the Wall",
                year: 1979
            },
            {
                text: "Billie Jean is not my lover",
                song: "Billie Jean",
                album: "Thriller",
                year: 1982
            },
            {
                text: "Beat it, beat it, beat it, beat it",
                song: "Beat It",
                album: "Thriller",
                year: 1982
            },
            {
                text: "I'm starting with the man in the mirror",
                song: "Man in the Mirror",
                album: "Bad",
                year: 1987
            },
            {
                text: "You are not alone, I am here with you",
                song: "You Are Not Alone",
                album: "HIStory: Past, Present and Future, Book I",
                year: 1995
            },
            {
                text: "We are the world, we are the children",
                song: "We Are the World",
                album: "We Are the World",
                year: 1985
            },
            {
                text: "The way you make me feel",
                song: "The Way You Make Me Feel",
                album: "Bad",
                year: 1987
            },
            {
                text: "Smooth criminal, smooth criminal",
                song: "Smooth Criminal",
                album: "Bad",
                year: 1987
            },
            {
                text: "Black or white, it don't matter to me",
                song: "Black or White",
                album: "Dangerous",
                year: 1991
            },
            {
                text: "Heal the world, make it a better place",
                song: "Heal the World",
                album: "Dangerous",
                year: 1991
            }
        ];

        return fallbackQuotes;
    }

    // Extract meaningful quotes from lyrics
    extractQuotesFromLyrics(lyrics, songInfo) {
        if (!lyrics) return [];

        const lines = lyrics.split('\n').filter(line => 
            line.trim().length > 10 && 
            line.trim().length < 200 &&
            !line.includes('[') && // Remove annotations
            !line.includes(']') &&
            !line.match(/^\d+$/) // Remove line numbers
        );

        return lines.slice(0, 5).map(line => ({
            text: line.trim(),
            song: songInfo.title,
            album: songInfo.album,
            year: songInfo.year,
            source: 'api'
        }));
    }

    // Main method to fetch and store quotes
    async fetchAndStoreQuotes() {
        try {
            console.log('🔄 Starting to fetch Michael Jackson quotes...');

            let quotes = [];

            // Try to get quotes from APIs
            try {
                const geniusSongs = await this.searchGeniusSongs('Michael Jackson', 10);
                console.log(`📝 Found ${geniusSongs.length} songs on Genius`);

                for (const song of geniusSongs.slice(0, 5)) {
                    try {
                        const songInfo = await this.getGeniusLyrics(song.id);
                        // For now, we'll use the song title as a quote since we can't get lyrics via API
                        quotes.push({
                            text: `"${songInfo.title}" - A masterpiece by Michael Jackson`,
                            song: songInfo.title,
                            album: songInfo.album,
                            year: songInfo.year,
                            source: 'genius'
                        });
                    } catch (error) {
                        console.log(`⚠️  Could not get lyrics for ${song.title}`);
                    }
                }
            } catch (error) {
                console.log('⚠️  Genius API failed, using fallback');
            }

            // If we don't have enough quotes, use fallback
            if (quotes.length < 5) {
                const fallbackQuotes = await this.getFallbackLyrics();
                quotes = quotes.concat(fallbackQuotes.map(q => ({
                    ...q,
                    source: 'fallback'
                })));
            }

            // Store quotes in database
            const storedQuotes = [];
            for (const quoteData of quotes) {
                try {
                    const existingQuote = await Quote.findOne({
                        text: quoteData.text,
                        song: quoteData.song
                    });

                    if (!existingQuote) {
                        const quote = new Quote({
                            text: quoteData.text,
                            author: 'Michael Jackson',
                            song: quoteData.song,
                            album: quoteData.album,
                            year: quoteData.year,
                            source: quoteData.source,
                            tags: ['music', 'michael jackson', 'lyrics']
                        });

                        const savedQuote = await quote.save();
                        storedQuotes.push(savedQuote);
                        console.log(`✅ Stored quote: "${quoteData.text.substring(0, 50)}..."`);
                    } else {
                        console.log(`⏭️  Quote already exists: "${quoteData.text.substring(0, 50)}..."`);
                    }
                } catch (error) {
                    console.error(`❌ Error storing quote: ${error.message}`);
                }
            }

            console.log(`🎉 Successfully processed ${storedQuotes.length} new quotes`);
            return storedQuotes;

        } catch (error) {
            console.error('❌ Error in fetchAndStoreQuotes:', error.message);
            throw error;
        }
    }
}

module.exports = new LyricsService(); 