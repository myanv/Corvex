
import { useState } from "react";
import { LaTeXRenderer } from "./LaTeXRenderer";
import { EditorComponent } from "./editor";


export const LaTeXEditorPage = () => {
    const [content, setContent] = useState<string>('');

    return (
        <div className="h-full flex">
            <EditorComponent content={content} setContent={setContent} />
            <LaTeXRenderer content={content} setContent={setContent} />
        </div>
    );
}