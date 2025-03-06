<script>
  import { onMount } from 'svelte';
  import { fetchCoinData } from '../services/coinGeckoService.js';
  
  let marketData = [];
  let loading = true;
  
  // Format large numbers with commas
  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  // Update market data with real data
  async function updateMarketData() {
    loading = true;
    const data = await fetchCoinData();
    
    if (data) {
      marketData = [
        {
          label: "Market Cap",
          value: `$${formatNumber(data.market_cap)}`
        },
        {
          label: "24h Volume",
          value: `$${formatNumber(data.total_volume)}`
        },
        {
          label: "Price",
          value: `$${data.current_price}`,
          change: parseFloat(data.price_change_percentage_24h)
        },
        {
          label: "Circulating Supply",
          value: `${formatNumber(data.circulating_supply)} PI`
        },
        {
          label: "Total Supply",
          value: `${formatNumber(data.total_supply)} PI`
        },
        {
          label: "Updated",
          value: new Date().toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        }
      ];
    } else {
      // Fallback data if API fails
      marketData = [
        { label: "Market Cap", value: "$18,120,947,339" },
        { label: "24h Volume", value: "$472,496,845" },
        { label: "Price", value: "$91,367.00", change: 1.51 },
        { label: "Circulating Supply", value: "1,983,298 PI" },
        { label: "Total Supply", value: "1,983,298 PI" },
        { label: "Updated", value: "Mar 6, 2025, 12:57 PM" }
      ];
    }
    
    loading = false;
  }
  
  onMount(() => {
    updateMarketData();
    
    // Update market data every 60 seconds
    const interval = setInterval(updateMarketData, 60000);
    
    return () => {
      clearInterval(interval);
    };
  });
</script>

<div class="grid grid-cols-2 gap-4">
  {#if loading}
    <div class="col-span-2 text-center text-gray-400">Loading market data...</div>
  {:else}
    <div class="bg-gray-800 bg-opacity-50 p-4 rounded-lg col-span-2">
      <table class="w-full">
        <thead>
          <tr>
            <th class="text-gray-400 text-sm">Metric</th>
            <th class="text-gray-400 text-sm">Value</th>
          </tr>
        </thead>
        <tbody>
          {#each marketData as item}
            <tr>
              <td class="text-gray-400 text-sm">{item.label}</td>
              <td class="text-lg font-bold mt-1">{item.value}</td>
              {#if item.change !== undefined}
                <td class={item.change >= 0 ? "text-green-500 text-sm" : "text-red-500 text-sm"}>
                  {item.change >= 0 ? "+" : ""}{item.change}%
                </td>
              {/if}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
