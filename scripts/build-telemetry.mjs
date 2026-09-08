import { buildTelemetry } from '@nerdswhofish/browser-telemetry/build';

await buildTelemetry({ entry: 'browser/telemetry.js', outfile: 'assets/telemetry.js' });
