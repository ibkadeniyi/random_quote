const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

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
    }
];

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Create HTTP server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle API routes
    if (pathname === '/api/quotes/random') {
        const randomQuote = michaelJacksonQuotes[Math.floor(Math.random() * michaelJacksonQuotes.length)];
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            data: randomQuote
        }));
        return;
    }
    
    if (pathname === '/api/quotes') {
        const page = parseInt(parsedUrl.query.page) || 1;
        const limit = parseInt(parsedUrl.query.limit) || 10;
        
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedQuotes = michaelJacksonQuotes.slice(startIndex, endIndex);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            data: paginatedQuotes,
            pagination: {
                page,
                limit,
                total: michaelJacksonQuotes.length,
                pages: Math.ceil(michaelJacksonQuotes.length / limit)
            }
        }));
        return;
    }
    
    if (pathname === '/api/quotes/stats') {
        const albums = [...new Set(michaelJacksonQuotes.map(q => q.album))];
        const years = [...new Set(michaelJacksonQuotes.map(q => q.year))];
        
        const yearStats = years.map(year => ({
            _id: year,
            count: michaelJacksonQuotes.filter(q => q.year === year).length
        })).sort((a, b) => b._id - a._id);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            data: {
                totalQuotes: michaelJacksonQuotes.length,
                totalSongs: michaelJacksonQuotes.length,
                totalAlbums: albums.length,
                sourceStats: [{ _id: 'michael_jackson', count: michaelJacksonQuotes.length }],
                yearStats
            }
        }));
        return;
    }
    
    // Handle static files
    let filePath = '';
    if (pathname === '/' || pathname === '/index.html') {
        filePath = path.join(__dirname, 'public', 'index.html');
    } else {
        filePath = path.join(__dirname, 'public', pathname);
    }
    
    // Get file extension
    const extname = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    // Read and serve the file
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File not found, serve index.html for SPA
                fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
                    if (err) {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end('<h1>404 - File Not Found</h1>');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(content, 'utf-8');
                    }
                });
            } else {
                // Server error
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('<h1>500 - Internal Server Error</h1>');
            }
        } else {
            // Success
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`🚀 Michael Jackson Quote Generator running at http://localhost:${PORT}`);
    console.log(`📱 Open your browser and visit: http://localhost:${PORT}`);
    console.log(`🔗 API available at: http://localhost:${PORT}/api/quotes`);
    console.log(`📊 ${michaelJacksonQuotes.length} Michael Jackson quotes loaded`);
    console.log(`⏹️  Press Ctrl+C to stop the server`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down server...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
}); 