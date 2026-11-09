// The categories shown in the site's sidebar. Each entry belongs to every category
// that one of its tags is listed under. Validation requires every entry to have at
// least one of these tags, so new entries always show up in a category.
// Order here is the order on the site.
export const CATEGORIES = [
  {
    id: 'command-line',
    label: 'Command line',
    tags: ['command-line'],
  },
  {
    id: 'android-studio',
    label: 'Android Studio and IDE',
    tags: ['android-studio', 'plugin', 'editor', 'templates', 'preview', 'real-time'],
  },
  {
    id: 'debugging',
    label: 'Debugging',
    tags: ['debugging', 'diagnostics', 'logging', 'network', 'http-requests', 'inspection', 'bug-reports', 'stack-trace', 'adb'],
  },
  {
    id: 'testing',
    label: 'Testing',
    tags: ['testing', 'api-testing', 'mocking', 'automation'],
  },
  {
    id: 'performance',
    label: 'Performance',
    tags: ['profiling', 'performance', 'benchmark', 'macrobenchmark', 'tracing', 'gfxinfo', 'perfetto', 'memory-leak'],
  },
  {
    id: 'ui',
    label: 'UI and Compose',
    tags: ['ui', 'jetpack-compose', 'design', 'layout', 'animation', 'accessibility', 'adaptive'],
  },
  {
    id: 'build',
    label: 'Build and APK',
    tags: ['apk', 'build', 'packaging', 'app-bundle', 'signing', 'dex', 'bytecode', 'compilation', 'obfuscation', 'gradle-plugin', 'apk-diff', 'optimization', 'resources', 'sdk', 'library', 'libraries'],
  },
  {
    id: 'devices',
    label: 'Devices and emulators',
    tags: ['emulator', 'device', 'virtual-device', 'mirroring', 'device-communication', 'screenshot', 'video', 'data-management'],
  },
  {
    id: 'release',
    label: 'Release and Play Store',
    tags: ['google-play', 'aso', 'deployment', 'reviews', 'localization', 'app-icon', 'app-links'],
  },
  {
    id: 'ai',
    label: 'AI and agents',
    tags: ['ai', 'agent-skill', 'llm', 'code-assistant'],
  },
];

// Ids of the categories an entry belongs to, in sidebar order
export function categoriesForTags(tags) {
  return CATEGORIES.filter((category) => category.tags.some((tag) => tags.includes(tag))).map((category) => category.id);
}
