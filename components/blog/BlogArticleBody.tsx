import React from "react";
import Image from "next/image";

interface BlogArticleBodyProps {
  content: string;
  className?: string;
}

/**
 * Safe, zero-dependency Markdown parser designed for WELTRIQ editorial content.
 * Parses headings, blockquotes, lists, links, images, bold, and italic safely.
 */
export function BlogArticleBody({ content, className = "" }: BlogArticleBodyProps) {
  const blocks = parseMarkdownBlocks(content);

  return (
    <article className={`space-y-6 font-sans text-brand-navy/85 leading-relaxed text-base sm:text-lg ${className}`}>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "h2":
            return (
              <h2
                key={idx}
                className="text-2xl sm:text-3xl md:text-4xl font-display uppercase text-brand-navy pt-6 pb-2 tracking-wide border-b border-brand-navy/10 leading-tight"
              >
                {renderInline(block.text)}
              </h2>
            );
          case "h3":
            return (
              <h3
                key={idx}
                className="text-xl sm:text-2xl font-display uppercase text-brand-navy pt-4 pb-1 tracking-wide leading-snug"
              >
                {renderInline(block.text)}
              </h3>
            );
          case "h4":
            return (
              <h4
                key={idx}
                className="text-lg sm:text-xl font-display uppercase text-brand-navy pt-2 tracking-wide"
              >
                {renderInline(block.text)}
              </h4>
            );
          case "blockquote":
            return (
              <blockquote
                key={idx}
                className="border-l-4 border-brand-yellow pl-5 py-3 my-6 italic text-brand-navy/90 bg-brand-island-spice/60 rounded-r-lg font-sans"
              >
                {renderInline(block.text)}
              </blockquote>
            );
          case "ul":
            return (
              <ul key={idx} className="space-y-2.5 my-4 pl-2 list-none">
                {block.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-brand-yellow mt-2.5 shrink-0" aria-hidden="true" />
                    <span>{renderInline(item)}</span>
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={idx} className="space-y-2.5 my-4 pl-2 list-none">
                {block.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-3">
                    <span className="text-xs font-display font-bold text-brand-yellow bg-brand-navy/5 px-2 py-0.5 rounded shrink-0 mt-1">
                      {String(itemIdx + 1).padStart(2, "0")}
                    </span>
                    <span>{renderInline(item)}</span>
                  </li>
                ))}
              </ol>
            );
          case "image":
            return (
              <figure key={idx} className="my-8 rounded-xl overflow-hidden border border-brand-navy/10 bg-brand-white shadow-xs">
                <div className="relative aspect-video w-full bg-neutral-100">
                  <Image
                    src={block.src}
                    alt={block.alt || "Article diagram"}
                    fill
                    className="object-cover"
                  />
                </div>
                {block.alt && (
                  <figcaption className="text-center text-xs text-brand-navy/60 p-3 italic bg-brand-island-spice/40 border-t border-brand-navy/5">
                    {block.alt}
                  </figcaption>
                )}
              </figure>
            );
          case "p":
          default:
            return (
              <p key={idx} className="leading-relaxed">
                {renderInline(block.text)}
              </p>
            );
        }
      })}
    </article>
  );
}

/* =========================================================================
   MARKDOWN PARSING UTILITIES
   ========================================================================= */

type Block =
  | { type: "h2" | "h3" | "h4" | "p" | "blockquote"; text: string }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "image"; src: string; alt: string };

function parseMarkdownBlocks(raw: string): Block[] {
  const lines = raw.split(/\r?\n/);
  const blocks: Block[] = [];
  let currentParagraph: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(" ").trim();
      if (text) {
        blocks.push({ type: "p", text });
      }
      currentParagraph = [];
    }
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      i++;
      continue;
    }

    // Heading 2 (## )
    if (trimmed.startsWith("## ")) {
      flushParagraph();
      blocks.push({ type: "h2", text: trimmed.slice(3).trim() });
      i++;
      continue;
    }

    // Heading 3 (### )
    if (trimmed.startsWith("### ")) {
      flushParagraph();
      blocks.push({ type: "h3", text: trimmed.slice(4).trim() });
      i++;
      continue;
    }

    // Heading 4 (#### )
    if (trimmed.startsWith("#### ")) {
      flushParagraph();
      blocks.push({ type: "h4", text: trimmed.slice(5).trim() });
      i++;
      continue;
    }

    // Image ![alt](src)
    const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      flushParagraph();
      blocks.push({ type: "image", alt: imgMatch[1], src: imgMatch[2] });
      i++;
      continue;
    }

    // Blockquote (> )
    if (trimmed.startsWith("> ")) {
      flushParagraph();
      const quoteLines: string[] = [trimmed.slice(2).trim()];
      while (i + 1 < lines.length && lines[i + 1].trim().startsWith("> ")) {
        i++;
        quoteLines.push(lines[i].trim().slice(2).trim());
      }
      blocks.push({ type: "blockquote", text: quoteLines.join(" ") });
      i++;
      continue;
    }

    // Bullet List (- or *)
    if (/^[-*]\s+/.test(trimmed)) {
      flushParagraph();
      const items: string[] = [trimmed.replace(/^[-*]\s+/, "").trim()];
      while (i + 1 < lines.length && /^[-*]\s+/.test(lines[i + 1].trim())) {
        i++;
        items.push(lines[i].trim().replace(/^[-*]\s+/, "").trim());
      }
      blocks.push({ type: "ul", items });
      i++;
      continue;
    }

    // Numbered List (1. )
    if (/^\d+\.\s+/.test(trimmed)) {
      flushParagraph();
      const items: string[] = [trimmed.replace(/^\d+\.\s+/, "").trim()];
      while (i + 1 < lines.length && /^\d+\.\s+/.test(lines[i + 1].trim())) {
        i++;
        items.push(lines[i].trim().replace(/^\d+\.\s+/, "").trim());
      }
      blocks.push({ type: "ol", items });
      i++;
      continue;
    }

    // Default: accumulate lines for paragraph
    currentParagraph.push(trimmed);
    i++;
  }

  flushParagraph();
  return blocks;
}

/**
 * Parses inline elements: **bold**, *italic*, and [links](url).
 */
function renderInline(text: string): React.ReactNode {
  // Regex to tokenize bold, italic, and links
  const regex = /(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    // Bold
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong key={index} className="font-bold text-brand-navy">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Italic
    if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }

    // Link [label](href)
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const isExternal = linkMatch[2].startsWith("http");
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-brand-navy underline underline-offset-4 hover:text-brand-yellow font-medium transition-colors"
        >
          {linkMatch[1]}
        </a>
      );
    }

    return part;
  });
}
