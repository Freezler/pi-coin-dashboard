<script>
  import { onMount } from "svelte";
  import Navbar from "./components/Navbar.svelte";
  import Dashboard from "./components/Dashboard.svelte";
  import NewsCarousel from "./components/NewsCarousel.svelte"; // Import NewsCarousel component
  import { newsItems } from "./data/newsData.js";

  let piPrice = 0;
  let currentDate = new Date().toLocaleDateString();
  let currentTime = new Date().toLocaleTimeString();
  let change24h = 0;
  let loading = true;
  let data = [];
  let news = [];

  let lastFetchTime = 0;
  let cachedPrice = null;
  const fetchInterval = 60000; // 1 minute

  async function updateData() {
    const currentTime = Date.now();
    if (cachedPrice && (currentTime - lastFetchTime < fetchInterval)) {
      // Serve from cache if within the fetch interval
      piPrice = cachedPrice;
      return;
    }
    try {
      const response = await fetch("https://cors-anywhere.herokuapp.com/https://api.coingecko.com/api/v3/simple/price?ids=pi-network&vs_currencies=usd");
      if (response.ok) {
        const priceResult = await response.json();
        piPrice = priceResult["pi-network"]?.usd || 0;
        cachedPrice = piPrice; // Cache the price
        lastFetchTime = currentTime; // Update last fetch time
      } else if (response.status === 429) {
        console.error("Rate limit exceeded. Please try again later.");
        // Optionally implement a backoff strategy here
      } else {
        console.error("Failed to fetch price data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    loading = false;
  };

  const fetchNews = async () => {
    try {
      const urls = [
        "https://coinpedia.org/news/is-pi-coin-the-next-bitcoin-mainnet-launch-to-expected-by-the-end-of-q1/",
        "https://coinpedia.org/news/pi-networks-195-billion-valuation-faces-liquidity-crisis-what-next-for-pi-coin-price/",
        "https://coinpedia.org/news/pi-network-news-pi-to-unlock-188-million-tokens-will-price-drop/",
        "https://coinpedia.org/news/major-crypto-exchanges-announce-the-listing-of-pi-coin-here-are-they/",
        "https://coinpedia.org/news/pi-network-mainnet-launch-today-live-updates/",
      ];

      const newsArticles = await Promise.all(
        urls.map(async (url) => {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const text = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(text, "text/html");
          const title = doc.querySelector("h1")?.innerText || "No title";
          const description =
            doc
              .querySelector('meta[name="description"]')
              ?.getAttribute("content") || "No description available";
          return { title, description, url };
        }),
      );

      return newsArticles;
    } catch (error) {
      console.error("Error fetching news:", error);
      return newsItems;
    }
  };

  onMount(async () => {
    await updateData();
    news = await fetchNews();

    const dataTimer = setInterval(updateData, 5 * 60 * 1000);
    const timeTimer = setInterval(() => {
      const now = new Date();
      currentTime = now.toLocaleTimeString();
    }, 1000);

    return () => {
      clearInterval(timeTimer);
      clearInterval(dataTimer);
    };
  });
</script>

<Navbar {piPrice} {change24h} {loading} />

<div class="container mx-auto px-4 py-8">
  <Dashboard {currentDate} {currentTime} {piPrice} {change24h} />
  <div class="mt-12 pt-6 border-t border-gray-800">
    <h2 class="text-2xl font-bold mb-4">Assets Generator</h2>
    <p class="mb-4">
      This dashboard is part of the Pi Coin assets generator that creates:
    </p>
    <ul class="list-disc pl-5 space-y-2 mb-6">
      <li>YouTube thumbnails (1280x720)</li>
      <li>YouTube banners (2048x1152)</li>
      <li>Social media daily updates (1080x1080)</li>
    </ul>
    <p>
      All assets feature modern design elements like gradient backgrounds,
      tech-inspired grid patterns, and real-time cryptocurrency market
      data.
    </p>
  </div>

  <div class="mt-12">
    <h2 class="text-2xl font-bold mb-4">
      Latest PI Network and PI Coin News
    </h2>
    <NewsCarousel {news} /> <!-- Pass news data to NewsCarousel component -->
  </div>

  <footer class="mt-12 text-center text-gray-500 text-sm">
    <p>2025 Pi Coin Dashboard - Real-time data powered by CoinGecko API</p>
    <p class="mt-2 text-sm">
      Data provided for educational purposes only. Not financial advice.
    </p>
  </footer>
</div>

<style>
  :global(body) {
    background-color: var(--pi-dark);
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif;
  }

  :global(:root) {
    --pi-dark: #121212;
    --pi-darker: #0a0a0a;
    --pi-teal: #4ecdc4;
  }
</style>
