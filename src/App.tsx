import { useState, useEffect, useRef } from 'react'
import './App.css'
import { SearchBar } from './components/ui/search-bar'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card'
import { Footer } from './components/ui/footer'
import { Pagination } from './components/ui/pagination'
import { MasonryGrid } from './components/ui/masonry-grid'
import { Header } from './components/ui/header'

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

// Array of pastel background colors for cards
const pastelColors = [
  'bg-card-pastel-green',
  'bg-card-pastel-blue',
  'bg-card-pastel-yellow',
  'bg-card-pastel-purple',
  'bg-card-pastel-red',
  'bg-card-pastel-indigo',
  'bg-card-pastel-cyan',
  'bg-card-pastel-teal',
  'bg-card-pastel-lime',
  'bg-card-pastel-orange',
];

// Function to get a random pastel color
const getRandomPastelColor = () => {
  const randomIndex = Math.floor(Math.random() * pastelColors.length);
  return pastelColors[randomIndex];
};

function App() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(9); // Show 9 tools per page (3x3 grid)
  const [heroVisible, setHeroVisible] = useState<boolean>(true);
  const heroRef = useRef<HTMLElement>(null);

  // Store random colors for each tool to ensure consistent colors between renders
  const [cardColors, setCardColors] = useState<{[key: string]: string}>({});

  // Load data from data.json
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Import the data directly using Vite's JSON import
        const data = (await import('./data.json')).default as ToolsData;
        setTools(data.tools);

        // Extract unique tags for filtering
        const tags = new Set<string>();
        const tagCount: {[key: string]: number} = {};
        
        data.tools.forEach(tool => {
          tool.tags.forEach(tag => {
            tags.add(tag);
            tagCount[tag] = (tagCount[tag] || 0) + 1;
          });
        });
        
        // Sort all tags alphabetically
        setAllTags(Array.from(tags).sort());
        
        // Determine popular tags (top 6 most used)
        const popular = Object.entries(tagCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(entry => entry[0]);
          
        setPopularTags(popular);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    fetchData();
  }, []);

  // Generate random colors for each tool once when tools are loaded
  useEffect(() => {
    if (tools.length > 0 && Object.keys(cardColors).length === 0) {
      const colors: {[key: string]: string} = {};
      tools.forEach(tool => {
        colors[tool.name] = getRandomPastelColor();
      });
      setCardColors(colors);
    }
  }, [tools, cardColors]);

  // Handle scroll effects for navbar, hero visibility and dark mode preference
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
      
      // Check if hero section is still visible
      if (heroRef.current) {
        const heroRect = heroRef.current.getBoundingClientRect();
        // Hero is considered not visible when it's top edge is above the viewport
        // Add some threshold for a smoother transition
        setHeroVisible(heroRect.bottom > 100);
      }
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
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle tag selection
  const handleTagSelect = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
    setCurrentPage(1); // Reset to first page on tag change
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedTag(null);
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredTools.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTools = filteredTools.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of tools section
    window.scrollTo({
      top: document.querySelector('.tools-section')?.getBoundingClientRect().top! + window.scrollY - 100,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
      {/* Use the new Header component with heroVisible prop */}
      <Header 
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        scrolled={scrolled}
        heroVisible={heroVisible}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 flex-grow">
        <header className="text-center mb-12 pb-6 border-b" id="about">
          <h1 className="text-4xl font-bold text-primary mb-3">Awesome Android Tooling</h1>
          <p ref={heroRef} className="text-muted-foreground max-w-3xl mx-auto">
            A curated list of tools that can be helpful building, testing, and optimizing your Android apps.
          </p>
        </header>

        <div className="mb-8">
          {/* Enhanced SearchBar with integrated filters */}
          <SearchBar 
            value={searchTerm}
            onChange={handleSearchChange}
            onTagSelect={handleTagSelect}
            selectedTag={selectedTag}
            allTags={allTags}
            popularTags={popularTags}
          />
          
          {/* Selected and popular tags display below search bar */}
          <div className="mt-3 flex flex-wrap gap-2">
            {/* Selected tag */}
            {selectedTag && (
              <div className="flex items-center space-x-2 mr-2">
                <span className="text-sm text-muted-foreground">Selected:</span>
                <button
                  onClick={() => handleTagSelect(selectedTag)}
                  className="px-3 py-1 rounded-full text-xs bg-primary text-primary-foreground flex items-center gap-1"
                >
                  {selectedTag}
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            )}
            
            {/* Popular tags - only show when no tag is selected */}
            {!selectedTag && (
              <>
                <span className="text-sm text-muted-foreground mr-1 self-center">Popular:</span>
                {popularTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagSelect(tag)}
                    className="px-3 py-1 rounded-full text-xs bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </>
            )}
          </div>
          
          {/* Clear filters button - only visible when filters are active */}
          {(selectedTag || searchTerm) && (
            <div className="flex justify-end mt-2">
              <button 
                onClick={clearFilters}
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                Clear all filters
              </button>
            </div>
          )}
        </div>

        <div className="pt-4 tools-section">
          {filteredTools.length > 0 ? (
            <>
              <MasonryGrid>
                {currentTools.map((tool) => (
                  <Card 
                    key={tool.name} 
                    className={cardColors[tool.name] || ''}
                  >
                    <CardHeader>
                      <CardTitle>{tool.name}</CardTitle>
                      <CardDescription>{tool.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {tool.tags.map(tag => (
                          <span 
                            key={tag} 
                            className={`px-2 py-1 rounded text-xs cursor-pointer ${
                              selectedTag === tag 
                                ? 'bg-primary/20 text-primary font-medium' 
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }`}
                            onClick={() => handleTagSelect(tag)}
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
              </MasonryGrid>
              
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
              
              <div className="text-center mt-4 text-sm text-muted-foreground">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredTools.length)} of {filteredTools.length} tools
              </div>
            </>
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
