import {defineConfig} from '@playwright/test';
import base from './playwright.static.config';
export default defineConfig(base,{
  workers:3,
  webServer:{command:'node scripts/run-workspace.mjs preview --host 127.0.0.1 --port 5311 --strictPort',url:'http://127.0.0.1:5311/PG-portfolio/',reuseExistingServer:false,timeout:120000},
  use:{baseURL:'http://127.0.0.1:5311/PG-portfolio/'}
});
