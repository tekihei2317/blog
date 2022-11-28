import { ComponentProps } from 'react';
import { InferGetStaticPropsType } from 'next';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { getArticleSlugs } from '../../utils/article';
import { getArticleBySlug } from '../../utils/article';
import { Layout } from '../../components/Layout';
import markdownStyle from '../../styles/article.module.css';
import { Tag } from '../../components/Tag';

type ArticlePageProps = InferGetStaticPropsType<typeof getStaticProps>;

type MarkdownProps = ComponentProps<typeof ReactMarkdown>;
type MarkdownComponents = MarkdownProps['components'];

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
        style={dracula}
        language={match[1]}
        PreTag="div"
        {...props}
      />
    );
  },
};

export default function ArticlePage({ article }: ArticlePageProps) {
  return (
    <Layout>
      <div className="bg-white max-w-4xl mx-auto p-4 rounded-lg">
        <h1 className="text-2xl font-bold">{article.title}</h1>
        <p className="text-sm mt-3">投稿日: {article.createdAt.toLocaleDateString()}</p>
        {article.tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {article.tags.map((tag) => (
              <Tag name={tag} />
            ))}
          </div>
        )}
        <ReactMarkdown className={`mt-4 ${markdownStyle.markdown}`} components={markdownComponents}>
          {article.content}
        </ReactMarkdown>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const slugs = getArticleSlugs();

  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
}

type Context = {
  params: {
    slug: string;
  };
};

export async function getStaticProps({ params }: Context) {
  const article = getArticleBySlug(params.slug);

  return {
    props: { article },
  };
}
