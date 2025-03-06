<script>
  // News data for the dashboard
  export let news = [
    {
      title: "Pi Network Announces New Exchange Listings",
      description:
        "Pi Coin is set to be listed on three major cryptocurrency exchanges next month, potentially increasing accessibility and liquidity for traders.",
      url: "https://cryptonews.net/news/pi-network-announces-new-exchange-listings-2025-03-07/",
    },
    {
      title: "Pi Core Team Reveals Roadmap for Q2 2025",
      description:
        "The Pi Network development team has unveiled an ambitious roadmap for Q2 2025, including smart contract functionality and cross-chain bridges.",
      url: "https://blockchaininsider.net/pi-core-team-reveals-roadmap-for-q2-2025/",
    },
    {
      title: "Pi Ecosystem Growing: Over 250 dApps in Development",
      description:
        "The Pi Network ecosystem continues to expand with more than 250 decentralized applications currently in various stages of development.",
      url: "https://dappradar.com/blog/pi-ecosystem-growing-over-250-dapps-in-development/",
    },
    {
      title: "Pi Foundation Launches $15M Developer Grant Program",
      description:
        "The Pi Foundation has announced a $15 million grant program aimed at supporting developers building applications on the Pi Network.",
      url: "https://cryptover.net/pi-foundation-launches-15m-developer-grant-program/",
    },
    {
      title: "Pi Network Surpasses 55 Million Active Users Globally",
      description:
        "In a significant milestone, the Pi Network has reported that it now has over 55 million active users worldwide, making it one of the fastest-growing cryptocurrency projects.",
      url: "https://techtoday.news/pi-network-surpasses-55-million-active-users-globally/",
    },
    {
      title: "Pi Coin Sees Record Trading Volume",
      description:
        "Pi Coin has seen a significant increase in trading volume over the past week, with many investors buying up the cryptocurrency in anticipation of its upcoming exchange listings.",
      url: "https://cryptoslate.com/pi-coin-sees-record-trading-volume/",
    },
  ];

  // Filter news items to include only PI-related articles
  $: news = news.filter(
    (item) =>
      item.title.toLowerCase().includes("pi") ||
      item.description.toLowerCase().includes("pi"),
  );
</script>

<style>
  body {
    background-color: #121212; /* Dark background */
    color: #ffffff; /* Light text color */
  }

  .carousel {
    max-height: 400px; /* Limit height to fit the screen */
    overflow-y: auto; /* Enable vertical scrolling */
    border: 1px solid #444; /* Darker border */
    border-radius: 8px;
    padding: 10px;
    background-color: #1e1e1e; /* Darker carousel background */
  }

  .carousel-item {
    margin: 10px 0;
    padding: 10px;
    border: 1px solid #333; /* Darker item border */
    border-radius: 5px;
    background-color: #2a2a2a; /* Dark item background */
    box-shadow: 0 2px 4px rgba(255, 255, 255, 0.1);
    transition: transform 0.2s;
  }

  .carousel-item:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 8px rgba(255, 255, 255, 0.2);
  }
</style>

<div class="carousel">
  {#each news as article}
    <div class="carousel-item">
      <a href={article.url} target="_blank">{article.title}</a>
      <p>{article.description}</p>
    </div>
  {/each}
</div>
