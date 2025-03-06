<script>
  import { onMount } from 'svelte';
  import { fetchCoinData, generateTransactions } from '../services/coinGeckoService.js';
  
  let transactions = [];
  let loading = true;
  
  // Format time to display
  function formatTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  // Update transactions with real price data
  async function updateTransactions() {
    loading = true;
    const coinData = await fetchCoinData();
    
    if (coinData) {
      transactions = generateTransactions(parseFloat(coinData.current_price))
        .map(tx => ({
          ...tx,
          time: formatTime(tx.time)
        }));
    } else {
      // Fallback data if API fails
      const now = new Date();
      transactions = [
        { type: 'buy', amount: 25, price: 14.50, time: formatTime(new Date(now - 1000 * 60 * 5).toISOString()) },
        { type: 'sell', amount: 10, price: 14.48, time: formatTime(new Date(now - 1000 * 60 * 10).toISOString()) },
        { type: 'buy', amount: 15, price: 14.45, time: formatTime(new Date(now - 1000 * 60 * 15).toISOString()) },
        { type: 'buy', amount: 50, price: 14.30, time: formatTime(new Date(now - 1000 * 60 * 20).toISOString()) },
        { type: 'sell', amount: 30, price: 14.20, time: formatTime(new Date(now - 1000 * 60 * 25).toISOString()) }
      ];
    }
    
    loading = false;
  }
  
  onMount(() => {
    updateTransactions();
    
    // Update transactions every 30 seconds
    const interval = setInterval(updateTransactions, 30000);
    
    return () => {
      clearInterval(interval);
    };
  });
</script>

<div class="overflow-x-auto relative">
  {#if loading}
    <div class="absolute inset-0 flex items-center justify-center bg-pi-dark bg-opacity-70 z-10">
      <div class="text-pi-teal">Loading transactions...</div>
    </div>
  {/if}

  <table class="min-w-full">
    <thead>
      <tr class="text-left text-gray-400 text-sm border-b border-gray-700">
        <th class="pb-2">Type</th>
        <th class="pb-2">Amount</th>
        <th class="pb-2">Price</th>
        <th class="pb-2">Time</th>
      </tr>
    </thead>
    <tbody>
      {#each transactions as tx}
        <tr class="border-b border-gray-800 text-sm">
          <td class="py-3">
            <span class={tx.type === 'buy' ? 'text-green-500' : 'text-red-500'}>
              {tx.type === 'buy' ? 'Buy' : 'Sell'}
            </span>
          </td>
          <td class="py-3">{tx.amount} π</td>
          <td class="py-3">${typeof tx.price === 'number' ? tx.price.toFixed(2) : tx.price}</td>
          <td class="py-3 text-gray-400">{tx.time}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<div class="text-center mt-4">
  <button class="text-pi-teal hover:underline text-sm">
    View All Transactions
  </button>
</div>
