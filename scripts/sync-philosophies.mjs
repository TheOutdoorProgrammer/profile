import { syncCanonical } from '@nerdswhofish/philosophies/sync';

console.log(await syncCanonical('philosophies.json') ? 'Updated reviewed philosophies' : 'Philosophies are current');
