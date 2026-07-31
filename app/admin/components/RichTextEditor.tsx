"use client";

import {
  useRef, useState, forwardRef, useImperativeHandle, useCallback,
} from "react";
import {
  Bold, Italic, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Minus, Image as ImageIcon,
  Eye, EyeOff, Link2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RichTextEditorHandle {
  insertText: (text: string) => void;
}

interface Props {
  value: string;
  onChange: (v: string) => void;
  onImageInsert?: () => void;
  placeholder?: string;
  rows?: number;
  error?: string;
}

// ─── Inline markdown → React nodes ───────────────────────────────────────────

function renderInline(text: string): React.ReactNode[] {
  const pattern = /(\*\*[^*]+\*\*|__[^_]+__|_[^_]+_|\*[^*]+\*|!\[[^\]]*\]\([^)]+\)|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(pattern);
  return parts.map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part) || /^__[^_]+__$/.test(part)) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (/^_[^_]+_$/.test(part) || /^\*[^*]+\*$/.test(part)) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    const img = part.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (img) {
      return (
        <img key={i} src={img[2]} alt={img[1]}
          className="my-3 max-w-full rounded-lg block" />
      );
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return <a key={i} href={link[2]} className="text-red-600 underline">{link[1]}</a>;
    }
    return part;
  });
}

function MarkdownPreview({ content }: { content: string }) {
  if (!content.trim()) {
    return <p className="text-gray-400 italic">Nothing to preview yet.</p>;
  }

  const blocks = content.split(/\n{2,}/);
  return (
    <div className="prose-like space-y-4 text-gray-800 text-sm leading-relaxed">
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        if (trimmed === "---" || trimmed === "***") {
          return <hr key={i} className="border-gray-300 my-4" />;
        }
        if (trimmed.startsWith("# ")) {
          return <h1 key={i} className="text-2xl font-bold text-gray-900">{renderInline(trimmed.slice(2))}</h1>;
        }
        if (trimmed.startsWith("## ")) {
          return <h2 key={i} className="text-xl font-bold text-gray-900">{renderInline(trimmed.slice(3))}</h2>;
        }
        if (trimmed.startsWith("### ")) {
          return <h3 key={i} className="text-lg font-semibold text-gray-900">{renderInline(trimmed.slice(4))}</h3>;
        }
        if (trimmed.startsWith("> ")) {
          return (
            <blockquote key={i} className="border-l-4 border-red-400 pl-4 italic text-gray-600">
              {renderInline(trimmed.slice(2))}
            </blockquote>
          );
        }
        // Bullet list block
        const bulletLines = trimmed.split("\n").filter((l) => /^[-*] /.test(l.trim()));
        if (bulletLines.length === trimmed.split("\n").filter(Boolean).length && bulletLines.length > 0) {
          return (
            <ul key={i} className="list-disc list-inside space-y-1">
              {trimmed.split("\n").map((line, j) => (
                line.trim() && <li key={j}>{renderInline(line.replace(/^[-*] /, ""))}</li>
              ))}
            </ul>
          );
        }
        // Numbered list block
        const numberedLines = trimmed.split("\n").filter((l) => /^\d+\. /.test(l.trim()));
        if (numberedLines.length === trimmed.split("\n").filter(Boolean).length && numberedLines.length > 0) {
          return (
            <ol key={i} className="list-decimal list-inside space-y-1">
              {trimmed.split("\n").map((line, j) => (
                line.trim() && <li key={j}>{renderInline(line.replace(/^\d+\. /, ""))}</li>
              ))}
            </ol>
          );
        }
        return <p key={i}>{renderInline(trimmed)}</p>;
      })}
    </div>
  );
}

// ─── Toolbar button ───────────────────────────────────────────────────────────

function ToolBtn({
  icon: Icon,
  label,
  onClick,
  active,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className={`p-1.5 rounded transition-colors ${
        active
          ? "bg-gray-200 text-gray-900"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
      }`}
    >
      <Icon size={15} />
    </button>
  );
}

// ─── Main editor ─────────────────────────────────────────────────────────────

const RichTextEditor = forwardRef<RichTextEditorHandle, Props>(function RichTextEditor(
  { value, onChange, onImageInsert, placeholder, rows = 18, error },
  ref
) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);

  // Expose insertText for parent (media picker → inline image)
  useImperativeHandle(ref, () => ({
    insertText(text: string) {
      const ta = taRef.current;
      if (!ta) return;
      const start = ta.selectionStart ?? value.length;
      const end   = ta.selectionEnd   ?? value.length;
      const next  = value.slice(0, start) + text + value.slice(end);
      onChange(next);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + text.length;
        ta.focus();
      });
    },
  }));

  // Core editing helpers
  const wrap = useCallback((prefix: string, suffix: string, placeholder: string) => {
    const ta = taRef.current;
    if (!ta) return;
    const start  = ta.selectionStart;
    const end    = ta.selectionEnd;
    const sel    = value.slice(start, end) || placeholder;
    const next   = value.slice(0, start) + prefix + sel + suffix + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      ta.selectionStart = start + prefix.length;
      ta.selectionEnd   = start + prefix.length + sel.length;
      ta.focus();
    });
  }, [value, onChange]);

  const prefixLines = useCallback((prefix: string, placeholder: string) => {
    const ta = taRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end   = ta.selectionEnd;

    // Find the line boundaries for the selection
    const before     = value.slice(0, start);
    const lineStart  = before.lastIndexOf("\n") + 1;
    const after      = value.slice(end);
    const lineEnd    = after.indexOf("\n");
    const selEnd     = lineEnd === -1 ? value.length : end + lineEnd;

    const selected   = value.slice(lineStart, selEnd) || placeholder;
    const lines      = selected.split("\n").map((l) => (l.trim() ? prefix + l : l));
    const replaced   = lines.join("\n");
    const next       = value.slice(0, lineStart) + replaced + value.slice(selEnd);
    onChange(next);
    requestAnimationFrame(() => {
      ta.selectionStart = lineStart;
      ta.selectionEnd   = lineStart + replaced.length;
      ta.focus();
    });
  }, [value, onChange]);

  const insertBlock = useCallback((text: string) => {
    const ta = taRef.current;
    if (!ta) return;
    const pos  = ta.selectionStart ?? value.length;
    const pad  = pos === 0 || value[pos - 1] === "\n" ? "" : "\n";
    const next = value.slice(0, pos) + pad + text + "\n" + value.slice(pos);
    onChange(next);
    requestAnimationFrame(() => {
      ta.selectionStart = ta.selectionEnd = pos + pad.length + text.length + 1;
      ta.focus();
    });
  }, [value, onChange]);

  const handleLinkInsert = useCallback(() => {
    const ta = taRef.current;
    if (!ta) return;
    const sel = value.slice(ta.selectionStart, ta.selectionEnd);
    const url = window.prompt("Enter URL:", "https://");
    if (!url) return;
    const text = sel || "Link text";
    const md   = `[${text}](${url})`;
    const next = value.slice(0, ta.selectionStart) + md + value.slice(ta.selectionEnd);
    onChange(next);
  }, [value, onChange]);

  return (
    <div className={`border rounded-lg overflow-hidden ${error ? "border-red-400" : "border-gray-300"}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-200">
        <ToolBtn icon={Bold}      label="Bold (Ctrl+B)"       onClick={() => wrap("**", "**", "Bold text")} />
        <ToolBtn icon={Italic}    label="Italic (Ctrl+I)"     onClick={() => wrap("_", "_", "Italic text")} />
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <ToolBtn icon={Heading1}  label="Heading 1"           onClick={() => prefixLines("# ", "Heading")} />
        <ToolBtn icon={Heading2}  label="Heading 2"           onClick={() => prefixLines("## ", "Heading")} />
        <ToolBtn icon={Heading3}  label="Heading 3"           onClick={() => prefixLines("### ", "Heading")} />
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <ToolBtn icon={Quote}     label="Blockquote"          onClick={() => prefixLines("> ", "Quote text")} />
        <ToolBtn icon={List}      label="Bullet list"         onClick={() => prefixLines("- ", "List item")} />
        <ToolBtn icon={ListOrdered} label="Numbered list"     onClick={() => prefixLines("1. ", "List item")} />
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <ToolBtn icon={Minus}     label="Horizontal divider"  onClick={() => insertBlock("---")} />
        <ToolBtn icon={Link2}     label="Insert link"         onClick={handleLinkInsert} />
        {onImageInsert && (
          <ToolBtn icon={ImageIcon} label="Insert image from uploads" onClick={onImageInsert} />
        )}
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => setPreview((v) => !v)}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
            preview
              ? "bg-red-50 text-red-600 border border-red-200"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          {preview ? <EyeOff size={13} /> : <Eye size={13} />}
          {preview ? "Back to edit" : "Preview"}
        </button>
      </div>

      {/* Write / Preview pane */}
      {preview ? (
        <div className="min-h-[18rem] p-4 bg-white overflow-auto">
          <MarkdownPreview content={value} />
        </div>
      ) : (
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "Start writing your article…\n\nTip: Use the toolbar above for formatting, or type # for headings, **text** for bold, _text_ for italics."}
          rows={rows}
          className="w-full px-3 py-2.5 text-sm font-mono text-gray-800 bg-white focus:outline-none resize-y leading-relaxed"
        />
      )}

      {error && (
        <p className="px-3 py-1 text-xs text-red-500 border-t border-red-200 bg-red-50">{error}</p>
      )}
    </div>
  );
});

export default RichTextEditor;
