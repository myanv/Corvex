'use client';

import React, { useRef } from 'react';
import Editor, { Monaco, OnChange, OnMount, BeforeMount } from '@monaco-editor/react';
import { provideLatexCompletionItems } from '@/hooks/editor/latexAutocomplete';
import type monaco from 'monaco-editor';

export const EditorComponent = () => {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();

    const handleEditorWillMount: BeforeMount = (monaco: Monaco) => {
        monaco.languages.register({ id: 'latex' })

        // Syntax highlighting
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

        // Auto-completion
        monaco.languages.registerCompletionItemProvider('latex', {
            triggerCharacters: ['\\', '{', '}'],
            provideCompletionItems: (model, position) => {
                return provideLatexCompletionItems(model, position);
            }
        })

        monaco.languages.register({ id: 'latex-snippets' })
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
            defaultValue='\\documentclass{article}\n\\begin{document}\n\n\\end{document}'
            theme="vs-dark"
            onMount={handleEditorDidMount}
            beforeMount={handleEditorWillMount}
            onChange={handleEditorChange}
            options={{
                fontFamily: 'var(--font-geist-sans)',
                fontSize: 16,
                formatOnType: true,
                snippetSuggestions: 'top',
                automaticLayout: true
            }}
        />
    )
}