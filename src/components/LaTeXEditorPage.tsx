'use client';

import { useState } from "react";
import { LaTeXRenderer } from "./LaTeXRenderer";
import { EditorComponent } from "./Editor";


export const LaTeXEditorPage = () => {
    const [content, setContent] = useState<string>('\\documentclass{article}\n\\begin{document}\nOne of the most important equations in mathematics:\n$\\int_{a}^{b} f(x)dx$\n\\end{document}');

    return (
        <div className="h-full flex">
            <div className="flex-1">
                <EditorComponent content={content} setContent={setContent} />
            </div>
            <div className="flex-grow">
                <LaTeXRenderer content={content} setContent={setContent} />
            </div>
        </div>
    );
}