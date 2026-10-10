/**
 * Compiles `optic-ui.css` through Vite and the Tailwind plugin, exactly as the app build does, and
 * prints the resulting CSS to stdout. Run by `optic-ui.test.ts` in a child process because Vite and
 * `@tailwindcss/vite` are ESM-only and jest's CommonJS runtime cannot load them.
 *
 * Usage: node compile-optic-ui.mjs <class> [<class> ...]
 * The classes are written to a fixture the Tailwind scanner reads, so each one that is a real
 * utility appears in the output.
 *
 * The work directory is created next to this file, inside the package, so that package imports in
 * the stylesheet resolve through the package's own `node_modules` just like in the app build.
 */
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import { build } from 'vite';

const here = path.dirname(fileURLToPath(import.meta.url));
const classes = process.argv.slice(2);
const workDirectory = mkdtempSync(path.join(here, '.compile-optic-ui-'));

try {
  writeFileSync(
    path.join(workDirectory, 'index.html'),
    '<script type="module" src="./main.js"></script>'
  );
  writeFileSync(path.join(workDirectory, 'main.js'), "import './entry.css';");
  writeFileSync(
    path.join(workDirectory, 'entry.css'),
    `@import ${JSON.stringify(path.join(here, 'optic-ui.css'))};\n@source "./fixture.html";`
  );
  writeFileSync(
    path.join(workDirectory, 'fixture.html'),
    `<div class="${classes.join(' ')}"></div>`
  );

  const result = await build({
    root: workDirectory,
    logLevel: 'silent',
    configFile: false,
    plugins: [tailwindcss()],
    build: { write: false, minify: false, cssMinify: false },
  });

  const outputs = (Array.isArray(result) ? result : [result]).flatMap((entry) =>
    'output' in entry ? entry.output : []
  );
  const css = outputs.find((output) => output.type === 'asset' && output.fileName.endsWith('.css'));

  if (!css) {
    throw new Error('Build produced no CSS asset');
  }

  process.stdout.write(String(css.source));
} finally {
  rmSync(workDirectory, { recursive: true, force: true });
}
