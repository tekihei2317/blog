import { ComponentProps } from 'react';
import { InferGetStaticPropsType } from 'next';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { getArticles, getArticleSlugs, ArticleWithExcerpt } from '../../utils/article';
import { Layout } from '../../components/Layout';
import markdownStyle from '../../styles/article.module.css';
import { Tag } from '../../components/Tag';
import Head from 'next/head';
import { getBlogTitle } from '../../utils/blog';
import Link from 'next/link';

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
        // @ts-ignore FIXME:
        style={dracula}
        language={match[1]}
        PreTag="div"
        {...props}
      />
    );
  },
};

export default function ArticlePage({ article, next, previous }: ArticlePageProps) {
  return (
    <Layout>
      <Head>
        <title>{getBlogTitle(article.title)}</title>
      </Head>
      <div className="bg-white max-w-4xl mx-auto p-4 rounded-lg">
        <h1 className="text-2xl font-bold">{article.title}</h1>
        <p className="text-sm mt-3">投稿日: {article.createdAt.toLocaleDateString()}</p>
        {article.tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {article.tags.map((tag) => (
              <Tag name={tag} key={tag} />
            ))}
          </div>
        )}
        <ReactMarkdown className={`mt-4 ${markdownStyle.markdown}`} components={markdownComponents}>
          {article.content}
        </ReactMarkdown>
        <div className="mt-12 flex flex-col gap-4 md:flex-row md:justify-between">
          {next ? (
            <div>
              <div className="text-sm">次の記事</div>
              <Link href={`/articles/${next.slug}`} className="max-w-sm text-my-primary">
                {next.title}
              </Link>
            </div>
          ) : (
            <div />
          )}
          {previous ? (
            <div>
              <div className="text-sm">前の記事</div>
              <Link href={`/articles/${previous.slug}`} className="max-w-sm text-my-primary">
                {previous.title}
              </Link>
            </div>
          ) : (
            <div />
          )}
        </div>
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
  type IndexedArticle = [ArticleWithExcerpt, number];

  const articles: IndexedArticle[] = (await getArticles()).map((article, index) => [article, index]);
  const indexedArticle = articles.find(([article]) => article.slug === params.slug);

  if (!indexedArticle) {
    throw new Error(`No article found for slug: ${params.slug}`);
  }

  const previousArticle = articles.find(([_, index]) => index === indexedArticle[1] + 1);
  const nextArticle = articles.find(([_, index]) => index === indexedArticle[1] - 1);

  return {
    props: {
      article: indexedArticle[0],
      previous: previousArticle?.[0],
      next: nextArticle?.[0],
    },
  };
}
