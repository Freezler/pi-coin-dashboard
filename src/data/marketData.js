// Current Pi price
let piPrice = 14.82;

// 24h change percentage
let change24h = 3.75;

// Function to get current Pi price
export function getPiPrice() {
  return piPrice;
}

// Function to get 24h change
export function getChange24h() {
  return change24h;
}

// Market data for dashboard
export const marketData = [
  {
    label: '24h Volume',
    value: '$238.5M',
    change: 5.2
  },
  {
    label: 'Market Cap',
    value: '$7.91B',
    change: 3.8
  },
  {
    label: 'Circulating Supply',
    value: '533.7M π',
  },
  {
    label: 'All-Time High',
    value: '$21.45',
    change: -30.9
  },
  {
    label: '24h Low / High',
    value: '$14.21 / $15.03',
  },
  {
    label: 'Sentiment',
    value: 'Bullish',
    change: 12.5
  }
];
