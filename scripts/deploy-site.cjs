const { execSync } = require('child_process');
const fs = require('fs');

console.log('Getting Wix CLI token...');
const token = execSync('npx @wix/cli@latest token', { encoding: 'utf-8' }).trim();
console.log('Got token length:', token.length);

const siteId = '3af6b241-2f72-497c-bad6-8ab2369915ff';
const url = `https://www.wixapis.com/headless-business-setup/v1/headless-business/${siteId}/drop?campaign=mcp&agent=antigravity`;

console.log('Uploading build.zip to Wix...');
const curlCmd = `curl.exe -sS -X POST "${url}" -H "Authorization: Bearer ${token}" -F "files=@build.zip;filename=build.zip"`;

const res = execSync(curlCmd, { encoding: 'utf-8' });
console.log('Deployment response:');
console.log(res);
