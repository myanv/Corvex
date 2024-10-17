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

        const latexCommands = [
            // Format: { label, insertText, documentation (optional) }
            { label: '\\frac', insertText: '\\frac{${1:numerator}}{${2:denominator}}', documentation: 'Fraction' },
            { label: '\\sum', insertText: '\\sum_{${1:n=1}}^{${2:\\infty}} ${3:expression}', documentation: 'Summation' },
            { label: '\\int', insertText: '\\int_{${1:a}}^{${2:b}} ${3:expression} \\, d${4:x}', documentation: 'Integral' },
            { label: '\\sqrt', insertText: '\\sqrt{${1:expression}}', documentation: 'Square Root' },
            { label: '\\begin{}', insertText: '\\begin{${1:environment}}\n\t${2}\n\\end{${1:environment}}', documentation: 'Begin Environment' },
            { label: '\\includegraphics', insertText: '\\includegraphics[width=${1:\\linewidth}]{${2:file}}', documentation: 'Include Graphics' },
            { label: '\\textbf', insertText: '\\textbf{${1:text}}', documentation: 'Bold Text' },
            { label: '\\textit', insertText: '\\textit{${1:text}}', documentation: 'Italic Text' },
            { label: '\\underline', insertText: '\\underline{${1:text}}', documentation: 'Underline Text' },
            { label: '\\item', insertText: '\\item ${1}', documentation: 'List Item' },
            { label: '\\label', insertText: '\\label{${1:key}}', documentation: 'Label' },
            { label: '\\ref', insertText: '\\ref{${1:key}}', documentation: 'Reference' },
            { label: '\\cite', insertText: '\\cite{${1:key}}', documentation: 'Citation' },
            { label: '\\section', insertText: '\\section{${1:Section Title}}', documentation: 'Section' },
            { label: '\\subsection', insertText: '\\subsection{${1:Subsection Title}}', documentation: 'Subsection' },
            { label: '\\begin{itemize}', insertText: '\\begin{itemize}\n\t\\item ${1}\n\\end{itemize}', documentation: 'Itemize List' },
            { label: '\\begin{enumerate}', insertText: '\\begin{enumerate}\n\t\\item ${1}\n\\end{enumerate}', documentation: 'Enumerate List' },
            // Add more commands as needed
          ];

        // Auto-completion
        monaco.languages.registerCompletionItemProvider('latex', {
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