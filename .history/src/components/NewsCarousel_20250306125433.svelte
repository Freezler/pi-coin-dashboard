<script>
  import { onMount } from 'svelte';
  import { fetchNews } from '../services/coinGeckoService.js';
  
  let newsItems = [];
  let currentIndex = 0;
  let loading = true;
  
  function nextNews() {
    if (newsItems.length > 0) {
      currentIndex = (currentIndex + 1) % newsItems.length;
    }
  }
  
  function prevNews() {
    if (newsItems.length > 0) {
      currentIndex = (currentIndex - 1 + newsItems.length) % newsItems.length;
    }
  }
  
  // Fetch news data
  async function updateNewsData() {
    loading = true;
    const data = await fetchNews();
    
    if (data && data.length > 0) {
      newsItems = data.map(item => ({
        ...item,
        source: 'CryptoNews',
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      }));
    } else {
      // Fallback data if API fails
      const today = new Date();
      const dateStr = today.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      
      newsItems = [
        {
          title: 'Pi Coin Surges to New Heights',
          content: 'The digital currency has seen remarkable growth in the past week, with experts attributing the rise to increasing adoption and new partnerships.',
          source: 'CryptoDashboard',
          date: dateStr
        },
        {
          title: 'Pi Network Announces Major Update',
          content: 'The team behind Pi Coin has unveiled plans for a significant protocol upgrade that aims to improve scalability and transaction throughput.',
          source: 'BlockchainNews',
          date: dateStr
        },
        {
          title: 'Institutional Interest in Pi Coin Growing',
          content: 'Several major investment firms have begun adding Pi Coin to their digital asset portfolios, signaling growing confidence in the cryptocurrency.',
          source: 'CryptoInsider',
          date: dateStr
        }
      ];
    }
    
    loading = false;
  }
  
  onMount(() => {
    updateNewsData();
    
    // Auto-rotate news items every 8 seconds
    const rotateInterval = setInterval(() => {
      nextNews();
    }, 8000);
    
    // Refresh news data every 5 minutes
    const refreshInterval = setInterval(() => {
      updateNewsData();
    }, 300000);
    
    return () => {
      clearInterval(rotateInterval);
      clearInterval(refreshInterval);
    };
  });
</script>

<div class="relative">
  <div class="overflow-hidden rounded-lg min-h-[200px]">
    {#if loading}
      <div class="min-h-[200px] p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
        <p class="text-pi-teal">Loading news...</p>
      </div>
    {:else}
      {#each newsItems as news, i}
        <div class="min-h-[200px] p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg {i === currentIndex ? 'block' : 'hidden'}">
          <h3 class="text-lg font-semibold text-pi-teal mb-2">{news.title}</h3>
          <p class="text-gray-300 text-sm mb-3">{news.content}</p>
          <div class="flex justify-between items-center text-xs text-gray-400">
            <span>{news.source}</span>
            <span>{news.date}</span>
          </div>
        </div>
      {/each}
    {/if}
  </div>
  
  <div class="flex justify-between mt-3">
    <button 
      on:click={prevNews} 
      class="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full"
      aria-label="Previous news">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <div class="flex space-x-1">
      {#each newsItems as _, i}
        <span class="w-2 h-2 rounded-full {i === currentIndex ? 'bg-pi-teal' : 'bg-gray-600'}"></span>
      {/each}
    </div>
    <button 
      on:click={nextNews} 
      class="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full"
      aria-label="Next news">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</div>
