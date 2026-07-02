import Papa from 'papaparse';
import { createQuestionId } from './questionId';

// public/data mein jo index.json banayenge usse fetch karenge
// pehle companies ki list fetch karo
export async function buildCompanyMap() {
  const res = await fetch('/index.json');
  const companies = await res.json();
  return companies;
}

export async function loadCSV(companyName, fileName) {
  const url = `/data/${companyName}/${fileName}`;
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (result) =>
        resolve(
          result.data.map((row) => ({
            ...row,
            company: companyName,
            fileName,
            questionId: createQuestionId(row.Link, row.Title),
          }))
        ),
      error: reject,
    });
  });
}
