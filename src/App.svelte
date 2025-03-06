<script>
  import { onMount } from 'svelte';
  import Navbar from './components/Navbar.svelte';
  import Dashboard from './components/Dashboard.svelte';
  
  let currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  let currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  let piPrice = 0;
  let change24h = 0;
  let loading = true;
  let data;

  // Update price and market data
  async function updatePriceData() {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=pi-network&vs_currencies=usd');
    if (response.ok) {
      const result = await response.json();
      data = result['pi-network'];
      piPrice = data.usd;
      // Note: The CoinGecko API does not provide 24h price change percentage for Pi Network
      // You may need to use a different API or calculate it manually
      change24h = 0;
    } else {
      console.error('Failed to fetch data');
    }
    loading = false;
  }
  
  // Update time every minute
  onMount(() => {
    updatePriceData();
    
    // Update price every 60 seconds
    const priceTimer = setInterval(updatePriceData, 60000);
    
    // Update time every minute
    const timeTimer = setInterval(() => {
      const now = new Date();
      currentTime = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    }, 60000);
    
    // Update data every 5 minutes
    const dataTimer = setInterval(updatePriceData, 5 * 60 * 1000);
    
    return () => {
      clearInterval(timeTimer);
      clearInterval(priceTimer);
      clearInterval(dataTimer);
    };
  });
</script>

<main class="min-h-screen bg-pi-dark text-white">
  <div class="grid-pattern">
    <Navbar {piPrice} {change24h} {loading} />
    <div class="container mx-auto px-4 py-8">
      <Dashboard 
        {currentDate} 
        {currentTime}
        {piPrice}
        {change24h}
      />
      
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
          All assets feature modern design elements like gradient backgrounds, tech-inspired grid patterns, and real-time cryptocurrency market data.
        </p>
      </div>
      
      <footer class="mt-12 text-center text-gray-500 text-sm">
        <p> 2025 Pi Coin Dashboard - Real-time data powered by CoinGecko API</p>
        <p class="mt-2 text-sm">Data provided for educational purposes only. Not financial advice.</p>
      </footer>
    </div>
  </div>
</main>

<style>
  .grid-pattern {
    background-color: #121212;
    background-image: 
      linear-gradient(rgba(52, 211, 153, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(52, 211, 153, 0.05) 1px, transparent 1px);
    background-size: 30px 30px;
    background-position: center center;
  }
  
  :global(body) {
    background-color: #121212;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }
  
  :global(:root) {
    --pi-dark: #121212;
    --pi-darker: #0a0a0a;
    --pi-teal: #4ECDC4;
  }
</style>
