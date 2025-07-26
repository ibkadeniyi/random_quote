const express = require('express');
const router = express.Router();
const Quote = require('../models/Quote');
const lyricsService = require('../services/lyricsService');

// Get random quote
router.get('/random', async (req, res) => {
    try {
        const quotes = await Quote.getRandomQuote();
        if (quotes.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No quotes found'
            });
        }
        
        res.json({
            success: true,
            data: quotes[0]
        });
    } catch (error) {
        console.error('Error getting random quote:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Get all quotes with pagination
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const quotes = await Quote.find({ isActive: true })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Quote.countDocuments({ isActive: true });

        res.json({
            success: true,
            data: quotes,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error getting quotes:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Get quotes by song
router.get('/song/:songName', async (req, res) => {
    try {
        const { songName } = req.params;
        const quotes = await Quote.getQuotesBySong(songName);
        
        res.json({
            success: true,
            data: quotes
        });
    } catch (error) {
        console.error('Error getting quotes by song:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Search quotes
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const quotes = await Quote.searchQuotes(q);
        
        res.json({
            success: true,
            data: quotes
        });
    } catch (error) {
        console.error('Error searching quotes:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Fetch and store new quotes from APIs
router.post('/fetch', async (req, res) => {
    try {
        console.log('🔄 API endpoint: Fetching new quotes...');
        const newQuotes = await lyricsService.fetchAndStoreQuotes();
        
        res.json({
            success: true,
            message: `Successfully fetched ${newQuotes.length} new quotes`,
            data: newQuotes
        });
    } catch (error) {
        console.error('Error fetching quotes:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching quotes from APIs'
        });
    }
});

// Get quote statistics
router.get('/stats', async (req, res) => {
    try {
        const totalQuotes = await Quote.countDocuments({ isActive: true });
        const totalSongs = await Quote.distinct('song');
        const totalAlbums = await Quote.distinct('album');
        
        // Get quotes by source
        const sourceStats = await Quote.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: '$source', count: { $sum: 1 } } }
        ]);

        // Get quotes by year
        const yearStats = await Quote.aggregate([
            { $match: { isActive: true, year: { $exists: true } } },
            { $group: { _id: '$year', count: { $sum: 1 } } },
            { $sort: { _id: -1 } }
        ]);

        res.json({
            success: true,
            data: {
                totalQuotes,
                totalSongs: totalSongs.length,
                totalAlbums: totalAlbums.length,
                sourceStats,
                yearStats
            }
        });
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Add a new quote manually
router.post('/', async (req, res) => {
    try {
        const { text, song, album, year, tags } = req.body;
        
        if (!text || !song) {
            return res.status(400).json({
                success: false,
                message: 'Text and song are required'
            });
        }

        const quote = new Quote({
            text,
            author: 'Michael Jackson',
            song,
            album,
            year,
            source: 'manual',
            tags: tags || ['music', 'michael jackson', 'lyrics']
        });

        const savedQuote = await quote.save();
        
        res.status(201).json({
            success: true,
            data: savedQuote
        });
    } catch (error) {
        console.error('Error adding quote:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Update quote popularity (when user likes/clicks)
router.patch('/:id/popularity', async (req, res) => {
    try {
        const { id } = req.params;
        const quote = await Quote.findByIdAndUpdate(
            id,
            { $inc: { popularity: 1 } },
            { new: true }
        );

        if (!quote) {
            return res.status(404).json({
                success: false,
                message: 'Quote not found'
            });
        }

        res.json({
            success: true,
            data: quote
        });
    } catch (error) {
        console.error('Error updating popularity:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router; 