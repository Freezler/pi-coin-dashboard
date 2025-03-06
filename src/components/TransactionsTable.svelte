<script>
  export let transactions;
</script>

<div class="overflow-x-auto">
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
          <td class="py-3">${tx.price.toFixed(2)}</td>
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
