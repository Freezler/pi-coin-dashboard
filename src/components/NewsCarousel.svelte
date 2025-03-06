<script>
  export let newsItems;
  let currentIndex = 0;
  
  function nextNews() {
    currentIndex = (currentIndex + 1) % newsItems.length;
  }
  
  function prevNews() {
    currentIndex = (currentIndex - 1 + newsItems.length) % newsItems.length;
  }
  
  // Auto-rotate news items every 8 seconds
  import { onMount } from 'svelte';
  
  onMount(() => {
    const interval = setInterval(() => {
      nextNews();
    }, 8000);
    
    return () => clearInterval(interval);
  });
</script>

<div class="relative">
  <div class="overflow-hidden rounded-lg">
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
  </div>
  
  <div class="flex justify-between mt-3">
    <button on:click={prevNews} class="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <div class="flex space-x-1">
      {#each newsItems as _, i}
        <span class="w-2 h-2 rounded-full {i === currentIndex ? 'bg-pi-teal' : 'bg-gray-600'}"></span>
      {/each}
    </div>
    <button on:click={nextNews} class="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</div>
