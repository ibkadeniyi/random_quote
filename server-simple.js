const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Michael Jackson quotes
const michaelJacksonQuotes = [
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
    },
    {
        text: "Remember the time when we fell in love",
        author: "Michael Jackson",
        song: "Remember the Time",
        album: "Dangerous",
        year: 1991
    },
    {
        text: "Wanna be startin' somethin'",
        author: "Michael Jackson",
        song: "Wanna Be Startin' Somethin'",
        album: "Thriller",
        year: 1982
    },
    {
        text: "The kid is not my son",
        author: "Michael Jackson",
        song: "Billie Jean",
        album: "Thriller",
        year: 1982
    },
    {
        text: "Just call my name, I'll be there",
        author: "Michael Jackson",
        song: "I'll Be There",
        album: "Third Album",
        year: 1970
    },
    {
        text: "ABC, it's easy as 1-2-3",
        author: "Michael Jackson",
        song: "ABC",
        album: "ABC",
        year: 1970
    }
];

// API Routes
app.get('/api/quotes/random', (req, res) => {
    const randomQuote = michaelJacksonQuotes[Math.floor(Math.random() * michaelJacksonQuotes.length)];
    res.json({
        success: true,
        data: randomQuote
    });
});

app.get('/api/quotes', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedQuotes = michaelJacksonQuotes.slice(startIndex, endIndex);
    
    res.json({
        success: true,
        data: paginatedQuotes,
        pagination: {
            page,
            limit,
            total: michaelJacksonQuotes.length,
            pages: Math.ceil(michaelJacksonQuotes.length / limit)
        }
    });
});

app.get('/api/quotes/stats', (req, res) => {
    const albums = [...new Set(michaelJacksonQuotes.map(q => q.album))];
    const years = [...new Set(michaelJacksonQuotes.map(q => q.year))];
    
    const yearStats = years.map(year => ({
        _id: year,
        count: michaelJacksonQuotes.filter(q => q.year === year).length
    })).sort((a, b) => b._id - a._id);
    
    res.json({
        success: true,
        data: {
            totalQuotes: michaelJacksonQuotes.length,
            totalSongs: michaelJacksonQuotes.length,
            totalAlbums: albums.length,
            sourceStats: [{ _id: 'michael_jackson', count: michaelJacksonQuotes.length }],
            yearStats
        }
    });
});

// Search quotes
app.get('/api/quotes/search', (req, res) => {
    const { q } = req.query;
    if (!q) {
        return res.status(400).json({
            success: false,
            message: 'Search query is required'
        });
    }
    
    const searchTerm = q.toLowerCase();
    const filteredQuotes = michaelJacksonQuotes.filter(quote => 
        quote.text.toLowerCase().includes(searchTerm) ||
        quote.song.toLowerCase().includes(searchTerm) ||
        quote.album.toLowerCase().includes(searchTerm)
    );
    
    res.json({
        success: true,
        data: filteredQuotes
    });
});

// Get quotes by song
app.get('/api/quotes/song/:songName', (req, res) => {
    const { songName } = req.params;
    const songQuotes = michaelJacksonQuotes.filter(quote => 
        quote.song.toLowerCase().includes(songName.toLowerCase())
    );
    
    res.json({
        success: true,
        data: songQuotes
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
    console.log(`🚀 Michael Jackson Quote Generator running at http://localhost:${PORT}`);
    console.log(`📱 Open your browser and visit: http://localhost:${PORT}`);
    console.log(`🔗 API available at: http://localhost:${PORT}/api/quotes`);
    console.log(`📊 ${michaelJacksonQuotes.length} Michael Jackson quotes loaded`);
    console.log(`⏹️  Press Ctrl+C to stop the server`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down server...');
    process.exit(0);
}); 