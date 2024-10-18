import React, { useEffect, useState } from 'react';
import { generatePDFfromLatex } from '../utils/node-latex';

interface LaTeXRendererProps {
    content: string;
    setContent: (content: string) => void;
}

export const LaTeXRenderer: React.FC<LaTeXRendererProps> = ({ content }) => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    useEffect(() => {
        const renderPDF = async () => {
            try {
                const pdfBlob = await generatePDFfromLatex(content);
                const pdfBlobUrl = URL.createObjectURL(pdfBlob);

                // Update the state with the Blob URL
                setPdfUrl(pdfBlobUrl);
            } catch (error) {
                console.error('Error generating PDF:', error);
            }
        };

        // Trigger PDF generation when the LaTeX content changes
        renderPDF();
    }, [content]);

    return (
        <div className="latex-renderer">
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
