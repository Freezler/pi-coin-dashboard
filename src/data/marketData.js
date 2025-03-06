// Import market data from CoinMarketCap API
import marketData from '../services/coinMarketCapService';

// Function to get current Pi price
export function getPiPrice() {
  if (marketData && marketData.data && marketData.data.quote && marketData.data.quote.USD) {
    return marketData.data.quote.USD.price;
  } else {
    console.error('Market data not available');
    return null; // or a default value
  }
}

// Function to get 24h change
export function getChange24h() {
  if (marketData && marketData.data && marketData.data.quote && marketData.data.quote.USD) {
    return marketData.data.quote.USD.percent_change_24h;
  } else {
    console.error('Market data not available');
    return null; // or a default value
  }
}

// Market data for dashboard
export const marketDataFormatted = [
  {
    label: '24h Volume',
    value: marketData && marketData.data && marketData.data.quote && marketData.data.quote.USD ? `$${marketData.data.quote.USD.volume_24h.toLocaleString()}` : 'N/A',
    change: marketData && marketData.data && marketData.data.quote && marketData.data.quote.USD ? marketData.data.quote.USD.percent_change_24h : 'N/A'
  },
  {
    label: 'Market Cap',
    value: marketData && marketData.data && marketData.data.quote && marketData.data.quote.USD ? `$${marketData.data.quote.USD.market_cap.toLocaleString()}` : 'N/A',
    change: marketData && marketData.data && marketData.data.quote && marketData.data.quote.USD ? marketData.data.quote.USD.percent_change_24h : 'N/A'
  },
  {
    label: 'Circulating Supply',
    value: marketData && marketData.data ? `${marketData.data.circulating_supply.toLocaleString()} π` : 'N/A',
  },
  {
    label: 'All-Time High',
    value: marketData && marketData.data && marketData.data.quote && marketData.data.quote.USD ? `$${marketData.data.quote.USD.percent_change_1y}` : 'N/A',
    change: marketData && marketData.data && marketData.data.quote && marketData.data.quote.USD ? marketData.data.quote.USD.percent_change_1y : 'N/A'
  },
  {
    label: '24h Low / High',
    value: marketData && marketData.data && marketData.data.quote && marketData.data.quote.USD ? `$${marketData.data.quote.USD.low_24h} / $${marketData.data.quote.USD.high_24h}` : 'N/A',
  },
  {
    label: 'Sentiment',
    value: marketData && marketData.data ? (marketData.data.sentiment > 0 ? 'Bullish' : 'Bearish') : 'N/A',
    change: marketData && marketData.data ? marketData.data.sentiment : 'N/A'
  }
];
