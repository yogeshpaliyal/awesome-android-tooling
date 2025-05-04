import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const rootDir = path.resolve(__dirname, '..');
const dataDir = path.join(rootDir, 'data');
const outputFile = path.join(rootDir, 'src', 'data.json');

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
    .filter(file => file.endsWith('.json') && file !== 'index.json');
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

// Sort tools alphabetically by name
tools.sort((a, b) => a.name.localeCompare(b.name));

// Create the final data structure
const finalData = {
  tools: tools
};

// Write the combined data to src/data.json
fs.writeFileSync(outputFile, JSON.stringify(finalData, null, 2));
console.log(`\nCreated combined file: ${outputFile}`);
console.log(`Total tools merged: ${tools.length}`);