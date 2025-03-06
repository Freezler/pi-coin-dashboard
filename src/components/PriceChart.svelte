<script>
  import { onMount, onDestroy } from 'svelte';
  import Chart from 'chart.js/auto';
  import { fetchHistoricalData } from '../services/coinGeckoService.js';
  
  let chartElement;
  let chart;
  let timeframe = '7'; // Default to 7 days
  let loading = true;
  
  // Function to fetch and update chart data
  async function updateChartData(days = 7) {
    loading = true;
    const priceData = await fetchHistoricalData(days);
    
    if (!priceData || priceData.length === 0) {
      loading = false;
      return;
    }
    
    const prices = priceData.map(item => item.price);
    const labels = priceData.map(item => {
      const date = new Date(item.timestamp);
      return date.toLocaleDateString('en-US', { 
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    });
    
    if (chart) {
      chart.data.labels = labels;
      chart.data.datasets[0].data = prices;
      chart.update();
    } else {
      initChart(prices, labels);
    }
    
    loading = false;
  }
  
  // Initialize chart with data
  function initChart(prices, labels) {
    const data = {
      labels: labels,
      datasets: [{
        label: 'Pi Price (USD)',
        data: prices,
        borderColor: '#4ECDC4',
        backgroundColor: 'rgba(78, 205, 196, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4
      }]
    };
    
    const config = {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(18, 18, 18, 0.9)',
            titleColor: '#fff',
            bodyColor: '#aaa',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 10,
            displayColors: false,
            callbacks: {
              label: function(context) {
                return `$${context.parsed.y.toFixed(2)}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false,
              drawBorder: false
            },
            ticks: {
              color: '#8a9caa',
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 6
            }
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)',
              drawBorder: false
            },
            ticks: {
              color: '#8a9caa',
              callback: function(value) {
                return '$' + value.toFixed(2);
              }
            }
          }
        }
      }
    };
    
    chart = new Chart(chartElement, config);
  }
  
  // Handle timeframe button clicks
  function setTimeframe(days) {
    timeframe = days;
    updateChartData(days);
  }
  
  onMount(() => {
    updateChartData(timeframe);
  });
  
  onDestroy(() => {
    if (chart) {
      chart.destroy();
    }
  });
</script>

<div class="w-full h-[400px] relative">
  {#if loading}
    <div class="absolute inset-0 flex items-center justify-center bg-pi-dark bg-opacity-70 z-10">
      <div class="text-pi-teal">Loading chart data...</div>
    </div>
  {/if}
  <canvas bind:this={chartElement}></canvas>
</div>

<div class="flex justify-center space-x-4 mt-4">
  <button 
    class="bg-pi-darker border {timeframe === '1' ? 'border-pi-teal' : 'border-gray-700 hover:border-gray-500'} px-4 py-2 rounded text-sm"
    on:click={() => setTimeframe('1')}>
    1D
  </button>
  <button 
    class="bg-pi-darker border {timeframe === '7' ? 'border-pi-teal' : 'border-gray-700 hover:border-gray-500'} px-4 py-2 rounded text-sm"
    on:click={() => setTimeframe('7')}>
    1W
  </button>
  <button 
    class="bg-pi-darker border {timeframe === '30' ? 'border-pi-teal' : 'border-gray-700 hover:border-gray-500'} px-4 py-2 rounded text-sm"
    on:click={() => setTimeframe('30')}>
    1M
  </button>
  <button 
    class="bg-pi-darker border {timeframe === '90' ? 'border-pi-teal' : 'border-gray-700 hover:border-gray-500'} px-4 py-2 rounded text-sm"
    on:click={() => setTimeframe('90')}>
    3M
  </button>
  <button 
    class="bg-pi-darker border {timeframe === '365' ? 'border-pi-teal' : 'border-gray-700 hover:border-gray-500'} px-4 py-2 rounded text-sm"
    on:click={() => setTimeframe('365')}>
    1Y
  </button>
</div>
