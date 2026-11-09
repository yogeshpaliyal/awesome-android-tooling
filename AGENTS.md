# AGENTS.md

Instructions for AI coding agents working in this repository. Humans should read [CONTRIBUTING.md](CONTRIBUTING.md), which has the same rules in more detail.

## What this repository is

A curated list of tools for Android developers, published as a website at https://yogeshpaliyal.github.io/awesome-android-tooling/. Each tool is one JSON file in `data/`. The site is a Vite + React app in `src/`, and `scripts/merge.js` combines `data/*.json` into `src/data.json` (and the files for AI readers, see below) at build time.

## Adding a tool

1. Check the tool is not already listed: search `data/` for its name and its link.
2. Check it belongs in the list (see "What is accepted" below). If it does not, say so instead of adding it.
3. Create `data/<tool-name>.json`. The file name is lowercase kebab-case and becomes the tool's stable `id`, so do not rename existing files.
4. Use this shape. `name`, `description`, `link` and `tags` are required; no other fields are allowed.

   ```json
   {
     "name": "chucker",
     "description": "An HTTP inspector for Android and OkHttp that shows requests on the device.",
     "link": "https://github.com/ChuckerTeam/chucker",
     "authorName": "ChuckerTeam",
     "authorLink": "https://github.com/ChuckerTeam",
     "tags": ["http-requests", "okhttp", "library"]
   }
   ```

5. Run `bun run validate` (or `npm run validate`) and fix every error before committing.
6. Commit only the new data file, with a message like `Add <Tool Name>`. Do not commit `src/data.json` or the generated files in `public/`.

## Rules that validation enforces

- `description` is 10 to 300 characters.
- `link` and `authorLink` start with `http://` or `https://`.
- `tags` has at least one tag, every tag is lowercase kebab-case (`command-line`, not `CLI`), and no tag repeats.
- Some variants of existing tags are rejected, for example `cli` (use `command-line`), `compose` (use `jetpack-compose`) and `screenshots` (use `screenshot`). The full list is `TAG_ALIASES` in `scripts/validate.js`.

## Writing a good entry

- Use the tool's official name.
- Describe what the tool does for an Android developer in one or two plain sentences. Leave out marketing claims, pricing and calls to action. If a paid account is required, say so.
- Reuse existing tags. To see them, run `bun run dev` once and read `public/tools.json`, or grep the `tags` arrays in `data/`. Common ones: `command-line`, `android-studio`, `jetpack-compose`, `web`, `library`, `debugging`, `testing`, `profiling`, `analysis`, `ui`, `performance`.
- Leave out `authorName` and `authorLink` for GitHub links if you are unsure; the build fills them in from the GitHub API.

## What is accepted

A tool is accepted only if all of these are true:

- It helps build, test, debug, profile, analyze, ship or maintain Android apps. Tools for end users (app stores, mod sites, APK download sites) are not accepted.
- It is usable today: the link leads to the tool or its documentation, not a waitlist.
- It is not already listed.

Open-source and free tools are preferred. Commercial tools are fine when they meet the points above.

## Files for AI readers

`scripts/generate-ai-files.js` (called from `scripts/merge.js`) writes these to `public/`, and the site serves them at its root:

- `llms.txt`: a short index in the [llms.txt](https://llmstxt.org) format
- `llms-full.txt`: every tool with author and tags, as Markdown
- `tools.json`: every tool as JSON, `schemaVersion: 1`

They are build output and are ignored by git. If you change the fields of `tools.json` in a way that breaks existing readers, increase `schemaVersion`.

## Commands

- `bun install`: install dependencies
- `bun run validate`: validate every file in `data/`
- `bun run dev`: build the data files and start the site locally
- `bun run build`: production build into `dist/`
- `bun run lint`: lint the site code
