// DOM Elements
const scrapeBtn = document.getElementById('scrapeBtn');
const urlInput = document.getElementById('urlInput');
const loadingDiv = document.getElementById('loading');
const resultDiv = document.getElementById('result');

const bookTitle = document.getElementById('bookTitle');
const bookPrice = document.getElementById('bookPrice');
const bookAvailability = document.getElementById('bookAvailability');

// Event Listener for Scrape Button
scrapeBtn.addEventListener('click', async () => {
    const url = urlInput.value;

    // Input Validation
    if (!url) {
        alert('Please enter a URL!');
        return;
    }

    // UI State: Show loading, hide previous results
    loadingDiv.classList.remove('hidden');
    resultDiv.classList.add('hidden');

    try {
        // API Request to Backend
        const response = await fetch('http://localhost:3000/scrape', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: url })
        });

        const data = await response.json();

        // Handle Response
        if (data.success) {
            // Update DOM with scraped data
            bookTitle.innerText = data.data.title;
            bookPrice.innerText = data.data.price;
            bookAvailability.innerText = data.data.availability;

            // Show results
            resultDiv.classList.remove('hidden');
        } else {
            alert('Error: ' + data.error);
        }

    } catch (error) {
        console.error('Fetch error:', error);
        alert('Failed to connect to the server.');
    } finally {
        // Reset UI State
        loadingDiv.classList.add('hidden');
    }
});