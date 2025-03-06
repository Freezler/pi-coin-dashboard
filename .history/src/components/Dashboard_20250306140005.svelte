<script>
  import Chart from "chart.js/auto";
  import { onMount } from "svelte";
  import MarketStats from "./MarketStats.svelte";
  import NewsCarousel from "./NewsCarousel.svelte";
  import TransactionsTable from "./TransactionsTable.svelte";

  export let currentDate;
  export let currentTime;
  let piPrice = 0;
  let chart;

  async function fetchPiPrice() {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=pi-network&vs_currencies=usd",
      );
      const data = await response.json();
      piPrice = data["pi-network"].usd;
    } catch (error) {
      console.error("Error fetching Pi price:", error);
    }
  }

  onMount(async () => {
    await fetchPiPrice();

    const ctx = document.getElementById("piChart");
    if (ctx instanceof HTMLCanvasElement) {
      chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: [], // We'll update this with timestamps
          datasets: [
            {
              label: "Pi Price (USD)",
              data: [], // We'll update this with price data
              borderColor: "#4ECDC4",
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: false,
              ticks: {
                color: "#8a9caa",
              },
            },
            x: {
              ticks: {
                color: "#8a9caa",
              },
            },
          },
        },
      });

      // Update chart every minute
      setInterval(async () => {
        await fetchPiPrice();
        updateChart();
      }, 60000);
    }
  });

  function updateChart() {
    const now = new Date().toLocaleTimeString();
    chart.data.labels.push(now);
    chart.data.datasets[0].data.push(piPrice);

    // Keep only last 10 data points
    if (chart.data.labels.length > 10) {
      chart.data.labels.shift();
      chart.data.datasets[0].data.shift();
    }

    chart.update();
  }
</script>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <!-- Main Chart Section -->
  <div class="lg:col-span-2 bg-pi-darker rounded-xl p-6 shadow-lg" id="market">
    <div class="flex justify-between items-center mb-4">
      <div>
        <h2 class="text-2xl font-bold">Pi/USD</h2>
        <div class="flex items-center mt-1">
          <span class="text-3xl font-bold mr-2"
            >${typeof piPrice === "number" ? piPrice.toFixed(2) : piPrice}</span
          >
          <span class={piPrice >= 0 ? "text-green-500" : "text-red-500"}>
            {piPrice >= 0 ? "+" : ""}{typeof piPrice === "number"
              ? piPrice.toFixed(2)
              : piPrice}%
          </span>
        </div>
      </div>
      <div class="text-right text-gray-400">
        <div>{currentDate}</div>
        <div>{currentTime}</div>
      </div>
    </div>

    <div class="w-full p-4">
      <canvas id="piChart"></canvas>
    </div>

    <div class="mt-6">
      <MarketStats />
    </div>
  </div>

  <!-- Right Column -->
  <div class="space-y-6">
    <!-- News Section -->
    <div class="bg-pi-darker rounded-xl p-6 shadow-lg" id="news">
      <h2 class="text-xl font-bold mb-4">Latest News</h2>
      <NewsCarousel />
    </div>

    <!-- Transactions Section -->
    <div class="bg-pi-darker rounded-xl p-6 shadow-lg" id="transactions">
      <h2 class="text-xl font-bold mb-4">Recent Transactions</h2>
      <TransactionsTable />
    </div>
  </div>
</div>
