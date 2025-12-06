import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
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

const CodeSnippet = ({ code, language = 'javascript', title, fileName }) => {
    const [copied, setCopied] = useState(false);
    const [highlightedCode, setHighlightedCode] = useState('');

    useEffect(() => {
        try {
            // Map 'html' to 'markup' for Prism
            const prismLanguage = language === 'html' ? 'markup' : language;
            const grammar = Prism.languages[prismLanguage] || Prism.languages.plaintext;
            const highlighted = Prism.highlight(code, grammar, prismLanguage);
            setHighlightedCode(highlighted);
        } catch (error) {
            console.error('Error highlighting code:', error);
            setHighlightedCode(code);
        }
    }, [code, language]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    // Language display name mapping
    const languageNames = {
        javascript: 'JavaScript',
        typescript: 'TypeScript',
        jsx: 'JSX',
        tsx: 'TSX',
        python: 'Python',
        java: 'Java',
        cpp: 'C++',
        c: 'C',
        csharp: 'C#',
        go: 'Go',
        rust: 'Rust',
        php: 'PHP',
        ruby: 'Ruby',
        swift: 'Swift',
        kotlin: 'Kotlin',
        html: 'HTML',
        css: 'CSS',
        sql: 'SQL',
        bash: 'Bash',
        json: 'JSON',
        yaml: 'YAML',
        markdown: 'Markdown',
        plaintext: 'Plain Text'
    };

    return (
        <div className="rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700 bg-[#2d2d2d] my-3 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#1e1e1e] border-b border-gray-700">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    {fileName && (
                        <span className="text-sm text-gray-300 font-mono truncate">{fileName}</span>
                    )}
                    {title && !fileName && (
                        <span className="text-sm text-gray-300 font-medium truncate">{title}</span>
                    )}
                    <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded font-medium flex-shrink-0">
                        {languageNames[language] || language}
                    </span>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition px-2.5 py-1.5 rounded hover:bg-gray-700 flex-shrink-0 ml-2"
                    title={copied ? 'Copied!' : 'Copy code'}
                >
                    {copied ? (
                        <>
                            <Check size={14} className="text-green-400" />
                            <span className="text-green-400">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy size={14} />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>

            {/* Code Content */}
            <div className="overflow-x-auto">
                <pre className="p-4 text-sm leading-relaxed m-0" style={{ fontFamily: '"Fira Code", "Courier New", monospace' }}>
                    <code
                        className={`language-${language === 'html' ? 'markup' : language}`}
                        dangerouslySetInnerHTML={{ __html: highlightedCode }}
                    />
                </pre>
            </div>
        </div>
    );
};

export default CodeSnippet;
