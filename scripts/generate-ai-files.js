import fs from 'fs';
import path from 'path';

// Generates machine-readable copies of the tool list for LLMs and AI agents:
//   public/llms.txt       - short index in the llms.txt format (https://llmstxt.org)
//   public/llms-full.txt  - every tool with its full details, as Markdown
//   public/tools.json     - stable JSON index of every tool (schemaVersion 1)
// Vite copies public/ into dist/, so these are served from the site root.
// The files are build output and are ignored by git.

export const SITE_URL = 'https://yogeshpaliyal.github.io/awesome-android-tooling/';
export const REPO_URL = 'https://github.com/yogeshpaliyal/awesome-android-tooling';

const TITLE = 'Awesome Android Tooling';
const SUMMARY =
  'A curated, community-maintained list of tools for Android developers: command-line tools, ' +
  'Android Studio plugins, Jetpack Compose tools, libraries and web tools for building, testing, ' +
  'debugging, profiling and shipping Android apps, plus AI agent skills for Android development.';

// Keep Markdown output on one line per field.
function oneLine(text) {
  return String(text ?? '').replace(/\s+/g, ' ').trim();
}

function sortedTagCounts(tools) {
  const counts = {};
  for (const tool of tools) {
    for (const tag of tool.tags) counts[tag] = (counts[tag] || 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

// tools: [{ id, ...toolData }] where id is the data file name without ".json"
export function buildAiFiles(tools) {
  const sorted = [...tools].sort((a, b) => a.name.localeCompare(b.name));
  const tagCounts = sortedTagCounts(sorted);

  const entries = sorted.map((tool) => ({
    id: tool.id,
    type: tool.type || 'tool',
    name: tool.name,
    description: oneLine(tool.description),
    link: tool.link,
    authorName: tool.authorName || null,
    authorLink: tool.authorLink || null,
    tags: tool.tags,
    source: `${REPO_URL}/blob/master/data/${tool.id}.json`,
  }));

  const toolEntries = entries.filter((t) => t.type === 'tool');
  const skillEntries = entries.filter((t) => t.type === 'skill');
  const countLine =
    `The list has ${toolEntries.length} tools and ${skillEntries.length} AI agent skills. ` +
    `Each entry is one JSON file in the \`data/\` directory of ${REPO_URL}.`;

  const toolsJson = {
    schemaVersion: 1,
    name: TITLE,
    description: SUMMARY,
    homepage: SITE_URL,
    repository: REPO_URL,
    count: entries.length,
    counts: { tool: toolEntries.length, skill: skillEntries.length },
    tags: Object.fromEntries(tagCounts),
    tools: entries,
  };

  const aboutLinks = [
    `- [tools.json](${SITE_URL}tools.json): every entry as JSON (fields: id, type, name, description, link, authorName, authorLink, tags, source); type is "tool" or "skill"`,
    `- [llms-full.txt](${SITE_URL}llms-full.txt): every tool and skill with its author and tags, as Markdown`,
    `- [Website](${SITE_URL}): searchable list; filter by tag with \`?tag=<tag>\` and by type with \`?type=tool\` or \`?type=skill\``,
    `- [Contributing guide](${REPO_URL}/blob/master/CONTRIBUTING.md): how to add a tool and what is accepted`,
  ];

  const llmsTxt = [
    `# ${TITLE}`,
    '',
    `> ${SUMMARY}`,
    '',
    countLine,
    '',
    '## Data',
    '',
    ...aboutLinks,
    '',
    ...indexSection('Tools', toolEntries),
    ...indexSection('AI agent skills', skillEntries),
  ].join('\n');

  const llmsFull = [
    `# ${TITLE}`,
    '',
    `> ${SUMMARY}`,
    '',
    countLine,
    '',
    '## Data',
    '',
    ...aboutLinks,
    '',
    '## Tags',
    '',
    ...tagCounts.map(([tag, count]) => `- \`${tag}\` (${count})`),
    '',
    ...fullSection('Tools', toolEntries),
    ...fullSection('AI agent skills', skillEntries),
  ].join('\n');

  return {
    'llms.txt': llmsTxt,
    'llms-full.txt': llmsFull,
    'tools.json': JSON.stringify(toolsJson, null, 2) + '\n',
  };
}

// One line per entry, for llms.txt. Empty sections are left out.
function indexSection(heading, entries) {
  if (entries.length === 0) return [];
  return [
    `## ${heading}`,
    '',
    ...entries.map((t) => `- [${oneLine(t.name)}](${t.link}): ${t.description} (tags: ${t.tags.join(', ')})`),
    '',
  ];
}

// Full details per entry, for llms-full.txt. Empty sections are left out.
function fullSection(heading, entries) {
  if (entries.length === 0) return [];
  return [
    `## ${heading}`,
    '',
    ...entries.flatMap((t) => [
      `### ${oneLine(t.name)}`,
      '',
      t.description,
      '',
      `- Link: ${t.link}`,
      ...(t.authorName ? [`- Author: ${t.authorLink ? `[${oneLine(t.authorName)}](${t.authorLink})` : oneLine(t.authorName)}`] : []),
      `- Tags: ${t.tags.map((tag) => `\`${tag}\``).join(', ')}`,
      `- Source: ${t.source}`,
      '',
    ]),
  ];
}

export function writeAiFiles(tools, outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  const files = buildAiFiles(tools);
  for (const [name, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(outDir, name), content);
    console.log(`Created ${path.join(outDir, name)}`);
  }
}
