// Quote Generator Frontend JavaScript

// Extended quotes array with more variety
const quotes = [
    {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
    },
    {
        text: "Life is what happens when you're busy making other plans.",
        author: "John Lennon"
    },
    {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt"
    },
    {
        text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill"
    },
    {
        text: "The only limit to our realization of tomorrow is our doubts of today.",
        author: "Franklin D. Roosevelt"
    },
    {
        text: "It does not matter how slowly you go as long as you do not stop.",
        author: "Confucius"
    },
    {
        text: "The journey of a thousand miles begins with one step.",
        author: "Lao Tzu"
    },
    {
        text: "What you get by achieving your goals is not as important as what you become by achieving your goals.",
        author: "Zig Ziglar"
    },
    {
        text: "The mind is everything. What you think you become.",
        author: "Buddha"
    },
    {
        text: "The best way to predict the future is to create it.",
        author: "Peter Drucker"
    },
    {
        text: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt"
    },
    {
        text: "Don't watch the clock; do what it does. Keep going.",
        author: "Sam Levenson"
    },
    {
        text: "The only person you are destined to become is the person you decide to be.",
        author: "Ralph Waldo Emerson"
    },
    {
        text: "Everything you've ever wanted is on the other side of fear.",
        author: "George Addair"
    },
    {
        text: "Success usually comes to those who are too busy to be looking for it.",
        author: "Henry David Thoreau"
    },
    {
        text: "The way to get started is to quit talking and begin doing.",
        author: "Walt Disney"
    },
    {
        text: "Your time is limited, don't waste it living someone else's life.",
        author: "Steve Jobs"
    },
    {
        text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
        author: "Nelson Mandela"
    },
    {
        text: "In the middle of difficulty lies opportunity.",
        author: "Albert Einstein"
    },
    {
        text: "The only impossible journey is the one you never begin.",
        author: "Tony Robbins"
    }
];

// DOM elements
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const shareBtn = document.getElementById('share-btn');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notification-text');

let currentQuote = null;

// Generate random quote
function generateQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    
    // Add fade effect
    quoteText.classList.add('fade');
    
    setTimeout(() => {
        quoteText.textContent = `"${quote.text}"`;
        quoteAuthor.innerHTML = `<span class="author-label">— ${quote.author}</span>`;
        currentQuote = quote;
        
        // Remove fade effect
        quoteText.classList.remove('fade');
    }, 300);
}

// Copy quote to clipboard
async function copyQuote() {
    if (!currentQuote) {
        showNotification('Generate a quote first!', 'warning');
        return;
    }
    
    const textToCopy = `"${currentQuote.text}" — ${currentQuote.author}`;
    
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
    
    const textToShare = `"${currentQuote.text}" — ${currentQuote.author}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Random Quote Generator',
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

// Event listeners
generateBtn.addEventListener('click', () => {
    setButtonLoading(generateBtn, true);
    
    // Simulate a small delay for better UX
    setTimeout(() => {
        generateQuote();
        setButtonLoading(generateBtn, false);
    }, 500);
});

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
window.addEventListener('load', () => {
    setTimeout(() => {
        generateQuote();
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