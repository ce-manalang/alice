// Function to format date as "Month Day, Year"
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const day = date.getDate(); // This gives us the day without leading zero
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}
