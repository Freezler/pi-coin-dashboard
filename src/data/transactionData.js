// Fetch real transaction data from an API
import axios from 'axios';

export async function fetchTransactions() {
  const response = await axios.get('https://api.binance.com/api/v3/depth', {
    params: {
      symbol: 'PI-USDT',
      limit: 1000
    }
  });

  const transactions = response.data;
  return transactions;
}

export default fetchTransactions;
