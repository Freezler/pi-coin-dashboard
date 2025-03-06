import axios from 'axios';

export const newsItems = async () => {
  try {
    const response = await axios.get('https://newsapi.org/v2/everything?q=Pi+Network+OR+Pi+Coin&sortBy=publishedAt&apiKey=YOUR_API_KEY');
    const data = response.data;
    return data.articles.map(article => ({
      title: article.title,
      content: article.description,
      source: article.source.name,
      date: article.publishedAt
    }));
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};
