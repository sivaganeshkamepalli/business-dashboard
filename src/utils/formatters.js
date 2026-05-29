/**
 * Format a number as Indian Rupee currency string.
 * e.g. 50000 → ₹50,000
 */
export function formatSalary(value) {
  const num = Number(value);
  if (isNaN(num)) return value;
  return '₹' + num.toLocaleString('en-IN');
}

/**
 * Format meters into human-readable distance.
 * e.g. 800 → "800 m"  |  2200 → "2.2 km"
 */
export function formatDistance(meters) {
  const m = Number(meters);
  if (isNaN(m)) return '0 m';
  if (m >= 1000) {
    return (m / 1000).toFixed(1).replace(/\.0$/, '') + ' km';
  }
  return m + ' m';
}

/**
 * Format an ISO timestamp into readable date/time.
 * e.g. "2026-05-29T10:30:00" → "29 May 2026, 10:30 AM"
 */
export function formatDateTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const options = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };
  return date.toLocaleString('en-IN', options).replace(',', ',');
}

/**
 * Generate a unique ID.
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
