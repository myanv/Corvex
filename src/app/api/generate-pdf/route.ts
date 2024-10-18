import { NextResponse } from 'next/server';
import latex from 'node-latex';
import { Readable } from 'stream';

// Helper function to convert LaTeX content to PDF
const generatePDFfromLatex = (content: string): Promise<Buffer> => {
  const latexStream = new Readable();
  latexStream.push(content);
  latexStream.push(null); 

  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    const pdf = latex(latexStream);

    pdf.on('data', chunk => chunks.push(chunk));
    pdf.on('end', () => resolve(Buffer.concat(chunks)));
    pdf.on('error', (err: any) => reject(err));
  });
};

export async function POST(request: Request) {
  const { content } = await request.json();

  try {

    const pdfBuffer = await generatePDFfromLatex(content);


    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="generated.pdf"',
      },
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'PDF generation failed' }), { status: 500 });
  }
}
