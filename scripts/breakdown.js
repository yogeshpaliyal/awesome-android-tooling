import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const rootDir = path.resolve(__dirname, '..');
const dataJsonPath = path.join(rootDir, 'src', 'data.json');
const outputDir = path.join(rootDir, 'data');

// Create data directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`Created directory: ${outputDir}`);
}

// Read the data.json file
const rawData = fs.readFileSync(dataJsonPath, 'utf8');
// Remove comment line if present
const cleanData = rawData.replace(/^\s*\/\/.*$/m, '');
const dataJson = JSON.parse(cleanData);
const tools = dataJson.tools;

// Create a file for each tool
tools.forEach((tool, index) => {
  // Create a filename based on the tool name
  const fileName = tool.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphen
    .replace(/-+/g, '-')         // Replace multiple hyphens with a single one
    .replace(/^-|-$/g, '');      // Remove leading/trailing hyphens
  
  // Create the file path
  const filePath = path.join(outputDir, `${fileName}.json`);
  
  // Write the individual tool to a JSON file
  fs.writeFileSync(filePath, JSON.stringify(tool, null, 2));
  
  console.log(`Created: ${filePath}`);
});


console.log(`\nTotal files created: ${tools.length + 1}`);
