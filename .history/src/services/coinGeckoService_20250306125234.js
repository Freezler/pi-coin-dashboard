/**
 * Service to fetch cryptocurrency data from CoinGecko API
 */

// Base URL for CoinGecko API
const API_URL = 'https://api.coingecko.com/api/v3';

/**
 * Fetch current price, market cap, volume, and 24h change for Pi Coin
 * For demo purposes, we're using Bitcoin data from CoinGecko as Pi Coin isn't listed
 */
export const fetchCoinData = async () => {
  try {
    const response = await fetch(`${API_URL}/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch coin data');
    }
    
    const data = await response.json();
    
    // Format data to simulate Pi Coin
    return {
      name: 'Pi Coin',
      symbol: 'PI',
      current_price: data.market_data.current_price.usd.toFixed(2),
      price_change_percentage_24h: data.market_data.price_change_percentage_24h.toFixed(2),
      market_cap: Math.floor(data.market_data.market_cap.usd / 100),
      total_volume: Math.floor(data.market_data.total_volume.usd / 100),
      circulating_supply: Math.floor(data.market_data.circulating_supply / 10),
      total_supply: Math.floor(data.market_data.total_supply / 10)
    };
  } catch (error) {
    console.error('Error fetching coin data:', error);
    return null;
  }
};

/**
 * Fetch historical price data for Pi Coin
 * For demo purposes, we're using Bitcoin data from CoinGecko
 */
export const fetchHistoricalData = async (days = 7) => {
  try {
    const response = await fetch(`${API_URL}/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch historical data');
    }
    
    const data = await response.json();
    
    // Format prices for chart
    return data.prices.map(price => ({
      timestamp: price[0],
      price: price[1] / 1000 // Scale down Bitcoin price to simulate Pi Coin
    }));
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return [];
  }
};

/**
 * Fetch cryptocurrency news
 * Since CoinGecko doesn't provide news, we'll use their trending coins as a substitute
 */
export const fetchNews = async () => {
  try {
    const response = await fetch(`${API_URL}/search/trending`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch trending coins');
    }
    
    const data = await response.json();
    
    // Transform trending coins into news items
    return data.coins.map(coin => ({
      id: coin.item.id,
      title: `${coin.item.name} (${coin.item.symbol}) is trending!`,
      content: `${coin.item.name} has seen significant market activity recently, ranking #${coin.item.market_cap_rank} by market cap.`,
      date: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};

/**
 * Generate mock transactions using real price data
 */
export const generateTransactions = (price) => {
  const transactionTypes = ['buy', 'sell'];
  const transactions = [];
  
  for (let i = 0; i < 10; i++) {
    const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
    const amount = Math.floor(Math.random() * 100) + 1;
    const priceVariation = price * (0.95 + Math.random() * 0.1); // Price with ±5% variation
    
    transactions.push({
      id: `tx-${i}`,
      type,
      amount,
      price: priceVariation.toFixed(2),
      total: (amount * priceVariation).toFixed(2),
      time: new Date(Date.now() - i * 1000 * 60 * 5).toISOString() // Every 5 minutes
    });
  }
  
  return transactions;
};
