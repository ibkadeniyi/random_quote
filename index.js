// Random Quote Generator
// A simple JavaScript project to generate random quotes

const quotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Life is what happens when you're busy making other plans. - John Lennon",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
    "The only limit to our realization of tomorrow is our doubts of today. - Franklin D. Roosevelt",
    "It does not matter how slowly you go as long as you do not stop. - Confucius",
    "The journey of a thousand miles begins with one step. - Lao Tzu",
    "What you get by achieving your goals is not as important as what you become by achieving your goals. - Zig Ziglar",
    "The mind is everything. What you think you become. - Buddha",
    "The best way to predict the future is to create it. - Peter Drucker"
];

/**
 * Generate a random quote from the quotes array
 * @returns {string} A random quote
 */
function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
}

/**
 * Display a random quote to the console
 */
function displayRandomQuote() {
    const quote = getRandomQuote();
    console.log("\n🎯 Random Quote:");
    console.log(`"${quote}"`);
    console.log("\n" + "=".repeat(50));
}

// Main execution
console.log("🌟 Welcome to the Random Quote Generator!");
console.log("=".repeat(50));

// Display a random quote
displayRandomQuote();

// Export functions for potential use in other modules
module.exports = {
    getRandomQuote,
    displayRandomQuote,
    quotes
};
