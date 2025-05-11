import { useState, useEffect, useRef } from 'react'
import './App.css'
import { SearchBar } from './components/ui/search-bar'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card'
import { Footer } from './components/ui/footer'
import { Pagination } from './components/ui/pagination'
import { MasonryGrid } from './components/ui/masonry-grid'
import { Header } from './components/ui/header'
import { GitHubStats } from './components/ui/github-stats'
import { FloatingActionButton } from './components/ui/floating-action-button'
import { ToolOfTheDay } from './components/ui/tool-of-the-day'
import { SubmitToolDialog } from './components/ui/submit-tool-dialog'
import { getToolOfTheDay } from './lib/utils'

// Define type for the tools
interface Tool {
  name: string;
  description: string;
  link: string;
  tags: string[];
  author?: string; // Optional author field
  authorName?: string; // GitHub author name
  authorLink?: string; // GitHub author profile link
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

// Function to update URL query parameters
const updateUrlWithTag = (tag: string | null) => {
  const url = new URL(window.location.href);
  
  if (tag) {
    url.searchParams.set('tag', tag);
  } else {
    url.searchParams.delete('tag');
  }
  
  window.history.pushState({}, '', url);
};

// Function to get tag from URL query parameters
const getTagFromUrl = (): string | null => {
  const params = new URLSearchParams(window.location.search);
  return params.get('tag');
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
  const [itemsPerPage] = useState<number>(15); // Show 9 tools per page (3x3 grid)
  const [heroVisible, setHeroVisible] = useState<boolean>(true);
  const [toolOfTheDayOpen, setToolOfTheDayOpen] = useState<boolean>(false);
  const [toolOfTheDay, setToolOfTheDay] = useState<Tool | null>(null);
  const [submitToolDialogOpen, setSubmitToolDialogOpen] = useState<boolean>(false);
  const heroRef = useRef<HTMLElement>(null);

  // Store random colors for each tool to ensure consistent colors between renders
  const [cardColors, setCardColors] = useState<{[key: string]: string}>({});
  
  // Function to select the Tool of the Day using the date-based algorithm
  const selectToolOfTheDay = () => {
    const todaysTool = getToolOfTheDay(tools);
    if (todaysTool) {
      setToolOfTheDay(todaysTool);
      setToolOfTheDayOpen(true);
    }
  };

  // Function to open submit tool dialog
  const openSubmitToolDialog = () => {
    setSubmitToolDialogOpen(true);
  };

  // Function to close submit tool dialog
  const closeSubmitToolDialog = () => {
    setSubmitToolDialogOpen(false);
  };

  // Use useEffect to initialize the Tool of the Day when the app loads
  useEffect(() => {
    if (tools.length > 0) {
      const todaysTool = getToolOfTheDay(tools);
      if (todaysTool) {
        setToolOfTheDay(todaysTool);
        // Don't automatically open the modal, just set the tool
      }
    }
  }, [tools]);

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
        
        // Check for tag in URL
        const urlTag = getTagFromUrl();
        if (urlTag && Array.from(tags).includes(urlTag)) {
          setSelectedTag(urlTag);
        }
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

  // Handle tag selection with URL update
  const handleTagSelect = (tag: string) => {
    const newTag = selectedTag === tag ? null : tag;
    setSelectedTag(newTag);
    updateUrlWithTag(newTag);
    setCurrentPage(1); // Reset to first page on tag change
  };

  // Clear all filters with URL update
  const clearFilters = () => {
    setSelectedTag(null);
    updateUrlWithTag(null);
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredTools.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTools = filteredTools.slice(indexOfFirstItem, indexOfLastItem);

  // Handle URL changes from browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const urlTag = getTagFromUrl();
      setSelectedTag(urlTag);
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

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

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 flex-grow">
        <header className="text-center mb-12 pb-6 border-b" id="about">
          {/**@ts-ignore */}
          <h1 ref={heroRef} className="text-4xl font-bold text-primary mb-3">Awesome Android Tooling</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            A curated list of tools that can be helpful building, testing, and optimizing your Android apps.
          </p>
        </header>

        {/* Container with fixed width to prevent layout shifts */}
        <div className="w-full mb-8">
          {/* Enhanced SearchBar with integrated filters */}
          <div className="w-full">
            <SearchBar 
              value={searchTerm}
              onChange={handleSearchChange}
              onTagSelect={handleTagSelect}
              selectedTag={selectedTag}
              allTags={allTags}
              popularTags={popularTags}
            />
          </div>
          
          {/* Selected and popular tags display below search bar */}
          <div className="mt-3 flex flex-wrap gap-2">
            {/* Selected tag */}
            {selectedTag && (
              <div className="flex items-center space-x-2 mr-2">
                <span className="text-sm text-muted-foreground">Selected:</span>
                <button
                  onClick={() => handleTagSelect(selectedTag)}
                  className="px-3 py-1 rounded-full text-xs border-2 border-primary text-primary flex items-center gap-1"
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

        <div className="pt-4 tools-section w-full">
          <div className="w-full grid grid-cols-1">
            {filteredTools.length > 0 ? (
              <div className="w-full">
                <MasonryGrid>
                  {currentTools.map((tool) => (
                    <Card 
                      key={tool.name} 
                      className={`${cardColors[tool.name] || ''} cursor-pointer transition-all hover:shadow-md`}
                      onClick={() => window.open(tool.link, '_blank', 'noopener,noreferrer')}
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
                                  ? 'border-2 border-primary text-primary font-medium' 
                                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent card click when tag is clicked
                                handleTagSelect(tag);
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-col space-y-2">
                        <div className="flex justify-between items-center w-full">
                          <a 
                            href={tool.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-primary hover:text-primary/90 hover:underline font-medium inline-flex items-center"
                            onClick={(e) => e.stopPropagation()} // Prevent double navigation
                          >
                            More Details →
                          </a>
                          
                          {/* Add GitHub Stats component for GitHub links */}
                          <GitHubStats 
                            url={tool.link} 
                            authorName={tool.authorName}
                            authorLink={tool.authorLink}
                          />
                        </div>
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
              </div>
            ) : (
              <div className="w-full min-h-[400px] flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8 border border-border rounded-lg bg-card shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-muted-foreground/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-medium mb-2">No results found</h3>
                  <p className="text-muted-foreground">No tools found matching your search criteria. Try adjusting your search or filters.</p>
                  {searchTerm || selectedTag ? (
                    <button 
                      onClick={clearFilters}
                      className="mt-4 px-4 py-2 rounded-md text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      Clear all filters
                    </button>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
      
      {/* Tool of the Day FloatingActionButton */}
      <FloatingActionButton onClick={selectToolOfTheDay} />
      
      {/* Tool of the Day Modal */}
      {toolOfTheDayOpen && toolOfTheDay && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card w-full max-w-md rounded-lg shadow-lg animate-in fade-in zoom-in-95">
            <div className="p-6">
              <div className="flex justify-end">
                <button 
                  onClick={() => setToolOfTheDayOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              <h2 className="text-2xl font-bold mb-4 text-center">Tool of the Day</h2>
              
              <ToolOfTheDay
                tool={toolOfTheDay}
                color={cardColors[toolOfTheDay.name] || getRandomPastelColor()}
              />
            </div>
          </div>
        </div>
      )}

      {/* Submit Tool Dialog */}
      <SubmitToolDialog
        isOpen={submitToolDialogOpen}
        onClose={closeSubmitToolDialog}
      />
      
      {/* Submit Tool Button */}
      <button
        onClick={openSubmitToolDialog}
        className="fixed bottom-24 right-6 bg-primary text-primary-foreground hover:bg-primary/90 w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-40"
        aria-label="Submit a new tool"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
    </div>
  );
}

export default App
