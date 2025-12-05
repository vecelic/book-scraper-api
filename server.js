// server.js

// 1. Library Imports
const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const PORT = 3000;

// 2. Basic Configuration
app.use(cors()); // Allow external connections (e.g., from frontend)
app.use(express.json()); // Enable JSON data parsing

// 3. Main Route: Scraping Logic
app.post('/scrape', async (req, res) => {
    const { url } = req.body;

    // Basic security validation
    if (!url) {
        return res.status(400).json({ error: 'Please provide a valid URL.' });
    }

    try {
        // Launch the browser in headless mode (background process)
        const browser = await puppeteer.launch({ 
            headless: "new" 
        });
        const page = await browser.newPage();

        // Navigate to the requested URL
        // 'domcontentloaded' ensures we wait until the HTML is ready
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        // Extract data from the page logic
        // NOTE: Selectors ('h1', '.price_color') depend on the specific target website.
        // This example is configured for 'books.toscrape.com'.
        const productData = await page.evaluate(() => {
            const title = document.querySelector('h1') ? document.querySelector('h1').innerText : null;
            const price = document.querySelector('.price_color') ? document.querySelector('.price_color').innerText : null;
            const availability = document.querySelector('.instock.availability') ? document.querySelector('.instock.availability').innerText.trim() : null;

            return { title, price, availability };
        });

        // Close the browser to free up resources
        await browser.close();

        // Return the scraped data to the client
        return res.json({
            success: true,
            data: productData
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to scrape the data.' });
    }
});

// 4. Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Test using: http://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html`);
});