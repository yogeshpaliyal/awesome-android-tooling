import { useState, useEffect } from 'react';

interface GitHubAuthProps {
  onAuthStateChange: (isAuthenticated: boolean, userData?: GitHubUser) => void;
}

export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
}

export function GitHubAuth({ onAuthStateChange }: GitHubAuthProps) {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already authenticated on component mount
  useEffect(() => {
    const token = localStorage.getItem('github_token');
    if (token) {
      fetchUserData(token);
    }
  }, []);

  // Fetch user data using the GitHub API
  const fetchUserData = async (token: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `token ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const userData: GitHubUser = await response.json();
      setUser(userData);
      localStorage.setItem('github_token', token);
      onAuthStateChange(true, userData);
    } catch (err) {
      setError('Authentication failed');
      localStorage.removeItem('github_token');
      onAuthStateChange(false);
    } finally {
      setLoading(false);
    }
  };

  // Start the GitHub OAuth flow
  const handleLogin = () => {
    // GitHub OAuth app credentials (client ID)
    // NOTE: In a production app, you'd want to use environment variables for this
    const clientId = 'Ov23li7dyC6S9jkdB4sq';
    const redirectUri = window.location.origin + window.location.pathname;
    const scope = 'public_repo'; // Permission to create public repos and PRs
    
    // Redirect to GitHub OAuth login
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  };

  // Logout user
  const handleLogout = () => {
    localStorage.removeItem('github_token');
    setUser(null);
    onAuthStateChange(false);
  };

  // Parse the code from URL when user is redirected back from GitHub
  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    
    if (code) {
      // Remove the code from the URL to prevent exposing it
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // In a real app, you would exchange this code for a token using your backend
      // For this example, we'll simulate it
      // NOTE: In production, NEVER handle OAuth codes in the frontend
      // You should exchange the code for a token on your backend server
      
      // This is just a placeholder for demonstration
      exchangeCodeForToken(code);
    }
  }, []);

  // Exchange code for token (in a real app, this would be done on the backend)
  const exchangeCodeForToken = async (code: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // NOTE: This is a simulated exchange. In a real app, you would call your backend
      // endpoint which would exchange the code for a token securely.
      // GitHub doesn't allow this exchange directly from the browser due to CORS and security.
      
      // Simulated successful authentication for the example
      // In a real implementation, you would:
      // 1. Send the code to your backend
      // 2. Backend exchanges code for token with GitHub
      // 3. Backend returns token to frontend
      
      // For this example, we'll just simulate a successful auth
      // with a fake token after a short delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const fakeToken = 'simulated_github_token_' + Math.random().toString(36).substring(2);
      
      // In a real app, this would be the real user data from GitHub
      const simulatedUser: GitHubUser = {
        login: 'github_user',
        name: 'GitHub User',
        avatar_url: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'
      };
      
      setUser(simulatedUser);
      localStorage.setItem('github_token', fakeToken);
      onAuthStateChange(true, simulatedUser);
    } catch (err) {
      setError('Failed to exchange code for token');
      onAuthStateChange(false);
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <img 
          src={user.avatar_url} 
          alt={`${user.name}'s avatar`} 
          className="w-8 h-8 rounded-full"
        />
        <div className="text-sm">
          <div className="font-medium">{user.name}</div>
          <div className="text-xs text-gray-500">@{user.login}</div>
        </div>
        <button 
          onClick={handleLogout}
          className="ml-2 px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-md"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleLogin}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-md"
      >
        {loading ? (
          <span className="animate-spin">⟳</span>
        ) : (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        )}
        Sign in with GitHub
      </button>
      {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
    </div>
  );
}