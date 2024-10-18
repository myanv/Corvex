import latex from "node-latex";
import * as fs from 'fs';
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

export const generatePDFfromLatex = async (content: string): Promise<Blob> => {
    const texFileName = 'generated-latex.tex';
    const pdfFileName = 'generated-latex.pdf';
  
    await generateLatex(content);
  

    const db = await openLatexDB();
    const texBlob = await db.get('latexFiles', texFileName);
    const texBuffer = await texBlob?.arrayBuffer();
  
    if (texBuffer) {

      const latexStream = arrayBufferToReadable(texBuffer);
  
      const pdfStream = fs.createWriteStream(pdfFileName);
      const pdf = latex(latexStream);
  
      return new Promise((resolve, reject) => {
        const chunks: Uint8Array[] = [];
        pdf.on('data', chunk => chunks.push(chunk));
        pdf.on('end', () => {
          const pdfBuffer = Buffer.concat(chunks);
          const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' });
          resolve(pdfBlob);
        });
        pdf.on('error', (err: any) => reject(err));
      });
    } else {
      throw new Error("Failed to retrieve the LaTeX file from IndexedDB.");
    }
  };