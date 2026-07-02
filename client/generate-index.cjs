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

  const allFile = files.find((file) => file === '5. All.csv') || files[files.length - 1];
  let questionCount = 0;

  if (allFile) {
    const allFilePath = path.join(companyPath, allFile);
    const content = fs.readFileSync(allFilePath, 'utf8').trim();
    if (content) {
      questionCount = content.split(/\r?\n/).length - 1;
    }
  }

  result[company] = {
    questionCount,
    files: files.map(f => ({ fileName: f, path: f })),
  };
});

fs.writeFileSync(path.join(dataDir, 'index.json'), JSON.stringify(result, null, 2));
console.log('Done! Companies found:', Object.keys(result).length);
