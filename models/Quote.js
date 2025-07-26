const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        default: 'Michael Jackson'
    },
    song: {
        type: String,
        required: true,
        trim: true
    },
    album: {
        type: String,
        trim: true
    },
    year: {
        type: Number
    },
    source: {
        type: String,
        enum: ['genius', 'musixmatch', 'manual', 'scraped'],
        default: 'manual'
    },
    apiId: {
        type: String,
        unique: true,
        sparse: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    popularity: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Index for better search performance
quoteSchema.index({ text: 'text', song: 'text', album: 'text' });
quoteSchema.index({ source: 1, isActive: 1 });
quoteSchema.index({ createdAt: -1 });

// Update the updatedAt field before saving
quoteSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Static method to get random quote
quoteSchema.statics.getRandomQuote = function() {
    return this.aggregate([
        { $match: { isActive: true } },
        { $sample: { size: 1 } }
    ]);
};

// Static method to get quotes by song
quoteSchema.statics.getQuotesBySong = function(songName) {
    return this.find({
        song: { $regex: songName, $options: 'i' },
        isActive: true
    }).sort({ popularity: -1 });
};

// Static method to search quotes
quoteSchema.statics.searchQuotes = function(searchTerm) {
    return this.find({
        $text: { $search: searchTerm },
        isActive: true
    }).sort({ score: { $meta: 'textScore' } });
};

module.exports = mongoose.model('Quote', quoteSchema); 