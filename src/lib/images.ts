/**
 * Sanitizes image URLs from the Platzi Fake Store API, which often performs
 * nested JSON stringification or includes brackets/quotes in the response.
 */
export const cleanImageUrl = (url: any, fallback: string = 'https://via.placeholder.com/300'): string => {
  if (!url) return fallback;

  let str = '';

  // Handle array input
  if (Array.isArray(url)) {
    str = url[0] || '';
  } else {
    str = String(url);
  }

  // Remove common JSON-stringified artifacts: ["..."], \", [, ], etc.
  // Also handle cases like "https://api.escuelajs.co/api/v1/files/9dd7.jpg" (with quotes)
  const cleaned = str.replace(/[\[\]"\\ ]/g, '').trim();

  // Basic validation that it's a URL
  if (cleaned.startsWith('http')) {
    return cleaned;
  }

  // Fallback if not a valid URL
  return fallback;
};
