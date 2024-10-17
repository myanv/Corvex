'use client'

import { loader } from "@monaco-editor/react"
import * as monaco from 'monaco-editor'

/**
 * Initializes the monaco editor with a LaTeX syntax highlighter.
 * 
 * Returns an object with a single function, `setupLatexSyntax`, which can be
 * called to register the LaTeX language with Monaco.
 * 
 * After calling `useLatexSyntax`, you can use the `monaco.editor.create` function
 * to create an editor instance with the LaTeX language set.

**/

export const latexSyntax = () => {
    const setupLatexSyntax = () => {
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
    loader.init().then(setupLatexSyntax)

    return {setupLatexSyntax}
}