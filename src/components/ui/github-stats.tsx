import { useState, useEffect } from 'react';
import { fetchGitHubRepoStats, extractGitHubInfo, formatNumber, formatRelativeTime, type GitHubRepoStats } from '@/lib/utils';

interface GitHubStatsProps {
  url: string;
  authorName?: string;
  authorLink?: string;
}

export function GitHubStats({ url, authorName, authorLink }: GitHubStatsProps) {
  const [stats, setStats] = useState<GitHubRepoStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [extractedAuthor, setExtractedAuthor] = useState<string | null>(null);
  const [fetchFailed, setFetchFailed] = useState(false);

  useEffect(() => {
    // Only fetch stats for GitHub links
    if (!url) return;
    
    // Extract author from GitHub URL if authorName is not provided
    if (!authorName) {
      const repoInfo = extractGitHubInfo(url);
      if (repoInfo) {
        setExtractedAuthor(repoInfo.owner);
      } else {
        setExtractedAuthor(null);
        return; // Not a GitHub URL
      }
    }

    // Mark as loading and fetch stats
    setFetchFailed(false);
    
    const fetchStats = async () => {
      try {
        const repoStats = await fetchGitHubRepoStats(url);
        if (repoStats) {
          setStats(repoStats);
          setFetchFailed(false);
        } else {
          setFetchFailed(true);
        }
      } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        setFetchFailed(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [url, authorName]);

  // If not a GitHub URL and no explicit author is provided, don't render anything
  if (!extractGitHubInfo(url) && !authorName) {
    return null;
  }

  // Determine which author to display
  const displayAuthor = authorName || extractedAuthor;
  
  return (
    <div className="flex flex-col items-end space-y-1">
      {/* Author name */}
      {displayAuthor && (
        <div className="text-sm font-medium" title={`Author: ${displayAuthor}`}>
          by{" "}
          {authorLink ? (
            <a 
              href={authorLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:underline"
              onClick={(e) => e.stopPropagation()} // Prevent card click
            >
              {displayAuthor}
            </a>
          ) : (
            <span className="text-primary">{displayAuthor}</span>
          )}
        </div>
      )}
      
      {/* Stats (stars/forks/last updated) - only show if not fetch failed */}
      {!fetchFailed && (
        <div className="flex flex-col items-end space-y-1">
          <div className="flex items-center space-x-3 text-sm text-muted-foreground animate-fade-in" onClick={e => e.stopPropagation()}>
            {loading ? (
              <div className="flex items-center space-x-3">
                <div className="w-16 h-5 bg-muted animate-pulse rounded"></div>
                <div className="w-16 h-5 bg-muted animate-pulse rounded"></div>
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-1" title={`${stats?.stars} stars`}>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="h-4 w-4"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span>{formatNumber(stats?.stars || 0)}</span>
                </div>
                <div className="flex items-center space-x-1" title={`${stats?.forks} forks`}>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="h-4 w-4"
                  >
                    <path d="M9 21v-6"></path>
                    <path d="M15 15v6"></path>
                    <circle cx="9" cy="6" r="3"></circle>
                    <circle cx="15" cy="18" r="3"></circle>
                    <path d="M12 9A6 6 0 0 0 6 15h6a6 6 0 0 0 6-6"></path>
                  </svg>
                  <span>{formatNumber(stats?.forks || 0)}</span>
                </div>
              </>
            )}
          </div>
          
          {/* Last updated time */}
          {!loading && stats?.lastUpdated && (
            <div className="text-xs text-muted-foreground animate-fade-in" title={`Last updated: ${new Date(stats.lastUpdated).toLocaleString()}`}>
              <div className="flex items-center space-x-1">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-3.5 w-3.5"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>Updated {formatRelativeTime(stats.lastUpdated)}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}