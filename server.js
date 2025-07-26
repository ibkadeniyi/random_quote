const express = require('express');
const path = require('path');
require('dotenv').config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Fallback API routes (no MongoDB required)
app.get('/api/quotes/random', (req, res) => {
    const fallbackQuotes = [
        {
            text: "Don't stop 'til you get enough",
            author: "Michael Jackson",
            song: "Don't Stop 'Til You Get Enough",
            album: "Off the Wall",
            year: 1979
        },
        {
            text: "Billie Jean is not my lover",
            author: "Michael Jackson",
            song: "Billie Jean",
            album: "Thriller",
            year: 1982
        },
        {
            text: "I'm starting with the man in the mirror",
            author: "Michael Jackson",
            song: "Man in the Mirror",
            album: "Bad",
            year: 1987
        },
        {
            text: "You are not alone, I am here with you",
            author: "Michael Jackson",
            song: "You Are Not Alone",
            album: "HIStory: Past, Present and Future, Book I",
            year: 1995
        },
        {
            text: "We are the world, we are the children",
            author: "Michael Jackson",
            song: "We Are the World",
            album: "We Are the World",
            year: 1985
        },
        {
            text: "Beat it, beat it, beat it, beat it",
            author: "Michael Jackson",
            song: "Beat It",
            album: "Thriller",
            year: 1982
        },
        {
            text: "The way you make me feel",
            author: "Michael Jackson",
            song: "The Way You Make Me Feel",
            album: "Bad",
            year: 1987
        },
        {
            text: "Smooth criminal, smooth criminal",
            author: "Michael Jackson",
            song: "Smooth Criminal",
            album: "Bad",
            year: 1987
        },
        {
            text: "Black or white, it don't matter to me",
            author: "Michael Jackson",
            song: "Black or White",
            album: "Dangerous",
            year: 1991
        },
        {
            text: "Heal the world, make it a better place",
            author: "Michael Jackson",
            song: "Heal the World",
            album: "Dangerous",
            year: 1991
        }
    ];
    
    const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    res.json({
        success: true,
        data: randomQuote
    });
});

app.get('/api/quotes', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const fallbackQuotes = [
        {
            text: "Don't stop 'til you get enough",
            author: "Michael Jackson",
            song: "Don't Stop 'Til You Get Enough",
            album: "Off the Wall",
            year: 1979
        },
        {
            text: "Billie Jean is not my lover",
            author: "Michael Jackson",
            song: "Billie Jean",
            album: "Thriller",
            year: 1982
        },
        {
            text: "I'm starting with the man in the mirror",
            author: "Michael Jackson",
            song: "Man in the Mirror",
            album: "Bad",
            year: 1987
        },
        {
            text: "You are not alone, I am here with you",
            author: "Michael Jackson",
            song: "You Are Not Alone",
            album: "HIStory: Past, Present and Future, Book I",
            year: 1995
        },
        {
            text: "We are the world, we are the children",
            author: "Michael Jackson",
            song: "We Are the World",
            album: "We Are the World",
            year: 1985
        }
    ];
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedQuotes = fallbackQuotes.slice(startIndex, endIndex);
    
    res.json({
        success: true,
        data: paginatedQuotes,
        pagination: {
            page,
            limit,
            total: fallbackQuotes.length,
            pages: Math.ceil(fallbackQuotes.length / limit)
        }
    });
});

app.get('/api/quotes/stats', (req, res) => {
    res.json({
        success: true,
        data: {
            totalQuotes: 10,
            totalSongs: 10,
            totalAlbums: 5,
            sourceStats: [{ _id: 'fallback', count: 10 }],
            yearStats: [
                { _id: 1979, count: 1 },
                { _id: 1982, count: 2 },
                { _id: 1985, count: 1 },
                { _id: 1987, count: 3 },
                { _id: 1991, count: 2 },
                { _id: 1995, count: 1 }
            ]
        }
    });
});

// Serve the main HTML file for all routes (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📱 Open your browser and visit: http://localhost:${PORT}`);
    console.log(`🔗 API available at: http://localhost:${PORT}/api/quotes`);
    console.log(`⏹️  Press Ctrl+C to stop the server`);
    console.log(`💡 Running in fallback mode - MongoDB not required`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down server...');
    process.exit(0);
}); 