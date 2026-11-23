import fs from 'node:fs';
import path from 'node:path';

const routes = [
  'about',
  'services',
  'calculator',
  'book-online',
  'login',
  'booking-calendar/platinum-support-plan',
  'booking-calendar/gold-support-plan',
  'booking-calendar/silver-support-plan',
  'booking-calendar/bronze-support-plan',
  'installer-support',
  'approved-installers',
  'manufacturer-support',
  'faq',
  'privacy-policy',
  'cookie-policy',
  'terms-conditions',
];

const distDir = path.resolve(process.cwd(), 'dist');
const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

for (const route of routes) {
  // 1. Exact .html file (e.g. dist/services.html)
  const htmlPath = path.join(distDir, `${route}.html`);
  fs.mkdirSync(path.dirname(htmlPath), { recursive: true });
  fs.writeFileSync(htmlPath, indexHtml, 'utf-8');

  // 2. Extensionless file (e.g. dist/services) for direct clean URL requests
  const noExtPath = path.join(distDir, route);
  // Remove if it was a directory from previous builds
  if (fs.existsSync(noExtPath) && fs.statSync(noExtPath).isDirectory()) {
    fs.rmSync(noExtPath, { recursive: true, force: true });
  }
  fs.mkdirSync(path.dirname(noExtPath), { recursive: true });
  fs.writeFileSync(noExtPath, indexHtml, 'utf-8');
}

// 3. Fallback 404.html to redirect any missed routes to client-side hash router
const fallback404 = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Energy Aftercare</title>
    <script>
      var p = window.location.pathname.replace(/\\.html$/, '');
      var s = window.location.search;
      window.location.replace('/#' + (p === '/' ? '' : p) + s);
    </script>
  </head>
  <body style="background:#0a0a0a;color:#fff;font-family:sans-serif;padding:3rem;text-align:center;">
    <p>Loading Energy Aftercare...</p>
  </body>
</html>`;
fs.writeFileSync(path.join(distDir, '404.html'), fallback404, 'utf-8');

console.log(`Generated .html and extensionless files for ${routes.length} SPA routes + 404.html.`);
