// Quote Generator Frontend JavaScript - Updated for API Integration

// API base URL
const API_BASE_URL = '/api/quotes';

// DOM elements
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const shareBtn = document.getElementById('share-btn');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notification-text');

let currentQuote = null;

// API functions
async function fetchRandomQuote() {
    try {
        const response = await fetch(`${API_BASE_URL}/random`);
        const data = await response.json();
        
        if (data.success) {
            return data.data;
        } else {
            throw new Error(data.message || 'Failed to fetch quote');
        }
    } catch (error) {
        console.error('Error fetching quote:', error);
        throw error;
    }
}

async function fetchQuotes(page = 1, limit = 10) {
    try {
        const response = await fetch(`${API_BASE_URL}?page=${page}&limit=${limit}`);
        const data = await response.json();
        
        if (data.success) {
            return data.data;
        } else {
            throw new Error(data.message || 'Failed to fetch quotes');
        }
    } catch (error) {
        console.error('Error fetching quotes:', error);
        throw error;
    }
}

async function searchQuotes(query) {
    try {
        const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (data.success) {
            return data.data;
        } else {
            throw new Error(data.message || 'Failed to search quotes');
        }
    } catch (error) {
        console.error('Error searching quotes:', error);
        throw error;
    }
}

async function fetchQuoteStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/stats`);
        const data = await response.json();
        
        if (data.success) {
            return data.data;
        } else {
            throw new Error(data.message || 'Failed to fetch stats');
        }
    } catch (error) {
        console.error('Error fetching stats:', error);
        throw error;
    }
}

async function updateQuotePopularity(quoteId) {
    try {
        const response = await fetch(`${API_BASE_URL}/${quoteId}/popularity`, {
            method: 'PATCH'
        });
        const data = await response.json();
        
        if (data.success) {
            return data.data;
        } else {
            throw new Error(data.message || 'Failed to update popularity');
        }
    } catch (error) {
        console.error('Error updating popularity:', error);
        throw error;
    }
}

// Generate random quote
async function generateQuote() {
    try {
        setButtonLoading(generateBtn, true);
        
        // Add fade effect
        quoteText.classList.add('fade');
        
        setTimeout(async () => {
            try {
                const quote = await fetchRandomQuote();
                
                quoteText.textContent = `"${quote.text}"`;
                quoteAuthor.innerHTML = `
                    <span class="author-label">— ${quote.author}</span>
                    <br>
                    <small class="song-info">From: ${quote.song} (${quote.album || 'Unknown Album'})</small>
                `;
                currentQuote = quote;
                
                // Update popularity
                if (quote._id) {
                    updateQuotePopularity(quote._id).catch(console.error);
                }
                
                // Remove fade effect
                quoteText.classList.remove('fade');
                
            } catch (error) {
                console.error('Error generating quote:', error);
                showNotification('Failed to generate quote. Please try again.', 'error');
                
                // Show fallback message
                quoteText.textContent = 'Click the button below to generate a random quote';
                quoteAuthor.innerHTML = '<span class="author-label">Author</span>';
                currentQuote = null;
            } finally {
                setButtonLoading(generateBtn, false);
            }
        }, 300);
        
    } catch (error) {
        console.error('Error in generateQuote:', error);
        setButtonLoading(generateBtn, false);
        showNotification('Failed to generate quote. Please try again.', 'error');
    }
}

// Copy quote to clipboard
async function copyQuote() {
    if (!currentQuote) {
        showNotification('Generate a quote first!', 'warning');
        return;
    }
    
    const textToCopy = `"${currentQuote.text}" — ${currentQuote.author} (${currentQuote.song})`;
    
    try {
        await navigator.clipboard.writeText(textToCopy);
        showNotification('Quote copied to clipboard!', 'success');
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Quote copied to clipboard!', 'success');
    }
}

// Share quote
function shareQuote() {
    if (!currentQuote) {
        showNotification('Generate a quote first!', 'warning');
        return;
    }
    
    const textToShare = `"${currentQuote.text}" — ${currentQuote.author} (${currentQuote.song})`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Michael Jackson Quote',
            text: textToShare,
            url: window.location.href
        }).catch(err => {
            console.log('Error sharing:', err);
            copyQuote(); // Fallback to copy
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        copyQuote();
    }
}

// Show notification
function showNotification(message, type = 'success') {
    notificationText.textContent = message;
    notification.className = `notification show ${type}`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Add loading state to button
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = '<div class="loading"></div> Generating...';
    } else {
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-random"></i> Generate Quote';
    }
}

// Update page title and description for Michael Jackson theme
function updatePageTheme() {
    document.title = 'Michael Jackson Quote Generator';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.content = 'Discover inspiring quotes from Michael Jackson lyrics and songs';
    }
}

// Event listeners
generateBtn.addEventListener('click', generateQuote);
copyBtn.addEventListener('click', copyQuote);
shareBtn.addEventListener('click', shareQuote);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        generateBtn.click();
    }
});

// Auto-generate first quote on page load
window.addEventListener('load', async () => {
    updatePageTheme();
    
    setTimeout(async () => {
        try {
            await generateQuote();
        } catch (error) {
            console.error('Error on initial quote generation:', error);
            showNotification('Welcome! Click generate to get started.', 'info');
        }
    }, 1000);
});

// Add some interactive effects
generateBtn.addEventListener('mouseenter', () => {
    generateBtn.style.transform = 'translateY(-2px) scale(1.02)';
});

generateBtn.addEventListener('mouseleave', () => {
    generateBtn.style.transform = 'translateY(0) scale(1)';
});

// Add quote card hover effect
const quoteCard = document.querySelector('.quote-card');
quoteCard.addEventListener('mouseenter', () => {
    quoteCard.style.transform = 'translateY(-5px)';
    quoteCard.style.boxShadow = '0 25px 50px rgba(0,0,0,0.15)';
});

quoteCard.addEventListener('mouseleave', () => {
    quoteCard.style.transform = 'translateY(0)';
    quoteCard.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
});

// Add smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
}); 