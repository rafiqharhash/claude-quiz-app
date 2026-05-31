import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          p: ({ node, ...props }) => <span {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
