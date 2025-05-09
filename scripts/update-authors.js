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

// Get all JSON files in the data directory (excluding index.json and _template.json)
const jsonFiles = fs.readdirSync(dataDir)
  .filter(file => file.endsWith('.json') && file !== 'index.json' && file !== '_template.json');

console.log(`Found ${jsonFiles.length} JSON files in the data directory`);

// Function to update a single JSON file with author information
async function updateFileWithAuthorInfo(filePath) {
  try {
    // Read and parse the file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    const fileName = path.basename(filePath);
    
    // Skip if both authorName and authorLink are already provided
    if (data.authorName && data.authorLink) {
      console.log(`${data.name}: Author info already present (${data.authorName})`);
      return false; // No update needed
    }
    
    // Check if tool URL is from GitHub
    if (data.link && data.link.includes('github.com')) {
      console.log(`${data.name}: Fetching author data from GitHub...`);
      const gitHubData = await fetchGitHubRepoData(data.link);
      
      if (gitHubData) {
        // Add author information to the tool
        data.authorName = data.authorName || gitHubData.authorName;
        data.authorLink = data.authorLink || gitHubData.authorLink;
        
        // Write the updated data back to the file
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        
        console.log(`${data.name}: Updated with author info - ${data.authorName}`);
        return true; // Update successful
      } else {
        console.log(`${data.name}: Unable to fetch GitHub data`);
      }
    } else {
      console.log(`${data.name}: Not a GitHub URL, skipping`);
    }
    
    return false; // No update made
  } catch (error) {
    console.error(`Error updating file ${filePath}:`, error);
    return false;
  }
}

// Process all JSON files
async function updateAllFiles() {
  console.log('\nUpdating JSON files with missing author information...');
  
  let updatedCount = 0;
  let notUpdatedCount = 0;
  
  for (const file of jsonFiles) {
    const filePath = path.join(dataDir, file);
    const updated = await updateFileWithAuthorInfo(filePath);
    
    if (updated) {
      updatedCount++;
    } else {
      notUpdatedCount++;
    }
  }
  
  console.log('\nUpdate Summary:');
  console.log(`Files updated: ${updatedCount}`);
  console.log(`Files not needing updates: ${notUpdatedCount}`);
  console.log(`Total files processed: ${jsonFiles.length}`);
}

// Run the update function
updateAllFiles().catch(error => {
  console.error('Error during update process:', error);
  process.exit(1);
});