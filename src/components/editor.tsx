'use client';

import React, { useRef } from 'react';
import Editor, { Monaco, OnChange, OnMount, BeforeMount } from '@monaco-editor/react';
import type monaco from 'monaco-editor';

const EditorComponent = () => {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();

    const handleEditorWillMount: BeforeMount = (monaco: Monaco) => {
        monaco.languages.register({ id: 'latex' })
        monaco.languages.setMonarchTokensProvider('latex', {
            tokenizer: {
                root: [
                    [/\\[a-zA-Z]+/, 'keyword'],
                    [/\\\w+/, 'delimiter.curly'],
                    [/\\[{}$]/, 'delimiter.square'],
                    [/\$.*?\$/, 'string'],
                    [/%.*$/, 'comment'],
                ]
            }
        })
    }

    const handleEditorDidMount: OnMount = (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
        editorRef.current = editor;
    }

    const handleEditorChange: OnChange = (value: string | undefined, event: monaco.editor.IModelContentChangedEvent) => {
        console.log('current model value:', value);
    }
    return (
        <Editor
            height="100%"
            defaultLanguage="latex"
            defaultValue='Type your LaTeX code here...'
            theme="vs-dark"
            onMount={handleEditorDidMount}
            beforeMount={handleEditorWillMount}
            onChange={handleEditorChange}
            options={{
                fontFamily: 'var(--font-geist-sans)',
                fontSize: 18,
                automaticLayout: true
            }}
        />
    )
}