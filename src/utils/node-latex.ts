import latex from "node-latex";
import fs from "fs";
import { openDB } from "idb";
import { Readable } from "stream";

const arrayBufferToReadable = (buffer: ArrayBuffer): Readable => {
    const readable = new Readable();
    readable._read = () => {};
    readable.push(Buffer.from(buffer));
    readable.push(null);
    return readable;
}

// Utility to open IndexedDB database
const openLatexDB = async () => {
    return await openDB('LatexDB', 1, {
        upgrade(db) {
            db.createObjectStore('latexFiles');
            db.createObjectStore('pdfFiles');
        }
    })
}

export const generateLatex = async (content: string) => {
  // content string to .tex file  
  // store in indexedDB
  const texFileName = 'main.tex'
  fs.writeFileSync(texFileName, content);
  
  const db = await openLatexDB();
  const fileBuffer = fs.readFileSync(texFileName);
  
  await db.put('latexFiles', new Blob([fileBuffer]), texFileName);

  console.log(`Stored .tex file in IndexedDB as ${texFileName}`);
};

export const generatePDFfromLatex = async (content: string) => {
  // content string to .pdf file
  // should point to .tex file
  // store in indexedDB
  const texFileName = 'main.tex'
  const pdfFileName = 'main.pdf'

  await generateLatex(content);

  const db = await openLatexDB();
  const texBlob = await db.get('latexFiles', texFileName);
  const texBuffer = await texBlob?.arrayBuffer();

  if (texBuffer) {
    const latexStream = arrayBufferToReadable(texBuffer)

    const pdfStream = fs.createWriteStream(pdfFileName);
    const pdf = latex(latexStream);

    pdf.pipe(pdfStream);

    pdf.on('error', (err:any) => {
        console.error('Error during LaTeX to PDF compilation:', err);
    })

    pdf.on('finish', async () => {
        console.log(`Generated PDF file ${pdfFileName}`);

        const pdfBuffer = fs.readFileSync(pdfFileName);
        const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        await db.put('pdfFiles', pdfUrl, pdfFileName);
    
        console.log(`Stored .pdf file in IndexedDB as ${pdfFileName}`);
    })
  } else {
    console.error('No .tex file found in IndexedDB');
  }
};

