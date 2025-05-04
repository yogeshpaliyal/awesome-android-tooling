import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const rootDir = path.resolve(__dirname, '..');
const dataDir = path.join(rootDir, 'data');

// JSON Schema for tool validation
const toolSchema = {
  type: 'object',
  required: ['name', 'description', 'link', 'tags'],
  properties: {
    name: { type: 'string', minLength: 1 },
    description: { type: 'string', minLength: 10 },
    link: { 
      type: 'string', 
      // Use pattern instead of format for URL validation
      pattern: '^https?://[\\w.-]+(\\.[\\w.-]+)+([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?$'
    },
    tags: { 
      type: 'array', 
      minItems: 1,
      items: { type: 'string', minLength: 1 }
    }
  },
  additionalProperties: false
};

// Initialize Ajv
const ajv = new Ajv({ allErrors: true });
// Add format support (optional, since we're using pattern)
addFormats(ajv);
const validate = ajv.compile(toolSchema);

// Function to validate a JSON file
function validateJsonFile(filePath) {
  try {
    // Read and parse the file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    // Basic URL validation (as a fallback)
    if (!data.link.startsWith('http://') && !data.link.startsWith('https://')) {
      console.error(`\x1b[31m❌ Validation failed for ${path.basename(filePath)}:\x1b[0m`);
      console.error(`  - /link must start with http:// or https://`);
      return false;
    }
    
    // Validate against schema
    const valid = validate(data);
    
    if (!valid) {
      console.error(`\x1b[31m❌ Validation failed for ${path.basename(filePath)}:\x1b[0m`);
      validate.errors.forEach(error => {
        console.error(`  - ${error.instancePath} ${error.message}`);
      });
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`\x1b[31m❌ Error processing ${path.basename(filePath)}: ${error.message}\x1b[0m`);
    return false;
  }
}

// Main validation function
async function validateAllFiles() {
  // Check if data directory exists
  if (!fs.existsSync(dataDir)) {
    console.error('\x1b[31m❌ Data directory not found!\x1b[0m');
    process.exit(1);
  }
  
  // Get all JSON files except index.json
  const files = fs.readdirSync(dataDir)
    .filter(file => file.endsWith('.json') && file !== 'index.json')
    .map(file => path.join(dataDir, file));
  
  console.log(`\x1b[36mValidating ${files.length} JSON files in data directory...\x1b[0m\n`);
  
  // Validate each file
  let validCount = 0;
  let invalidCount = 0;
  
  for (const file of files) {
    const isValid = validateJsonFile(file);
    if (isValid) {
      validCount++;
      console.log(`\x1b[32m✅ ${path.basename(file)} is valid\x1b[0m`);
    } else {
      invalidCount++;
    }
  }
  
  // Special validation for index.json if it exists
  const indexPath = path.join(dataDir, 'index.json');
  if (fs.existsSync(indexPath)) {
    try {
      const indexContent = fs.readFileSync(indexPath, 'utf8');
      JSON.parse(indexContent); // Just check if it's valid JSON
      console.log('\x1b[32m✅ index.json is valid JSON\x1b[0m');
    } catch (error) {
      console.error(`\x1b[31m❌ Error with index.json: ${error.message}\x1b[0m`);
      invalidCount++;
    }
  }
  
  // Summary
  console.log('\n\x1b[36mValidation Summary:\x1b[0m');
  console.log(`\x1b[32m✅ Valid files: ${validCount}\x1b[0m`);
  if (invalidCount > 0) {
    console.log(`\x1b[31m❌ Invalid files: ${invalidCount}\x1b[0m`);
    process.exit(1); // Exit with error code
  } else {
    console.log('\x1b[32m✅ All JSON files are valid!\x1b[0m');
  }
}

// Run validation
validateAllFiles().catch(error => {
  console.error(error);
  process.exit(1);
});