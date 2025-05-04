import { useState, useEffect } from 'react'
import './App.css'

// Define type for the tools
interface Tool {
  name: string;
  description: string;
  link: string;
  tags: string[];
}

interface ToolsData {
  tools: Tool[];
}

function App() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  // Load data from data.json
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Import the data directly using Vite's JSON import
        const data = (await import('./data.json')).default as ToolsData;
        setTools(data.tools);

        // Extract unique tags for filtering
        const tags = new Set<string>();
        data.tools.forEach(tool => {
          tool.tags.forEach(tag => tags.add(tag));
        });
        
        setAllTags(Array.from(tags).sort());
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    fetchData();
  }, []);

  // Handle scroll effects for navbar and dark mode preference
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Check user's preferred color scheme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
    
    // Apply dark mode class to html element (for Tailwind)
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newMode;
    });
  };

  // Filter tools based on search term and selected tag
  const filteredTools = tools.filter(tool => {
    const matchesSearch = 
      searchTerm === '' || 
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTag = selectedTag === null || tool.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle tag selection
  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      {/* Sticky Navbar */}
      <div className={`fixed top-0 left-0 right-0 bg-white dark:bg-slate-800 backdrop-blur-sm transition-shadow duration-300 z-50 ${
        scrolled ? 'shadow-md' : ''
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-android-green">Android Tooling</h2>
          </div>
          <div className="flex items-center">
            <button 
              className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              onClick={toggleDarkMode}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <span className="text-xl">☀️</span>
              ) : (
                <span className="text-xl">🌙</span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <header className="text-center mb-12 pb-6 border-b border-slate-200 dark:border-slate-700">
          <h1 className="text-4xl font-bold text-android-green mb-3">Awesome Android Tooling</h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            A curated list of tools that can be helpful building, testing, and optimizing your Android apps.
          </p>
        </header>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search tools..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-android-green focus:border-transparent transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
          {allTags.map(tag => (
            <button
              key={tag}
              className={`px-3 py-1.5 rounded-full text-sm ${
                selectedTag === tag
                  ? 'bg-android-green text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              } transition-colors`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="pt-4">
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTools.map((tool) => (
                <div 
                  key={tool.name} 
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg p-6 transition-all duration-200 flex flex-col h-full border border-slate-100 dark:border-slate-700"
                >
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">{tool.name}</h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-6 flex-grow line-clamp-4">{tool.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                    {tool.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600"
                        onClick={() => handleTagClick(tag)}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a 
                    href={tool.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-android-green hover:text-android-green-dark hover:underline font-medium inline-flex items-center"
                  >
                    More Details →
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400">No tools found matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App
