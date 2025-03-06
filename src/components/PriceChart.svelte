<script>
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';
  
  let chartElement;
  let chart;
  
  // Generate mock price data similar to typical cryptocurrency price movement
  function generateMockPriceData() {
    const prices = [];
    const labels = [];
    let price = 14.50; // Starting price
    
    for (let i = 0; i < 100; i++) {
      // Add some volatility
      const change = (Math.random() - 0.5) * 0.5;
      price = Math.max(10, price + change);
      prices.push(price);
      
      // Generate time labels (last 100 minutes)
      const date = new Date();
      date.setMinutes(date.getMinutes() - (100 - i));
      const timeStr = date.toLocaleTimeString('en-US', { 
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      labels.push(timeStr);
    }
    
    return { prices, labels };
  }
  
  onMount(() => {
    const { prices, labels } = generateMockPriceData();
    
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
                return '$' + value;
              }
            }
          }
        }
      }
    };
    
    chart = new Chart(chartElement, config);
    
    return () => {
      chart.destroy();
    };
  });
</script>

<div class="w-full h-[400px]">
  <canvas bind:this={chartElement}></canvas>
</div>

<div class="flex justify-center space-x-4 mt-4">
  <button class="bg-pi-darker border border-gray-700 hover:border-gray-500 px-4 py-2 rounded text-sm">1H</button>
  <button class="bg-pi-darker border border-gray-700 hover:border-gray-500 px-4 py-2 rounded text-sm">4H</button>
  <button class="bg-pi-teal border border-pi-teal px-4 py-2 rounded text-sm">1D</button>
  <button class="bg-pi-darker border border-gray-700 hover:border-gray-500 px-4 py-2 rounded text-sm">1W</button>
  <button class="bg-pi-darker border border-gray-700 hover:border-gray-500 px-4 py-2 rounded text-sm">1M</button>
</div>
