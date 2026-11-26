import fs from 'node:fs';
import path from 'node:path';

const routes = [
  'about',
  'About',
  'services',
  'Services',
  'calculator',
  'Calculator',
  'book-online',
  'Book-Online',
  'checkout',
  'Checkout',
  'login',
  'booking-calendar/platinum-support-plan',
  'booking-calendar/gold-support-plan',
  'booking-calendar/silver-support-plan',
  'booking-calendar/bronze-support-plan',
  'installer-support',
  'Installer-Support',
  'approved-installers',
  'approved-Installers',
  'Approved-Installers',
  'manufacturer-support',
  'faq',
  'FAQ',
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
  if (fs.existsSync(noExtPath) && fs.statSync(noExtPath).isDirectory()) {
    fs.rmSync(noExtPath, { recursive: true, force: true });
  }
  fs.mkdirSync(path.dirname(noExtPath), { recursive: true });
  fs.writeFileSync(noExtPath, indexHtml, 'utf-8');
}

// 3. Fallback 404.html to serve SPA bundle directly
fs.writeFileSync(path.join(distDir, '404.html'), indexHtml, 'utf-8');

console.log(`Generated .html and extensionless files for ${routes.length} SPA routes + 404.html.`);
