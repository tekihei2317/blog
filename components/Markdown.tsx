import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/base16/material.css';
import markdownStyle from '../styles/article.module.css';

export const Markdown = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      className={`mt-4 ${markdownStyle.markdown}`}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeHighlight]}
    >
      {content}
    </ReactMarkdown>
  );
};
