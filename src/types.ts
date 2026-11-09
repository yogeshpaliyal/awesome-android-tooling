export type EntryType = 'tool' | 'skill';

// One entry of src/data.json, written by scripts/merge.js
export interface Tool {
  name: string;
  description: string;
  link: string;
  type?: EntryType; // "tool" when left out
  tags: string[];
  authorName?: string;
  authorLink?: string;
  categories: string[]; // ids from scripts/categories.js
  stars?: number; // GitHub links only, fetched at build time
  pushedAt?: string | null; // GitHub links only, fetched at build time
}

export interface Category {
  id: string;
  label: string;
}

export interface SiteData {
  categories: Category[];
  tools: Tool[];
}

export const getEntryType = (tool: Tool): EntryType => tool.type ?? 'tool';
