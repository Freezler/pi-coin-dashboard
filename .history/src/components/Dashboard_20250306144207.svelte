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
  let selectedTimeRange = "1h"; // Standaard 1 uur

  // Tijdsbereik opties
  const timeRanges = [
    { value: "15m", label: "15 min" },
    { value: "1h", label: "1 uur" },
    { value: "24h", label: "24 uur" },
    { value: "7d", label: "7 dagen" },
  ];

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

      // Behoud alleen data van laatste week (voor langere tijdsbereiken)
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      priceHistory = priceHistory.filter((item) => item.time > oneWeekAgo);
    } catch (error) {
      console.error("Error fetching Pi price:", error);
    }
  }

  function changeTimeRange(range) {
    selectedTimeRange = range;
    updateChart();
  }

  function getFilteredHistory() {
    let cutoffTime;

    switch (selectedTimeRange) {
      case "15m":
        cutoffTime = new Date(Date.now() - 15 * 60 * 1000);
        break;
      case "1h":
        cutoffTime = new Date(Date.now() - 60 * 60 * 1000);
        break;
      case "24h":
        cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
        break;
      case "7d":
        cutoffTime = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      default:
        cutoffTime = new Date(Date.now() - 60 * 60 * 1000);
    }

    return priceHistory.filter((item) => item.time > cutoffTime);
  }

  onMount(async () => {
    await fetchPiPrice();

    // Voeg wat dummy historische data toe voor een zichtbare lijn
    const now = new Date();
    // Genereer data voor een week
    for (let i = 168; i > 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60000); // Uurlijkse data
      // Genereer een willekeurige prijs rond de huidige prijs (voor demo)
      const randomPrice = piPrice * (0.9 + Math.random() * 0.2);
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
          labels: [],
          datasets: [
            {
              label: "Pi Price (USD)",
              data: [],
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
            duration: 500,
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

      // Initiële update
      updateChart();

      // Update vaker voor een meer realtime ervaring
      setInterval(async () => {
        await fetchPiPrice();
        updateChart();
      }, 500);
    }
  });

  function updateChart() {
    const filteredHistory = getFilteredHistory();

    // Pas het formaat aan op basis van het tijdsbereik
    let timeFormat;
    if (selectedTimeRange === "7d" || selectedTimeRange === "24h") {
      timeFormat = (item) =>
        item.time.toLocaleDateString() +
        " " +
        item.time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
    } else {
      timeFormat = (item) => item.time.toLocaleTimeString();
    }

    chart.data.labels = filteredHistory.map(timeFormat);
    chart.data.datasets[0].data = filteredHistory.map((item) => item.price);

    // Pas het aantal punten aan op basis van het tijdsbereik
    let pointRadius;
    if (selectedTimeRange === "7d") {
      pointRadius = 0; // Geen punten voor lange periodes
    } else if (selectedTimeRange === "24h") {
      pointRadius = 1; // Kleine punten voor middellange periodes
    } else {
      pointRadius = 3; // Normale punten voor korte periodes
    }
    chart.data.datasets[0].pointRadius = pointRadius;

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

    <!-- Tijdsbereik selector -->
    <div class="flex justify-end mb-2">
      <div class="bg-pi-dark rounded-lg p-1 inline-flex">
        {#each timeRanges as range}
          <button
            class="px-3 py-1 text-sm rounded-md {selectedTimeRange ===
            range.value
              ? 'bg-pi-teal text-black font-medium'
              : 'text-gray-400 hover:text-white'}"
            on:click={() => changeTimeRange(range.value)}
          >
            {range.label}
          </button>
        {/each}
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
