import { NextResponse } from 'next/server';
import latex from 'node-latex';
import { Readable } from 'stream';
import * as fs from 'fs';
import { promises as fsp } from 'fs';
import path from 'path';
import os from 'os';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    const tempDir = path.join(os.tmpdir(), randomUUID());
    await fsp.mkdir(tempDir, { recursive: true})

    const tempFilePath = path.join(tempDir, 'output.pdf');

    const pdfStream = generatePDFStream(content, tempDir);

    const writeStream = fs.createWriteStream(tempFilePath);

    console.log('\nGenerating PDF...\n');

    await new Promise<void>((resolve, reject) => {
      pdfStream.pipe(writeStream);
      pdfStream.on('error', reject);
      pdfStream.on('end', resolve);
    });

    console.log('\nPDF generated successfully\n');

    const pdfBuffer = await fsp.readFile(tempFilePath);

    await fsp.rm(tempDir, { recursive: true, force: true });

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="document.pdf"',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}

function generatePDFStream(content: string, workingDir: string): Readable {
  const input = Readable.from(content);
  const options = { 
    cmd: 'pdflatex',
    inputs: workingDir,
  }; // Ensure pdflatex is available 
  return latex(input, options);
}
