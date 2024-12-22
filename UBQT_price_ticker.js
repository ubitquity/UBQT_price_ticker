// Set up the DOM structure dynamically
const body = document.body;
body.style.cssText = `
  font-family: 'Merriweather', serif;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #0d1b2a; /* Midnight blue */
`;

// Create the ticker container
const ticker = document.createElement('div');
ticker.className = 'ticker';
ticker.style.cssText = `
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  background-color: #2b2d42; /* Deep gray */
  color: #f8f9fa; /* Light ivory */
  padding: 10px 0;
  border: 3px solid #f94144; /* Festive red */
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  display: flex;
`;

// Create the ticker content
const tickerContent = document.createElement('span');
tickerContent.className = 'ticker-content';
tickerContent.style.cssText = `
  display: inline-block;
  animation: scroll-left 15s linear infinite;
  font-size: 1.2rem;
  color: #8ac926; /* Christmas green */
`;

tickerContent.innerHTML = `
  <span id="ticker-text">Loading...</span>
  <span class="disclaimer" style="font-size: 0.9rem; color: #f8f9fa; padding-left: 20px;">
    Disclaimer: Data is updated every 30 seconds. For 3X/4X bonuses, sign up for the 
    <a href="https://nftitlenetwork.com/ubqt-private-placement" target="_blank" style="color: #8ac926; text-decoration: none;">
      Private Placement
    </a>.
  </span>
`;

ticker.appendChild(tickerContent);
body.appendChild(ticker);

// Add the scrolling animation
const style = document.createElement('style');
style.textContent = `
  @keyframes scroll-left {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(-100%);
    }
  }
`;
document.head.appendChild(style);

// Define the API URLs
const ubqtApiUrl = 'https://proton.alcor.exchange/api/v2/tickers/ubqt-ubitquityllc_xpr-eosio.token';
const xprToUsdApiUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=proton&vs_currencies=usd';

// Function to fetch and update the ticker
async function updateTicker() {
  try {
    // Fetch UBQT/XPR price
    const ubqtResponse = await fetch(ubqtApiUrl);
    if (!ubqtResponse.ok) {
      throw new Error(`HTTP error! status: ${ubqtResponse.status}`);
    }
    const ubqtData = await ubqtResponse.json();
    const lastPrice = parseFloat(ubqtData.last_price);

    // Fetch XPR/USD price
    const xprResponse = await fetch(xprToUsdApiUrl);
    if (!xprResponse.ok) {
      throw new Error(`HTTP error! status: ${xprResponse.status}`);
    }
    const xprData = await xprResponse.json();
    const xprToUsd = parseFloat(xprData.proton.usd);

    // Calculate UBQT/USD price
    const ubqtToUsd = (lastPrice * xprToUsd).toFixed(6);

    // Create the display string
    const displayText = `🎄 UBQT/XPR: ${lastPrice} (USD: $${ubqtToUsd}) 🎅`;

    // Update the ticker text
    document.getElementById('ticker-text').textContent = displayText;
  } catch (error) {
    console.error('Error fetching or displaying data:', error);
    document.getElementById('ticker-text').textContent = '❄️ Error fetching data. Please try again later. 🎁';
  }
}

// Initial call to update the ticker
updateTicker();

// Update the ticker every 30 seconds
setInterval(updateTicker, 30000);
