import { useEffect, useRef } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

// Import languages in correct dependency order
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-markup'; // HTML
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-markdown';

const CodeEditor = ({ value, onChange, language = 'javascript' }) => {
    const editorRef = useRef(null);

    const highlightCode = (code) => {
        try {
            const prismLanguage = language === 'html' ? 'markup' : language;
            const grammar = Prism.languages[prismLanguage] || Prism.languages.plaintext;
            return Prism.highlight(code, grammar, prismLanguage);
        } catch (error) {
            console.error('Highlighting error:', error);
            return code;
        }
    };

    return (
        <div className="rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700 bg-[#2d2d2d] shadow-sm">
            <Editor
                ref={editorRef}
                value={value}
                onValueChange={onChange}
                highlight={highlightCode}
                padding={16}
                className="font-mono text-sm min-h-[200px] max-h-[400px] overflow-auto"
                style={{
                    fontFamily: '"Fira Code", "Courier New", monospace',
                    fontSize: 14,
                    lineHeight: 1.6,
                    backgroundColor: '#2d2d2d',
                    color: '#ccc',
                    caretColor: '#fff',
                }}
                textareaClassName="outline-none"
                placeholder="// Paste your code here..."
            />
        </div>
    );
};

export default CodeEditor;
