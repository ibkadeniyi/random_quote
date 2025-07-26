# Michael Jackson Quote Generator

A modern web application that generates random quotes from Michael Jackson's legendary songs. Built with Node.js, Express, MongoDB, and a beautiful responsive frontend.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. Clone this repository or download the files
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   - Copy `config.env` and update with your MongoDB URI and API keys
   - For API integration, get keys from:
     - [Genius API](https://genius.com/api-clients)
     - [Musixmatch API](https://developer.musixmatch.com/)
5. Initialize the database:
   ```bash
   npm run init-db
   ```

### Running the Project

#### CLI Version (Terminal)
```bash
npm start
```

Or run directly with Node.js:
```bash
node index.js
```

#### Web Version (Browser)
```bash
npm run web
```

Or run directly with Node.js:
```bash
node server.js
```

Then open your browser and visit: `http://localhost:3000`

## Project Structure

```
random_quote/
├── index.js              # CLI version
├── server.js             # Express server with API routes
├── config/
│   ├── database.js       # MongoDB connection
│   └── config.env        # Environment variables
├── models/
│   └── Quote.js          # MongoDB schema
├── routes/
│   └── api.js            # API endpoints
├── services/
│   └── lyricsService.js  # API integration service
├── scripts/
│   └── initDb.js         # Database initialization
├── public/               # Frontend files
│   ├── index.html        # Main HTML page
│   ├── styles.css        # CSS styles
│   └── script.js         # Frontend JavaScript
├── package.json          # Project configuration
├── .gitignore           # Git ignore rules
└── README.md            # Project documentation
```

## Features

- **🎵 Michael Jackson Lyrics**: Quotes from the King of Pop's legendary songs
- **🌐 API Integration**: Fetches quotes from Genius and Musixmatch APIs
- **🗄️ MongoDB Database**: Stores quotes with metadata (song, album, year)
- **📱 Responsive Design**: Beautiful UI that works on all devices
- **🔄 Real-time Generation**: Get random quotes instantly
- **📋 Copy & Share**: Easy sharing functionality
- **🔍 Search & Filter**: Find quotes by song or search terms
- **📊 Statistics**: Track quote popularity and usage
- **⚡ Fast Performance**: Optimized database queries and caching
- **🎨 Modern UI**: Smooth animations and beautiful design

## API Endpoints

### Quotes
- `GET /api/quotes/random` - Get a random quote
- `GET /api/quotes` - Get all quotes with pagination
- `GET /api/quotes/search?q=query` - Search quotes
- `GET /api/quotes/song/:songName` - Get quotes by song
- `POST /api/quotes` - Add a new quote manually
- `PATCH /api/quotes/:id/popularity` - Update quote popularity

### Statistics
- `GET /api/quotes/stats` - Get quote statistics

### Data Management
- `POST /api/quotes/fetch` - Fetch new quotes from APIs

## Environment Variables

Create a `config.env` file with:
```env
MONGODB_URI=mongodb://localhost:27017/random_quote_db
GENIUS_ACCESS_TOKEN=your_genius_token
MUSIXMATCH_API_KEY=your_musixmatch_key
PORT=3000
NODE_ENV=development
```

## Contributing

Feel free to contribute to this project by:
1. Forking the repository
2. Creating a feature branch
3. Making your changes
4. Submitting a pull request

## License

This project is licensed under the ISC License. 