import { buildTelemetry } from '@nerdswhofish/browser-telemetry/build';
import { renderPage } from '@nerdswhofish/philosophies/build';
import { copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

await buildTelemetry({ entry: 'browser/telemetry.js', outfile: 'assets/telemetry.js' });
await renderPage('_includes/philosophies-page.html', 'philosophies/index.html', 'philosophies.json');
await copyFile(fileURLToPath(import.meta.resolve('@nerdswhofish/philosophies/style.css')), 'assets/philosophies.css');
