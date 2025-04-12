import { cwd } from 'node:process';
import { loadEnvConfig } from '@next/env';
loadEnvConfig(cwd());
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
