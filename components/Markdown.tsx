'use client';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { ComponentProps } from 'react';
type MarkdownProps = ComponentProps<typeof ReactMarkdown>;
type MarkdownComponents = MarkdownProps['components'];
import markdownStyle from '../styles/article.module.css';

/**
 * React Markdownの設定を上書きする
 */
const markdownComponents: MarkdownComponents = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');

    if (inline || !match) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
    return (
      <SyntaxHighlighter
        children={String(children).replace(/\n$/, '')}
        // @ts-ignore FIXME:
        style={dracula}
        language={match[1]}
        PreTag="div"
        {...props}
      />
    );
  },
};

export const Markdown = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      className={`mt-4 ${markdownStyle.markdown}`}
      components={markdownComponents}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
    >
      {content}
    </ReactMarkdown>
  );
};
