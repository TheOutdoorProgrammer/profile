import { initializeTelemetry } from '@nerdswhofish/browser-telemetry';
import { refreshPhilosophies } from '@nerdswhofish/philosophies';

window.appTelemetry = initializeTelemetry({
  url: 'https://faro-collector-prod-us-east-3.grafana.net/collect/e58d29c1033f2b7d4321c0ede2ef8fd4',
  app: { name: 'The Outdoor Programmer', version: __APP_VERSION__, environment: 'production' },
  routes: ["/","/blog/","/solar/","/philosophies/"],
  assets: ["/assets/telemetry.js"],
  operations: ['philosophies-refresh'],
});

document.addEventListener('DOMContentLoaded', () => refreshPhilosophies(document.querySelector('[data-philosophies]'), {
  onError: () => window.appTelemetry?.captureError(new Error('Philosophies refresh failed'), 'philosophies-refresh'),
}));
