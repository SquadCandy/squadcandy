import { defineConfig } from 'astro/config';

const site =process.env.CF_PAGES_URL || process.env.SITE || undefined;

export default defineConfig({
  site,
  base: '/',
});
