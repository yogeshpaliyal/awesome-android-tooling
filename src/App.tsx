import { useState, useEffect } from 'react'
import './App.css'
import { SearchBar } from './components/ui/search-bar'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card'
import { Footer } from './components/ui/footer'

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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
      {/* Sticky Navbar */}
      <div className={`fixed top-0 left-0 right-0 bg-background/95 dark:bg-background/95 backdrop-blur-sm transition-shadow duration-300 z-50 ${
        scrolled ? 'shadow-md' : ''
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-primary">Android Tooling</h2>
          </div>
          <div className="flex items-center">
            <button 
              className="p-2 rounded-md hover:bg-muted transition-colors"
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 flex-grow">
        <header className="text-center mb-12 pb-6 border-b">
          <h1 className="text-4xl font-bold text-primary mb-3">Awesome Android Tooling</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            A curated list of tools that can be helpful building, testing, and optimizing your Android apps.
          </p>
        </header>

        <div className="mb-8">
          <SearchBar 
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b">
          {allTags.map(tag => (
            <button
              key={tag}
              className={`px-3 py-1.5 rounded-full text-sm ${
                selectedTag === tag
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
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
                <Card key={tool.name}>
                  <CardHeader>
                    <CardTitle>{tool.name}</CardTitle>
                    <CardDescription className="line-clamp-4">{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {tool.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="px-2 py-1 rounded text-xs bg-muted text-muted-foreground cursor-pointer hover:bg-muted/80"
                          onClick={() => handleTagClick(tag)}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <a 
                      href={tool.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary hover:text-primary/90 hover:underline font-medium inline-flex items-center"
                    >
                      More Details →
                    </a>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tools found matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default App
