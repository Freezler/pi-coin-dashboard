export async function fetchNews() {
  const response = await fetch('https://api.example.com/pi-news'); // Vervang dit door de juiste API-endpoint
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
}