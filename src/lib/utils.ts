import { twMerge, ClassNameValue } from "tailwind-merge"

// GitHub API utility functions
export interface GitHubRepoStats {
  stars: number;
  forks: number;
  lastUpdated: string | null; // Add last updated time
  loading?: boolean;
}

// Cache for GitHub API responses to avoid repeated requests
const githubStatsCache: Record<string, GitHubRepoStats> = {};

/**
 * Extract owner and repo from a GitHub URL
 */
export function extractGitHubInfo(url: string): { owner: string; repo: string } | null {
  if (!url.includes('github.com')) return null;
  
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname !== 'github.com') return null;
    
    const path = urlObj.pathname.replace(/^\/|\/$/g, '');
    const [owner, repo] = path.split('/');
    
    if (!owner || !repo) return null;
    
    return { owner, repo };
  } catch (e) {
    return null;
  }
}

/**
 * Fetch GitHub repository stats (stars and forks)
 */
export async function fetchGitHubRepoStats(url: string): Promise<GitHubRepoStats | null> {
  // Return cached result if available
  if (githubStatsCache[url]) {
    return githubStatsCache[url];
  }
  
  // Mark as loading in cache
  githubStatsCache[url] = { stars: 0, forks: 0, lastUpdated: null, loading: true };
  
  try {
    const repoInfo = extractGitHubInfo(url);
    if (!repoInfo) return null;
    
    const { owner, repo } = repoInfo;
    
    // Add a small random delay to avoid hitting rate limits
    await new Promise(resolve => setTimeout(resolve, Math.random() * 300));
    
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    
    if (!response.ok) {
      if (response.status === 403) {
        console.warn('GitHub API rate limit exceeded');
      }
      delete githubStatsCache[url];
      return null;
    }
    
    const data = await response.json();
    
    const result = {
      stars: data.stargazers_count || 0,
      forks: data.forks_count || 0,
      lastUpdated: data.pushed_at || null
    };
    
    // Cache the result
    githubStatsCache[url] = result;
    
    return result;
  } catch (error) {
    console.error('Error fetching GitHub repo stats:', error);
    delete githubStatsCache[url];
    return null;
  }
}

/**
 * Format numbers to K, M format for better UI display
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Format a date string to a relative time format (e.g. "2 months ago")
 */
export function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return 'Unknown';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  // Less than a minute
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  // Less than an hour
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  // Less than a day
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  // Less than a month
  if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
  
  // Less than a year
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }
  
  // More than a year
  const years = Math.floor(diffInSeconds / 31536000);
  return `${years} ${years === 1 ? 'year' : 'years'} ago`;
}

// Merges and formats the class names
export function cn(...inputs: ClassNameValue[]) {
  return twMerge(inputs)
}
