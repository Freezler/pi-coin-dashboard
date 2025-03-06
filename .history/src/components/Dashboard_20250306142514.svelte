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
  let priceHistory = []; // Array voor historische data

  async function fetchPiPrice() {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=pi-network&vs_currencies=usd",
      );
      const data = await response.json();
      piPrice = data["pi-network"].usd;

      // Voeg nieuwe prijs toe aan geschiedenis
      priceHistory.push({
        time: new Date(),
        price: piPrice,
      });

      // Behoud alleen data van laatste uur
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      priceHistory = priceHistory.filter((item) => item.time > oneHourAgo);
    } catch (error) {
      console.error("Error fetching Pi price:", error);
    }
  }

  onMount(async () => {
    await fetchPiPrice();

    // Voeg wat dummy historische data toe voor een zichtbare lijn
    const now = new Date();
    for (let i = 10; i > 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60000); // 6 minuten terug per punt
      // Genereer een willekeurige prijs rond de huidige prijs (voor demo)
      const randomPrice = piPrice * (0.95 + Math.random() * 0.1);
      priceHistory.push({
        time: time,
        price: randomPrice,
      });
    }

    const ctx = document.getElementById("piChart");
    if (ctx instanceof HTMLCanvasElement) {
      chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: priceHistory.map((item) => item.time.toLocaleTimeString()),
          datasets: [
            {
              label: "Pi Price (USD)",
              data: priceHistory.map((item) => item.price),
              borderColor: "#4ECDC4",
              borderWidth: 3,
              tension: 0.4,
              fill: false,
              pointRadius: 3,
              pointBackgroundColor: "#4ECDC4",
            },
          ],
        },
        options: {
          responsive: true,
          animation: {
            duration: 1000,
          },
          scales: {
            y: {
              beginAtZero: false,
              grid: {
                color: "rgba(138, 156, 170, 0.1)",
              },
              ticks: {
                color: "#8a9caa",
              },
            },
            x: {
              grid: {
                color: "rgba(138, 156, 170, 0.1)",
              },
              ticks: {
                color: "#8a9caa",
                maxTicksLimit: 6,
              },
            },
          },
        },
      });

      // Update vaker voor een meer realtime ervaring
      setInterval(async () => {
        await fetchPiPrice();
        updateChart();
      }, 1000); // Update elke 10 seconden
    }
  });

  function updateChart() {
    chart.data.labels = priceHistory.map((item) =>
      item.time.toLocaleTimeString(),
    );
    chart.data.datasets[0].data = priceHistory.map((item) => item.price);
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
