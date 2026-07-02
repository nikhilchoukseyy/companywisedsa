import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';

const LANGUAGES = {
  python: {
    label: 'Python',
    version: '3.10.0',
    default: '# Write your solution here\n\ndef solution():\n    pass\n\nprint(solution())',
  },
  javascript: {
    label: 'JavaScript',
    version: '18.15.0',
    default: '// Write your solution here\n\nfunction solution() {\n    \n}\n\nconsole.log(solution());',
  },
  cpp: {
    label: 'C++',
    version: '10.2.0',
    default: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // your code\n    return 0;\n}',
  },
  java: {
    label: 'Java',
    version: '15.0.2',
    default: 'public class Main {\n    public static void main(String[] args) {\n        // your code\n    }\n}',
  },
};

export default function CodeEditor({ question, onBack, onLanguageChange, preferredLanguage = 'python' }) {
  const [lang, setLang] = useState(preferredLanguage);
  const [code, setCode] = useState(LANGUAGES[preferredLanguage]?.default || LANGUAGES.python.default);
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (LANGUAGES[preferredLanguage] && preferredLanguage !== lang) {
      setLang(preferredLanguage);
      setCode(LANGUAGES[preferredLanguage].default);
      setOutput('');
    }
  }, [preferredLanguage]);

  const handleLangChange = (language) => {
    setLang(language);
    setCode(LANGUAGES[language].default);
    setOutput('');
    onLanguageChange?.(language);
  };

  const runCode = async () => {
    setRunning(true);
    setOutput('Running...');

    try {
      const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: lang === 'cpp' ? 'c++' : lang,
          version: LANGUAGES[lang].version,
          files: [{ name: 'solution', content: code }],
        }),
      });

      const data = await response.json();
      const result = data.run?.output || data.run?.stderr || '';
      setOutput(result || 'No output (code ran successfully)');
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }

    setRunning(false);
  };

  const difficulty = (question.Difficulty || '').toUpperCase();
  const diffColors = { EASY: '#3fb950', MEDIUM: '#d29922', HARD: '#f85149' };

  return (
    <section className="editor-view">
      <div className="editor-header">
        <div className="editor-header-top">
          <button type="button" onClick={onBack} className="secondary-button">
            Back
          </button>

          <div className="editor-title-block">
            <h2>{question.Title}</h2>
            <span
              className="difficulty-pill"
              style={{
                color: diffColors[difficulty],
                background: `${diffColors[difficulty] || '#58a6ff'}22`,
              }}
            >
              {difficulty}
            </span>
          </div>

          <a href={question.Link} target="_blank" rel="noreferrer" className="editor-link">
            Open on LeetCode
          </a>
        </div>

        {question.Topics && (
          <div className="topics-row">
            {question.Topics.split(',').map((topic) => (
              <span key={topic} className="topic-pill">
                {topic.trim()}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="editor-controls">
        <div className="filter-chip-row">
          {Object.entries(LANGUAGES).map(([key, value]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleLangChange(key)}
              className={`chip-button ${lang === key ? 'is-active' : ''}`}
            >
              {value.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={runCode}
          disabled={running}
          className="primary-button"
        >
          {running ? 'Running...' : 'Run Code'}
        </button>
      </div>

      <div className="editor-workspace">
        <div className="monaco-panel">
          <Editor
            height="100%"
            language={lang === 'cpp' ? 'cpp' : lang}
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              padding: { top: 12 },
            }}
          />
        </div>

        <div className="output-panel">
          <div className="output-label">Output</div>
          <pre className={`output-text ${output.startsWith('Error:') ? 'is-error' : 'is-success'}`}>
            {output || 'Run your code to see output here...'}
          </pre>
        </div>
      </div>
    </section>
  );
}
