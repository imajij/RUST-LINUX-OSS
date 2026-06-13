import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// On GitHub Pages a project site is served from /<repo>/, so the asset base must
// match that subpath. The CI workflow sets GITHUB_PAGES=true for that build only.
// Local dev and root-domain hosts (Vercel / Cloudflare / Netlify) stay at '/'.
// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/RUST-LINUX-OSS/' : '/',
  plugins: [react()],
})
