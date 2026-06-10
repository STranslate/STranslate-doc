#!/usr/bin/env node

const fs = require('node:fs/promises');
const path = require('node:path');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');

const execFileAsync = promisify(execFile);

const DEFAULT_ORG = 'STranslate';
const MARKET_BRANCHES = ['main', 'master'];
const REQUEST_TIMEOUT_MS = 15000;
const PLUGINS_JSON_PATH = 'vitepress/plugins.json';
const BUILTIN_PLUGINS_API_URL =
  'https://api.github.com/repos/STranslate/STranslate/contents/src/Plugins?ref=main';
const BUILTIN_PLUGINS_RAW_BASE =
  'https://raw.githubusercontent.com/STranslate/STranslate/main/src/Plugins';

const pluginsFile = process.env.PLUGINS_FILE
  ? path.resolve(process.env.PLUGINS_FILE)
  : path.join(process.cwd(), PLUGINS_JSON_PATH);

async function main() {
  const currentEntries = await readPluginEntriesFile(pluginsFile);
  const baseState = await readBasePluginEntries();

  for (const warning of baseState.warnings) {
    printWarning(warning);
  }

  const { addedEntries, existingEntries } = splitAddedEntries(
    currentEntries,
    baseState.entries,
  );

  if (addedEntries.length === 0) {
    console.log('No newly added plugin entries found. Skipping PluginID conflict checks.');
    return;
  }

  console.log(`Found ${addedEntries.length} newly added plugin entr${addedEntries.length === 1 ? 'y' : 'ies'}.`);

  const [addedResults, existingResults, builtinState] = await Promise.all([
    Promise.all(addedEntries.map((entry) => fetchMarketPluginInfo(entry, 'added-market'))),
    Promise.all(existingEntries.map((entry) => fetchMarketPluginInfo(entry, 'existing-market'))),
    fetchBuiltinPluginInfos(),
  ]);

  const warnings = [
    ...existingResults.filter((result) => result.error).map(formatResultWarning),
    ...builtinState.warnings,
  ];
  const failures = addedResults.filter((result) => result.error);
  const comparableResults = [
    ...addedResults,
    ...existingResults,
    ...builtinState.results,
  ].filter((result) => result.pluginId);
  const duplicates = findDuplicatePluginIds(comparableResults)
    .filter((duplicate) => duplicate.matches.some((match) => match.source === 'added-market'));

  for (const warning of warnings) {
    printWarning(warning);
  }

  if (failures.length > 0 || duplicates.length > 0) {
    printFailures(failures, duplicates);
    process.exitCode = 1;
    return;
  }

  console.log(
    `Validated ${addedResults.length} added plugin entr${addedResults.length === 1 ? 'y' : 'ies'} against ` +
      `${countValid(existingResults)} existing market plugins and ${builtinState.results.length} builtin plugins. ` +
      'No conflicting PluginID values found.',
  );
}

async function readPluginEntriesFile(filePath, options = {}) {
  let raw;

  try {
    raw = await fs.readFile(filePath, 'utf8');
  } catch (error) {
    throw new Error(`Failed to read ${filePath}: ${error.message}`);
  }

  return parsePluginEntries(raw, filePath, options);
}

async function readBasePluginEntries() {
  if (process.env.BASE_PLUGINS_FILE) {
    const baseFile = path.resolve(process.env.BASE_PLUGINS_FILE);

    try {
      return {
        entries: await readPluginEntriesFile(baseFile, { allowEmpty: true }),
        warnings: [],
      };
    } catch (error) {
      return {
        entries: [],
        warnings: [`Failed to read BASE_PLUGINS_FILE (${baseFile}); treating all current entries as added. ${error.message}`],
      };
    }
  }

  const baseRef = process.env.BASE_PLUGINS_REF;

  if (!baseRef) {
    return {
      entries: [],
      warnings: ['BASE_PLUGINS_REF was not set; treating all current entries as added.'],
    };
  }

  if (/^0+$/.test(baseRef)) {
    return {
      entries: [],
      warnings: [`BASE_PLUGINS_REF (${baseRef}) is empty; treating all current entries as added.`],
    };
  }

  try {
    const { stdout } = await execFileAsync(
      'git',
      ['show', `${baseRef}:${PLUGINS_JSON_PATH}`],
      {
        cwd: process.cwd(),
        encoding: 'utf8',
        maxBuffer: 1024 * 1024,
      },
    );

    return {
      entries: parsePluginEntries(stdout, `${baseRef}:${PLUGINS_JSON_PATH}`, { allowEmpty: true }),
      warnings: [],
    };
  } catch (error) {
    return {
      entries: [],
      warnings: [`Failed to read ${PLUGINS_JSON_PATH} from BASE_PLUGINS_REF (${baseRef}); treating all current entries as added. ${error.message}`],
    };
  }
}

function parsePluginEntries(raw, label, options = {}) {
  let parsed;

  try {
    parsed = JSON.parse(stripBom(raw));
  } catch (error) {
    throw new Error(`${label} is not valid JSON: ${error.message}`);
  }

  if (!Array.isArray(parsed)) {
    throw new Error(`${label} must contain a JSON array.`);
  }

  if (!options.allowEmpty && parsed.length === 0) {
    throw new Error(`${label} must contain at least one plugin entry.`);
  }

  const invalidEntries = parsed
    .map((entry, index) => ({ entry, index }))
    .filter(({ entry }) => typeof entry !== 'string' || entry.trim() === '');

  if (invalidEntries.length > 0) {
    const details = invalidEntries
      .map(({ entry, index }) => `  - index ${index}: ${JSON.stringify(entry)}`)
      .join('\n');
    throw new Error(`${label} must contain only non-empty string entries:\n${details}`);
  }

  return parsed.map((entry) => entry.trim());
}

function splitAddedEntries(currentEntries, baseEntries) {
  const remainingBaseCounts = new Map();

  for (const entry of baseEntries) {
    remainingBaseCounts.set(entry, (remainingBaseCounts.get(entry) || 0) + 1);
  }

  const addedEntries = [];
  const existingEntries = [];

  for (const entry of currentEntries) {
    const remaining = remainingBaseCounts.get(entry) || 0;

    if (remaining > 0) {
      existingEntries.push(entry);
      remainingBaseCounts.set(entry, remaining - 1);
    } else {
      addedEntries.push(entry);
    }
  }

  return { addedEntries, existingEntries };
}

async function fetchMarketPluginInfo(entry, source) {
  let repo;

  try {
    repo = parseRepoEntry(entry);
  } catch (error) {
    return {
      source,
      entry,
      error: error.message,
    };
  }

  const attemptedUrls = [];

  for (const branch of MARKET_BRANCHES) {
    const url = buildMarketPluginJsonUrl(repo, branch);
    attemptedUrls.push(url);

    try {
      const response = await fetchWithTimeout(url);

      if (response.status === 404) {
        continue;
      }

      if (!response.ok) {
        return {
          source,
          entry,
          attemptedUrls,
          error: `Failed to fetch plugin.json: HTTP ${response.status} ${response.statusText}`,
        };
      }

      return parsePluginInfo({
        source,
        entry,
        url,
        raw: await response.text(),
      });
    } catch (error) {
      return {
        source,
        entry,
        attemptedUrls,
        error: error.message,
      };
    }
  }

  return {
    source,
    entry,
    attemptedUrls,
    error: 'plugin.json was not found on main or master.',
  };
}

async function fetchBuiltinPluginInfos() {
  try {
    const response = await fetchWithTimeout(BUILTIN_PLUGINS_API_URL, { githubApi: true });

    if (!response.ok) {
      return {
        results: [],
        warnings: [`Failed to list builtin plugins: HTTP ${response.status} ${response.statusText}`],
      };
    }

    const entries = await parseJsonResponse(response, BUILTIN_PLUGINS_API_URL);
    const pluginDirs = entries
      .filter((entry) => entry && entry.type === 'dir' && typeof entry.name === 'string')
      .map((entry) => entry.name);

    const results = await Promise.all(pluginDirs.map(fetchBuiltinPluginInfo));

    return {
      results: results.filter((result) => !result.error),
      warnings: results.filter((result) => result.error).map(formatResultWarning),
    };
  } catch (error) {
    return {
      results: [],
      warnings: [`Failed to load builtin plugins; skipping builtin PluginID comparison. ${error.message}`],
    };
  }
}

async function fetchBuiltinPluginInfo(entry) {
  const url = `${BUILTIN_PLUGINS_RAW_BASE}/${entry}/plugin.json`;

  try {
    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      return {
        source: 'builtin',
        entry,
        url,
        error: `Failed to fetch plugin.json: HTTP ${response.status} ${response.statusText}`,
      };
    }

    return parsePluginInfo({
      source: 'builtin',
      entry,
      url,
      raw: await response.text(),
    });
  } catch (error) {
    return {
      source: 'builtin',
      entry,
      url,
      error: error.message,
    };
  }
}

function parsePluginInfo({ source, entry, url, raw }) {
  let pluginJson;

  try {
    pluginJson = JSON.parse(stripBom(raw));
  } catch (error) {
    return {
      source,
      entry,
      url,
      error: `Failed to parse plugin.json: ${error.message}`,
    };
  }

  const pluginId = pluginJson.PluginID;

  if (typeof pluginId !== 'string' || pluginId.trim() === '') {
    return {
      source,
      entry,
      url,
      error: 'plugin.json must contain a non-empty PluginID string.',
    };
  }

  return {
    source,
    entry,
    url,
    pluginId: pluginId.trim(),
  };
}

function parseRepoEntry(entry) {
  if (!entry.includes('/')) {
    return {
      owner: DEFAULT_ORG,
      repoName: entry,
    };
  }

  const parts = entry.split('/');

  if (parts.length !== 2 || parts.some((part) => part.trim() === '')) {
    throw new Error(`Invalid plugin repo entry: ${entry}`);
  }

  return {
    owner: parts[0],
    repoName: parts[1],
  };
}

function buildMarketPluginJsonUrl(repo, branch) {
  return `https://raw.githubusercontent.com/${repo.owner}/${repo.repoName}/${branch}/${repo.repoName}/plugin.json`;
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: buildHeaders(options),
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`Timed out fetching ${url}`);
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function buildHeaders(options) {
  const headers = {
    'User-Agent': 'STranslate-doc-plugin-validator',
  };

  if (options.githubApi) {
    headers.Accept = 'application/vnd.github+json';
    headers['X-GitHub-Api-Version'] = '2022-11-28';

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
  }

  return headers;
}

async function parseJsonResponse(response, url) {
  try {
    return JSON.parse(stripBom(await response.text()));
  } catch (error) {
    throw new Error(`Failed to parse ${url}: ${error.message}`);
  }
}

function stripBom(value) {
  return value.replace(/^\uFEFF/, '');
}

function findDuplicatePluginIds(results) {
  const byPluginId = new Map();

  for (const result of results) {
    const existing = byPluginId.get(result.pluginId) || [];
    existing.push(result);
    byPluginId.set(result.pluginId, existing);
  }

  return [...byPluginId.entries()]
    .filter(([, matches]) => matches.length > 1)
    .map(([pluginId, matches]) => ({ pluginId, matches }));
}

function countValid(results) {
  return results.filter((result) => result.pluginId).length;
}

function formatResultWarning(result) {
  const location = result.url
    ? ` ${result.url}`
    : result.attemptedUrls
      ? ` Attempted URLs: ${result.attemptedUrls.join(', ')}`
      : '';

  return `[${result.source}] ${result.entry}: ${result.error}.${location}`;
}

function printWarning(message) {
  console.warn(`Warning: ${message}`);
}

function printFailures(failures, duplicates) {
  console.error('Plugin validation failed.');

  if (failures.length > 0) {
    console.error('\nInvalid newly added plugin entries:');

    for (const failure of failures) {
      console.error(`\n- [${failure.source}] ${failure.entry}`);
      console.error(`  ${failure.error}`);

      if (failure.url) {
        console.error(`  URL: ${failure.url}`);
      } else if (failure.attemptedUrls) {
        console.error('  Attempted URLs:');
        for (const url of failure.attemptedUrls) {
          console.error(`    - ${url}`);
        }
      }
    }
  }

  if (duplicates.length > 0) {
    console.error('\nPluginID conflicts involving newly added plugins:');

    for (const duplicate of duplicates) {
      console.error(`\n- ${duplicate.pluginId}`);

      for (const match of duplicate.matches) {
        console.error(`  - [${match.source}] ${match.entry}`);
        console.error(`    ${match.url}`);
      }
    }
  }
}

main().catch((error) => {
  console.error(`Plugin validation failed: ${error.message}`);
  process.exitCode = 1;
});
