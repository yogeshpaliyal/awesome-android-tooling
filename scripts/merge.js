import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const rootDir = path.resolve(__dirname, '..');
const dataDir = path.join(rootDir, 'data');
const outputFile = path.join(rootDir, 'src', 'data.json');

// Helper function to extract GitHub info from URL
function extractGitHubInfo(url) {
  if (!url || !url.includes('github.com')) return null;
  
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

// Function to fetch GitHub repository data
async function fetchGitHubRepoData(url) {
  try {
    const repoInfo = extractGitHubInfo(url);
    if (!repoInfo) return null;
    
    const { owner, repo } = repoInfo;
    
    // Add a small random delay to avoid hitting rate limits
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
    
    console.log(`Fetching GitHub data for ${owner}/${repo}...`);
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    
    if (!response.ok) {
      if (response.status === 403) {
        console.warn('GitHub API rate limit exceeded');
      }
      console.error(`Error fetching data for ${owner}/${repo}: HTTP ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    return {
      authorName: data.owner?.login || owner,
      authorLink: data.owner?.html_url || `https://github.com/${owner}`,
      stars: data.stargazers_count || 0,
      forks: data.forks_count || 0
    };
  } catch (error) {
    console.error('Error fetching GitHub repo data:', error);
    return null;
  }
}

// Read the index.json file to get all tool files
console.log('Reading index.json...');
const indexPath = path.join(dataDir, 'index.json');
const indexExists = fs.existsSync(indexPath);

let toolFiles = [];

if (indexExists) {
  // Use index.json as a guide if it exists
  const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  toolFiles = indexData.tools.map(tool => tool.file);
  console.log(`Found ${toolFiles.length} tools in index.json`);
} else {
  // Otherwise read all .json files in the directory (except index.json)
  console.log('Index file not found, reading all JSON files in the directory...');
  toolFiles = fs.readdirSync(dataDir)
    .filter(file => file.endsWith('.json') && file !== 'index.json' && file !== '_template.json');
  console.log(`Found ${toolFiles.length} JSON files in directory`);
}

// Read each tool file and combine them
const tools = [];
for (const file of toolFiles) {
  try {
    const filePath = path.join(dataDir, file);
    const fileData = fs.readFileSync(filePath, 'utf8');
    const toolData = JSON.parse(fileData);
    tools.push(toolData);
    console.log(`Added: ${toolData.name}`);
  } catch (error) {
    console.error(`Error reading file ${file}:`, error.message);
  }
}

// Fetch GitHub data for tools that don't have author information
async function enrichToolsWithGitHubData() {
  console.log('\nEnriching tools with GitHub data...');
  
  for (let i = 0; i < tools.length; i++) {
    const tool = tools[i];
    
    // Skip if both authorName and authorLink are already provided
    if (tool.authorName && tool.authorLink) {
      console.log(`${tool.name}: Author info already present (${tool.authorName})`);
      continue;
    }
    
    // Check if tool URL is from GitHub
    if (tool.link && tool.link.includes('github.com')) {
      console.log(`${tool.name}: Fetching author data from GitHub...`);
      const gitHubData = await fetchGitHubRepoData(tool.link);
      
      if (gitHubData) {
        // Add author information to the tool
        tool.authorName = tool.authorName || gitHubData.authorName;
        tool.authorLink = tool.authorLink || gitHubData.authorLink;
        console.log(`${tool.name}: Added author info - ${tool.authorName}`);
      } else {
        console.log(`${tool.name}: Unable to fetch GitHub data`);
      }
    } else {
      console.log(`${tool.name}: Not a GitHub URL, skipping`);
    }
  }
}

// Sort tools alphabetically by name
tools.sort((a, b) => a.name.localeCompare(b.name));

// Run async function to fetch GitHub data and then save combined data
(async function() {
  try {
    await enrichToolsWithGitHubData();
    
    // Create the final data structure
    const finalData = {
      tools: tools
    };

    // Write the combined data to src/data.json
    fs.writeFileSync(outputFile, JSON.stringify(finalData, null, 2));
    console.log(`\nCreated combined file: ${outputFile}`);
    console.log(`Total tools merged: ${tools.length}`);
  } catch (error) {
    console.error('Error during GitHub data enrichment:', error);
  }
})();