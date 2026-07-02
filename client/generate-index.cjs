const fs = require('fs');
const path = require('path');

const dataDir = './public/data';
const result = {};

const entries = fs.readdirSync(dataDir);

entries.forEach(company => {
  const companyPath = path.join(dataDir, company);
  if (!fs.statSync(companyPath).isDirectory()) return;
  
  const files = fs.readdirSync(companyPath).filter(f => f.endsWith('.csv'));
  if (files.length === 0) return;
  
  result[company] = files.map(f => ({ fileName: f, path: f }));
});

fs.writeFileSync(path.join(dataDir, 'index.json'), JSON.stringify(result, null, 2));
console.log('Done! Companies found:', Object.keys(result).length);