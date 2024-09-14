import '@testing-library/jest-dom';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

// Polyfill pour import.meta.env
(global as any).importMeta = {
  env: {
    VITE_MAPBOX_TOKEN: process.env.VITE_MAPBOX_TOKEN,
  },
};

// Polyfill pour import.meta
Object.defineProperty(global, 'import', {
  value: {
    meta: {
      env: {
        VITE_MAPBOX_TOKEN: process.env.VITE_MAPBOX_TOKEN,
      },
    },
  },
});