const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('\n=========================================');
  console.log('🚀 ENERGY AFTERCARE - WIX RELEASE PIPELINE');
  console.log('=========================================\n');

  const rootDir = path.resolve(__dirname, '..');
  const distDir = path.join(rootDir, 'dist');
  const zipPath = path.join(rootDir, 'build.zip');

  // 1. Build
  console.log('📦 Step 1: Building Vite production bundle...');
  execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });

  // 2. SPA routes
  console.log('\n📄 Step 2: Generating SPA fallback routes & 404 handler...');
  execSync('node scripts/generate-spa-routes.mjs', { cwd: rootDir, stdio: 'inherit' });

  // 3. Compress dist to build.zip
  console.log('\n🗜️ Step 3: Packaging dist into build.zip...');
  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
  }

  const isWindows = process.platform === 'win32';
  if (isWindows) {
    execSync(`tar.exe -ac -f "${zipPath}" *`, { cwd: distDir, stdio: 'inherit' });
  } else {
    execSync(`zip -r "${zipPath}" .`, { cwd: distDir, stdio: 'inherit' });
  }

  const zipSizeMb = (fs.statSync(zipPath).size / (1024 * 1024)).toFixed(2);
  console.log(`✅ build.zip ready (${zipSizeMb} MB)`);

  // 4. Wix Auth Token
  console.log('\n🔑 Step 4: Obtaining Wix authentication token...');
  let token = '';
  try {
    token = execSync('npx @wix/cli@latest token', { encoding: 'utf-8' }).trim();
    if (!token) throw new Error('Empty token returned');
    console.log(`✅ Wix token obtained (length: ${token.length})`);
  } catch (err) {
    console.error('\n❌ Could not get Wix token. Please make sure you are logged in by running:');
    console.error('   npx @wix/cli login\n');
    process.exit(1);
  }

  // 5. Deploy to Wix
  const siteId = '3af6b241-2f72-497c-bad6-8ab2369915ff';
  const dropUrl = `https://www.wixapis.com/headless-business-setup/v1/headless-business/${siteId}/drop?campaign=mcp&agent=antigravity`;

  console.log(`\n🌐 Step 5: Uploading & releasing to Wix site (${siteId})...`);
  const curlCmd = `curl.exe -sS -X POST "${dropUrl}" -H "Authorization: Bearer ${token}" -F "files=@build.zip;filename=build.zip"`;

  try {
    const rawRes = execSync(curlCmd, { cwd: rootDir, encoding: 'utf-8' });
    let parsed;
    try {
      parsed = JSON.parse(rawRes);
    } catch {
      parsed = rawRes;
    }

    console.log('\n🎉 RELEASE SUCCESSFUL!');
    console.log('-----------------------------------------');
    if (parsed.siteUrl) {
      console.log(`🌐 Live Site URL: ${parsed.siteUrl}`);
    } else {
      console.log(rawRes);
    }
    console.log('-----------------------------------------\n');
  } catch (err) {
    console.error('❌ Failed to upload build.zip to Wix:', err.message);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Unexpected error during release:', err);
  process.exit(1);
});
