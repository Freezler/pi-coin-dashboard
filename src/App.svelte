<script>
  import { onMount } from 'svelte';
  import Navbar from './components/Navbar.svelte';
  import Dashboard from './components/Dashboard.svelte';
  import { marketData, getPiPrice, getChange24h } from './data/marketData';
  import { newsItems } from './data/newsData';
  import { transactions } from './data/transactionData';
  
  let currentDate = "March 6, 2025";
  let currentTime = "12:13 PM";
  let piPrice = getPiPrice();
  let change24h = getChange24h();
  
  // Update time every minute
  onMount(() => {
    const timer = setInterval(() => {
      const now = new Date();
      currentTime = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    }, 60000);
    
    return () => {
      clearInterval(timer);
    };
  });
</script>

<main class="min-h-screen bg-pi-dark text-white">
  <div class="grid-pattern">
    <Navbar {piPrice} {change24h} />
    <div class="container mx-auto px-4 py-8">
      <Dashboard 
        {currentDate} 
        {currentTime}
        {piPrice}
        {change24h}
        {marketData}
        {newsItems}
        {transactions}
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
        <div class="flex flex-wrap gap-4">
          <div class="bg-pi-darker p-4 rounded-lg">
            <h3 class="text-pi-teal font-bold mb-2">Design Features</h3>
            <ul class="list-disc pl-5">
              <li>Gradient backgrounds</li>
              <li>Tech-inspired grid patterns</li>
              <li>Dynamic pricing data</li>
              <li>Current date information</li>
            </ul>
          </div>
          <div class="bg-pi-darker p-4 rounded-lg">
            <h3 class="text-pi-red font-bold mb-2">Assets Preview</h3>
            <div class="flex flex-col space-y-2">
              <a href="/assets/thumbnail-preview.png" class="text-pi-teal hover:underline">View Thumbnail</a>
              <a href="/assets/banner-preview.png" class="text-pi-teal hover:underline">View Banner</a>
              <a href="/assets/daily-update-preview.png" class="text-pi-teal hover:underline">View Daily Update</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <footer class="bg-pi-darker py-6 mt-12">
      <div class="container mx-auto px-4 text-center text-gray-400">
        <p> 2025 Pi Coin Dashboard. All rights reserved.</p>
        <p class="mt-2 text-sm">Data provided for educational purposes only. Not financial advice.</p>
      </div>
    </footer>
  </div>
</main>

<style>
  :global(html) {
    scroll-behavior: smooth;
  }
</style>
