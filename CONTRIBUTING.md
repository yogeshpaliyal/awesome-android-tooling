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
     "authorName": "Name of tool author or organization (optional)",
     "authorLink": "https://link-to-author-website-or-profile (optional)",
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

4. **Preview the site locally** (optional). `bun run dev` combines the files in `data/` and starts the site:
   ```bash
   bun run dev
   ```

## Adding an AI Agent Skill

The collection also lists AI agent skills for Android development: packaged instructions such as a `SKILL.md` folder that an AI coding agent (Claude Code, Gemini CLI, Codex and similar) loads to do an Android task better. Add one the same way as a tool, with two differences:

- Set `"type": "skill"`. Tools leave `type` out, or set it to `"tool"`.
- Include the `agent-skill` tag. Validation fails if a skill is missing it, or if a tool uses it.

```json
{
  "name": "Your Skill Name",
  "type": "skill",
  "description": "What the skill teaches an agent to do in an Android project, and which agents can load it.",
  "link": "https://github.com/owner/repo/tree/main/skills/your-skill",
  "tags": [
    "agent-skill",
    "jetpack-compose"
  ]
}
```

Link to the skill itself (its folder or `SKILL.md`), not to a general prompt collection. The inclusion rules below apply to skills too.

## What Belongs in the Collection

A tool is a good fit when all of these are true:

- **It is for Android developers.** It helps build, test, debug, profile, analyze, ship or maintain Android apps. Tools for end users (app stores, mod sites, APK download sites) are not accepted.
- **It is usable today.** The link works and leads to the tool itself or its documentation, not to a waitlist or a landing page with no product.
- **The entry describes the tool, not the business.** Describe what it does for a developer. Leave out marketing claims, pricing and calls to action.
- **It is not already listed.** Search the `data/` directory first.

Open-source and free tools are preferred. Commercial tools are welcome when they meet the points above and the description says if a paid account is required.

## Guidelines for Tool Submissions

### Required Fields

Each tool entry must include:

- **name**: The official name of the tool
- **description**: A clear, concise description of 10 to 300 characters. `bun run validate` fails if it is longer
- **link**: URL to the official documentation or repository
- **tags**: At least one descriptive tag (see existing tags below)

### Optional Fields

You can also include these optional fields:

- **authorName**: Name of the tool's author or maintaining organization
- **authorLink**: URL to the author's website, GitHub profile, or other relevant link
- **type**: `"skill"` for an AI agent skill (see above). Leave it out for tools

### Common Tags

Reuse existing tags whenever one fits, and add a new tag only when none does:

- **Tool Types**: `command-line`, `android-studio`, `jetpack-compose`, `web`
- **Functionality**: `debugging`, `testing`, `profiling`, `analysis`
- **Focus Areas**: `ui`, `performance`, `optimization`, `development`

Tags must be lowercase kebab-case (`command-line`, not `CLI` or `Command Line`), and each tag may appear only once per tool. Validation also rejects common variants of existing tags, such as `cli` (use `command-line`) or `screenshots` (use `screenshot`).

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
  "authorName": "Android Team",
  "authorLink": "https://developer.android.com",
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