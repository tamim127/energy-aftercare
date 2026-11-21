import fs from 'node:fs';
import path from 'node:path';

const routes = [
  'about',
  'services',
  'calculator',
  'book-online',
  'booking-calendar/platinum-support-plan',
  'booking-calendar/gold-support-plan',
  'booking-calendar/silver-support-plan',
  'booking-calendar/bronze-support-plan',
  'installer-support',
  'approved-installers',
  'manufacturer-support',
  'faq',
  'blank-6',
  'privacy-policy',
  'blank-3',
  'cookie-policy',
  'blank-1',
  'terms-conditions',
  'blank-2',
];

const distDir = path.resolve(process.cwd(), 'dist');
const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

for (const route of routes) {
  // 1. Folder with index.html (for trailing slash requests)
  const targetDir = path.join(distDir, route);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'index.html'), indexHtml, 'utf-8');

  // 2. Exact .html file (for non-trailing slash requests)
  const filePath = path.join(distDir, `${route}.html`);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, indexHtml, 'utf-8');
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

console.log(`Generated fallback index.html and .html for ${routes.length} SPA routes + 404.html.`);
