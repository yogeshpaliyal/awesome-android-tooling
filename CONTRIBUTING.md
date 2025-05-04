# How to Add a New Tool

This guide explains how to add a new Android tool to the Awesome Android Tooling collection.

## Prerequisites

Before you begin, make sure you have:

- Git installed on your machine
- A GitHub account
- Basic knowledge of JSON format
- Forked the repository and cloned it locally

## Adding a New Tool

You can add a new tool to the collection by following these steps:

### Option 1: Direct Pull Request (Simple Method)

1. **Fork the repository** if you haven't already
2. **Create a new branch** for your addition
   ```bash
   git checkout -b add-your-tool-name
   ```
3. **Use the "Submit Tool" button** on the website or submit a GitHub issue with the tool information
4. Alternatively, you can **directly edit** the data file

### Option 2: Adding to Individual JSON Files (Recommended)

1. **Create a new JSON file** in the `data` directory with a filename based on your tool name:
   ```bash
   cd data
   touch your-tool-name.json
   ```

2. **Add the tool information** using the following format:
   ```json
   {
     "name": "Your Tool Name",
     "description": "A detailed description of your tool explaining what it does and why it's useful for Android development. Aim for 1-3 sentences that clearly explain the purpose and value.",
     "link": "https://link-to-official-documentation-or-github-repo",
     "tags": [
       "relevant-tag-1",
       "relevant-tag-2",
       "relevant-tag-3",
       "relevant-tag-4"
     ]
   }
   ```

3. **Validate your JSON file** to ensure it's correctly formatted:
   ```bash
   npm run validate
   # or
   bun run validate
   ```

4. **Generate the combined data file** by running:
   ```bash
   npm run merge
   # or
   bun run merge
   ```

## Guidelines for Tool Submissions

### Required Fields

Each tool entry must include:

- **name**: The official name of the tool
- **description**: A clear, concise description (10-300 characters)
- **link**: URL to the official documentation or repository
- **tags**: At least one descriptive tag (see existing tags below)

### Common Tags

Choose from these existing tags or add new ones when appropriate:

- **Tool Types**: `command-line`, `android-studio`, `jetpack-compose`
- **Functionality**: `debugging`, `testing`, `profiling`, `analysis`
- **Focus Areas**: `ui`, `performance`, `optimization`, `development`

### Best Practices

- Use clear, descriptive names that match the tool's official name
- Provide concise but informative descriptions
- Include a direct link to the official documentation whenever possible
- Select relevant tags that accurately categorize the tool
- Check that your tool isn't already in the collection

## Submitting Your Addition

1. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Add [Your Tool Name]"
   ```

2. **Push to your fork**:
   ```bash
   git push origin add-your-tool-name
   ```

3. **Create a pull request** to the main repository

4. **Wait for review** - maintainers will review your submission and may request changes

## Example Submission

Here's an example of a well-formatted tool submission:

```json
{
  "name": "App Inspector",
  "description": "App Inspector allows you to examine the component hierarchy and properties of your Android app at runtime, helping you debug layout issues and understand how your UI components interact.",
  "link": "https://developer.android.com/example-tool",
  "tags": [
    "android-studio",
    "debugging",
    "ui",
    "inspection"
  ]
}
```

---

Thank you for contributing to Awesome Android Tooling! Your submissions help make this resource more valuable for the entire Android development community.