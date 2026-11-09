/**
 * Format a star count for display, e.g. 950, 4.1k, 1.2M
 */
export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return num.toString();
}

/**
 * Format a date as a short relative time, e.g. "3 days ago" or "2 years ago"
 */
export function formatRelativeTime(dateString: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  const units: [number, string][] = [
    [31536000, 'year'],
    [2592000, 'month'],
    [86400, 'day'],
    [3600, 'hour'],
  ];
  for (const [size, name] of units) {
    const count = Math.floor(seconds / size);
    if (count >= 1) {
      return `${count} ${name}${count === 1 ? '' : 's'} ago`;
    }
  }
  return 'today';
}

/**
 * The host and first path segment of a link, e.g. "github.com/ChuckerTeam" or
 * "developer.android.com", so readers can see where a tool comes from.
 */
export function linkSource(link: string): string {
  try {
    const url = new URL(link);
    const host = url.hostname.replace(/^www\./, '');
    if (host === 'github.com') {
      const owner = url.pathname.split('/').filter(Boolean)[0];
      return owner ? `github.com/${owner}` : host;
    }
    return host;
  } catch {
    return link;
  }
}

/**
 * Pick the same item for everyone on a given day, and a different one the next day
 */
export function getToolOfTheDay<T>(tools: T[]): T | null {
  if (tools.length === 0) return null;

  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  // One step of a linear congruential generator
  const random = ((1664525 * seed + 1013904223) % 2 ** 32) / 2 ** 32;
  return tools[Math.floor(random * tools.length)];
}
