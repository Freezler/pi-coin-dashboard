<script>
  export let piPrice;
  export let change24h;
  
  // Calculate the color based on positive or negative change
  $: changeColor = change24h >= 0 ? 'text-green-500' : 'text-red-500';
  $: changeSign = change24h >= 0 ? '+' : '';
</script>

<nav class="bg-pi-darker py-4 px-6 shadow-lg">
  <div class="container mx-auto flex justify-between items-center">
    <div class="flex items-center">
      <div class="w-10 h-10 bg-pi-red rounded-full flex items-center justify-center mr-3">
        <span class="text-white font-bold text-xl">π</span>
      </div>
      <h1 class="text-2xl font-bold text-white">Pi Coin Dashboard</h1>
    </div>
    
    <div class="hidden md:flex items-center space-x-8">
      <a href="#market" class="text-gray-300 hover:text-white transition-colors">Market</a>
      <a href="#news" class="text-gray-300 hover:text-white transition-colors">News</a>
      <a href="#transactions" class="text-gray-300 hover:text-white transition-colors">Transactions</a>
    </div>
    
    <div class="flex items-center">
      <div class="mr-2 md:mr-4">
        <p class="text-lg md:text-xl font-bold">${piPrice.toFixed(2)}</p>
        <p class="text-sm {changeColor}">{changeSign}{change24h.toFixed(2)}%</p>
      </div>
      <button class="bg-pi-red hover:bg-opacity-80 text-white px-4 py-2 rounded-lg transition-colors">
        Connect Wallet
      </button>
    </div>
  </div>
</nav>
