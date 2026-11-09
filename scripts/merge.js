import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import { writeAiFiles } from './generate-ai-files.js';
import { categoriesForTags } from './categories.js';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const rootDir = path.resolve(__dirname, '..');
const dataDir = path.join(rootDir, 'data');
const outputFile = path.join(rootDir, 'src', 'data.json');
const publicDir = path.join(rootDir, 'public');

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
export async function fetchGitHubRepoData(url) {
  try {
    const repoInfo = extractGitHubInfo(url);
    if (!repoInfo) return null;
    
    const { owner, repo } = repoInfo;
    
    // Anonymous calls are limited to 60 an hour, so the build uses GITHUB_TOKEN when it is set
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      // Spread anonymous calls out a little
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log(`Fetching GitHub data for ${owner}/${repo}...`);
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    
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
      forks: data.forks_count || 0,
      pushedAt: data.pushed_at || null
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
// Data file name (without .json) of each tool, used as its stable id in tools.json
const toolIds = new Map();
for (const file of toolFiles) {
  try {
    const filePath = path.join(dataDir, file);
    const fileData = fs.readFileSync(filePath, 'utf8');
    const toolData = JSON.parse(fileData);
    tools.push(toolData);
    toolIds.set(toolData, path.basename(file, '.json'));
    console.log(`Added: ${toolData.name}`);
  } catch (error) {
    console.error(`Error reading file ${file}:`, error.message);
  }
}

// Fetch author, stars and last push for tools hosted on GitHub, so visitors' browsers
// don't each call the GitHub API. If a call fails the tool is shown without stats.
async function enrichToolsWithGitHubData() {
  console.log('\nEnriching tools with GitHub data...');

  for (const tool of tools) {
    if (!extractGitHubInfo(tool.link)) {
      continue;
    }

    const gitHubData = await fetchGitHubRepoData(tool.link);
    if (!gitHubData) {
      console.log(`${tool.name}: Unable to fetch GitHub data`);
      continue;
    }

    tool.authorName = tool.authorName || gitHubData.authorName;
    tool.authorLink = tool.authorLink || gitHubData.authorLink;
    tool.stars = gitHubData.stars;
    tool.pushedAt = gitHubData.pushedAt;
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
      // Site-only fields: categories from scripts/categories.js, and stars and pushedAt from GitHub
      tools: tools.map(tool => ({ ...tool, categories: categoriesForTags(tool.tags) }))
    };

    // Write the combined data to src/data.json
    fs.writeFileSync(outputFile, JSON.stringify(finalData, null, 2));
    console.log(`\nCreated combined file: ${outputFile}`);
    console.log(`Total tools merged: ${tools.length}`);

    // Machine-readable copies for LLMs and AI agents (llms.txt, llms-full.txt, tools.json)
    writeAiFiles(tools.map(tool => ({ id: toolIds.get(tool), ...tool })), publicDir);
  } catch (error) {
    console.error('Error during GitHub data enrichment:', error);
  }
})();