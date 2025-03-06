<script>
  export let marketData;
</script>

<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
  {#each marketData as item}
    <div class="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
      <p class="text-gray-400 text-sm">{item.label}</p>
      <p class="text-lg font-bold mt-1">{item.value}</p>
      {#if item.change !== undefined}
        <p class={item.change >= 0 ? "text-green-500 text-sm" : "text-red-500 text-sm"}>
          {item.change >= 0 ? "+" : ""}{item.change}%
        </p>
      {/if}
    </div>
  {/each}
</div>
