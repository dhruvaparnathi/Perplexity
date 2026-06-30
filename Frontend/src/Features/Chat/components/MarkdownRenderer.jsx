import React, { useState } from "react";

export default function MarkdownRenderer({ content }) {
  if (!content) return null;

  // Split content by code blocks first
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="prose prose-invert max-w-none text-zinc-300 text-sm leading-relaxed space-y-4">
      {parts.map((part, index) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          // It's a code block
          const match = part.match(/```(\w*)\n([\s\S]*?)```/);
          const lang = match ? match[1] : "";
          const code = match ? match[2] : part.slice(3, -3);
          
          return (
            <CodeBlock key={index} language={lang} code={code.trim()} />
          );
        } else {
          // Regular text content block
          return parseTextBlocks(part, index);
        }
      })}
    </div>
  );
}

function CodeBlock({ language, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4 border border-zinc-800 rounded-xl bg-zinc-900/60 overflow-hidden font-mono text-xs shadow-md">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/80 bg-zinc-900/90 text-zinc-400 text-[10px] font-semibold uppercase tracking-wider">
        <span>{language || "code"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-zinc-200 transition-colors cursor-pointer select-none"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-zinc-200 leading-normal select-text">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function parseTextBlocks(text, baseKey) {
  const lines = text.split("\n");
  const blocks = [];
  
  let currentTable = null;
  let currentList = null; // { type: 'ul' | 'ol', items: [] }
  let currentParagraph = [];

  const flushParagraph = (bIdx) => {
    if (currentParagraph.length > 0) {
      blocks.push(
        <p key={`p-${baseKey}-${bIdx}`} className="mb-4 text-zinc-300 leading-relaxed">
          {currentParagraph.map((line, lIdx) => (
            <React.Fragment key={lIdx}>
              {renderInlineElements(line)}
              {lIdx < currentParagraph.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      );
      currentParagraph = [];
    }
  };

  const flushTable = (bIdx) => {
    if (currentTable) {
      const tableLines = currentTable;
      currentTable = null;
      
      const hasSeparator = tableLines.length >= 2 && 
        tableLines[1].includes("|") && 
        /^[|\s:-]+$/.test(tableLines[1]) && 
        tableLines[1].includes("-");

      if (hasSeparator) {
        const cleanCells = (line) => {
          const trimmedLine = line.trim();
          const parts = trimmedLine.split("|");
          const startIdx = trimmedLine.startsWith("|") ? 1 : 0;
          const endIdx = trimmedLine.endsWith("|") ? parts.length - 1 : parts.length;
          return parts.slice(startIdx, endIdx).map(cell => cell.trim());
        };

        const headers = cleanCells(tableLines[0]);
        const rows = tableLines.slice(2)
          .filter(line => line.trim().startsWith("|") || line.includes("|"))
          .map(line => cleanCells(line));

        blocks.push(
          <div key={`table-${baseKey}-${bIdx}`} className="my-4 overflow-x-auto border border-zinc-900/60 rounded-xl bg-zinc-900/20 shadow-sm select-text custom-scrollbar">
            <table className="min-w-full divide-y divide-zinc-800 text-xs text-left">
              <thead className="bg-zinc-900/70 select-none">
                <tr>
                  {headers.map((h, i) => (
                    <th 
                      key={i} 
                      className="px-4 py-3 text-left font-semibold text-zinc-200 uppercase tracking-wider text-[10px]"
                    >
                      {renderInlineElements(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/40">
                {rows.map((row, rIdx) => (
                  <tr 
                    key={rIdx} 
                    className={rIdx % 2 === 0 ? "bg-transparent" : "bg-zinc-900/10"}
                  >
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-4 py-2.5 text-zinc-300">
                        {renderInlineElements(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      } else {
        // Fallback: render as regular paragraph lines
        blocks.push(
          <p key={`p-${baseKey}-${bIdx}`} className="mb-4 text-zinc-300 leading-relaxed">
            {tableLines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {renderInlineElements(line)}
                {lIdx < tableLines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      }
    }
  };

  const flushList = (bIdx) => {
    if (currentList) {
      const { type, items } = currentList;
      currentList = null;
      if (type === 'ul') {
        blocks.push(
          <ul key={`ul-${baseKey}-${bIdx}`} className="list-disc pl-5 space-y-1.5 my-3">
            {items.map((item, lIdx) => (
              <li key={lIdx} className="text-zinc-300 text-sm">
                {renderInlineElements(item)}
              </li>
            ))}
          </ul>
        );
      } else {
        blocks.push(
          <ol key={`ol-${baseKey}-${bIdx}`} className="list-decimal pl-5 space-y-1.5 my-3">
            {items.map((item, lIdx) => (
              <li key={lIdx} className="text-zinc-300 text-sm">
                {renderInlineElements(item)}
              </li>
            ))}
          </ol>
        );
      }
    }
  };

  const flushAll = (bIdx) => {
    flushParagraph(bIdx);
    flushTable(bIdx);
    flushList(bIdx);
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      flushAll(i);
      continue;
    }

    // Check for Horizontal Rules
    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      flushAll(i);
      blocks.push(
        <hr key={`hr-${baseKey}-${i}`} className="my-6 border-zinc-800" />
      );
      continue;
    }

    // Check for Headings
    if (trimmed.startsWith("# ")) {
      flushAll(i);
      blocks.push(
        <h1 key={`h1-${baseKey}-${i}`} className="text-xl font-bold text-zinc-100 mt-6 mb-3 tracking-tight">
          {renderInlineElements(trimmed.slice(2))}
        </h1>
      );
      continue;
    }
    if (trimmed.startsWith("## ")) {
      flushAll(i);
      blocks.push(
        <h2 key={`h2-${baseKey}-${i}`} className="text-lg font-semibold text-zinc-100 mt-5 mb-2.5 tracking-tight border-b border-zinc-900/40 pb-1.5">
          {renderInlineElements(trimmed.slice(3))}
        </h2>
      );
      continue;
    }
    if (trimmed.startsWith("### ")) {
      flushAll(i);
      blocks.push(
        <h3 key={`h3-${baseKey}-${i}`} className="text-base font-medium text-zinc-200 mt-4 mb-2 tracking-tight">
          {renderInlineElements(trimmed.slice(4))}
        </h3>
      );
      continue;
    }

    // Check for Table Row
    const looksLikeTableRow = trimmed.startsWith("|") || trimmed.includes("|");
    if (looksLikeTableRow) {
      flushParagraph(i);
      flushList(i);
      if (!currentTable) {
        currentTable = [];
      }
      currentTable.push(line);
      continue;
    }

    // Check for Unordered List Item
    if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      flushParagraph(i);
      flushTable(i);
      const content = trimmed.substring(2);
      if (!currentList || currentList.type !== 'ul') {
        flushList(i);
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(content);
      continue;
    }

    // Check for Ordered List Item
    const orderedMatch = trimmed.match(/^\d+\.\s(.*)/);
    if (orderedMatch) {
      flushParagraph(i);
      flushTable(i);
      const content = orderedMatch[1];
      if (!currentList || currentList.type !== 'ol') {
        flushList(i);
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(content);
      continue;
    }

    // Regular paragraph line
    flushTable(i);
    flushList(i);
    currentParagraph.push(line);
  }

  flushAll(lines.length);
  return blocks;
}

function renderInlineElements(text) {
  if (!text) return "";

  // Split by bold (**), inline code (`), and markdown links ([text](url))
  const parts = text.split(/(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-zinc-100">
          {part.slice(2, -2)}
        </strong>
      );
    } else if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={index} className="px-1.5 py-0.5 rounded bg-zinc-900 text-amber-200/90 font-mono text-[11px] border border-zinc-800/80">
          {part.slice(1, -1)}
        </code>
      );
    } else if (part.startsWith("[") && part.includes("](")) {
      const match = part.match(/\[(.*?)\]\((.*?)\)/);
      if (match) {
        return (
          <a
            key={index}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-200 hover:text-white underline decoration-zinc-700 hover:decoration-zinc-500 transition-colors"
          >
            {match[1]}
          </a>
        );
      }
    }
    return part;
  });
}
