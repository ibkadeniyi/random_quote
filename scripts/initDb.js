const connectDB = require('../config/database');
const Quote = require('../models/Quote');
const lyricsService = require('../services/lyricsService');
require('dotenv').config({ path: '../config.env' });

async function initializeDatabase() {
    try {
        console.log('🔄 Connecting to database...');
        await connectDB();

        console.log('🔄 Checking if database is empty...');
        const quoteCount = await Quote.countDocuments();
        
        if (quoteCount === 0) {
            console.log('📝 Database is empty. Initializing with Michael Jackson quotes...');
            
            // First try to fetch from APIs
            try {
                const apiQuotes = await lyricsService.fetchAndStoreQuotes();
                console.log(`✅ Successfully added ${apiQuotes.length} quotes from APIs`);
            } catch (error) {
                console.log('⚠️  API fetch failed, using fallback quotes');
            }

            // Add some additional fallback quotes
            const fallbackQuotes = [
                {
                    text: "Don't stop 'til you get enough",
                    song: "Don't Stop 'Til You Get Enough",
                    album: "Off the Wall",
                    year: 1979,
                    source: 'fallback'
                },
                {
                    text: "Billie Jean is not my lover",
                    song: "Billie Jean",
                    album: "Thriller",
                    year: 1982,
                    source: 'fallback'
                },
                {
                    text: "Beat it, beat it, beat it, beat it",
                    song: "Beat It",
                    album: "Thriller",
                    year: 1982,
                    source: 'fallback'
                },
                {
                    text: "I'm starting with the man in the mirror",
                    song: "Man in the Mirror",
                    album: "Bad",
                    year: 1987,
                    source: 'fallback'
                },
                {
                    text: "You are not alone, I am here with you",
                    song: "You Are Not Alone",
                    album: "HIStory: Past, Present and Future, Book I",
                    year: 1995,
                    source: 'fallback'
                },
                {
                    text: "We are the world, we are the children",
                    song: "We Are the World",
                    album: "We Are the World",
                    year: 1985,
                    source: 'fallback'
                },
                {
                    text: "The way you make me feel",
                    song: "The Way You Make Me Feel",
                    album: "Bad",
                    year: 1987,
                    source: 'fallback'
                },
                {
                    text: "Smooth criminal, smooth criminal",
                    song: "Smooth Criminal",
                    album: "Bad",
                    year: 1987,
                    source: 'fallback'
                },
                {
                    text: "Black or white, it don't matter to me",
                    song: "Black or White",
                    album: "Dangerous",
                    year: 1991,
                    source: 'fallback'
                },
                {
                    text: "Heal the world, make it a better place",
                    song: "Heal the World",
                    album: "Dangerous",
                    year: 1991,
                    source: 'fallback'
                },
                {
                    text: "Remember the time when we fell in love",
                    song: "Remember the Time",
                    album: "Dangerous",
                    year: 1991,
                    source: 'fallback'
                },
                {
                    text: "Wanna be startin' somethin'",
                    song: "Wanna Be Startin' Somethin'",
                    album: "Thriller",
                    year: 1982,
                    source: 'fallback'
                },
                {
                    text: "The kid is not my son",
                    song: "Billie Jean",
                    album: "Thriller",
                    year: 1982,
                    source: 'fallback'
                },
                {
                    text: "Just call my name, I'll be there",
                    song: "I'll Be There",
                    album: "Third Album",
                    year: 1970,
                    source: 'fallback'
                },
                {
                    text: "ABC, it's easy as 1-2-3",
                    song: "ABC",
                    album: "ABC",
                    year: 1970,
                    source: 'fallback'
                }
            ];

            // Add fallback quotes to database
            for (const quoteData of fallbackQuotes) {
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
                        tags: ['music', 'michael jackson', 'lyrics', 'pop']
                    });

                    await quote.save();
                    console.log(`✅ Added: "${quoteData.text}"`);
                }
            }

            console.log('🎉 Database initialization complete!');
        } else {
            console.log(`📊 Database already contains ${quoteCount} quotes`);
        }

        // Show database stats
        const stats = await Quote.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: '$source', count: { $sum: 1 } } }
        ]);

        console.log('📈 Database Statistics:');
        stats.forEach(stat => {
            console.log(`   ${stat._id}: ${stat.count} quotes`);
        });

    } catch (error) {
        console.error('❌ Error initializing database:', error);
    } finally {
        process.exit(0);
    }
}

// Run the initialization
initializeDatabase(); 