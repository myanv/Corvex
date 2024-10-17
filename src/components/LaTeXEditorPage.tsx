import { Editor } from "@monaco-editor/react";
import { useState } from "react";


export const LaTeXEditorPage = () => {
    const [content, setContent] = useState<string>('');
    
    return (
        <div className="h-full flex">
            <Editor />
        </div>
    );
}