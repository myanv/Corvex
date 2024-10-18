'use client'
import React, { useEffect, useState } from 'react';

interface LaTeXRendererProps {
  content: string;
  setContent: (content: string) => void;
}

export const LaTeXRenderer: React.FC<LaTeXRendererProps> = ({ content }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const generatePDF = async () => {
      try {
        const response = await fetch('/api/generate-pdf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        });

        if (response.ok) {
          const pdfBlob = await response.blob();
          const pdfBlobUrl = URL.createObjectURL(pdfBlob);
          setPdfUrl(pdfBlobUrl);
        } else {
          console.error('Failed to generate PDF:', response.statusText);
        }
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    };


  return (
    <div className="latex-renderer">
        <button onClick={generatePDF}>Generate PDF</button>
      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          width="100%"
          height="100%"
          style={{ border: 'none' }}
        />
      ) : (
        <p>Loading PDF...</p>
      )}
    </div>
  );
};
