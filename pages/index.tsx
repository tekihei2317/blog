import { Layout } from '../components/Layout';
import { getArticles, Article } from '../utils/article';
import { InferGetStaticPropsType } from 'next';
import { useMemo } from 'react';

type ArticleWithExcerpt = Article & {
  excerpt: string;
};

const ArticlePreview = ({ article }: { article: ArticleWithExcerpt }) => {
  return (
    <article>
      <h2 className="text-xl font-bold hover:opacity-60">{article.title}</h2>
      <p className="mt-1 text-sm">{article.createdAt.toLocaleDateString()}</p>
      <div className="my-4">{article.excerpt}</div>
      <a className="border-b border-my-black hover:opacity-60">全文を読む→</a>
    </article>
  );
};

type IndexPageProps = InferGetStaticPropsType<typeof getStaticProps>;

const addExcerpt = (articles: Article[]): ArticleWithExcerpt[] => {
  return articles.map((article) => {
    const excerpt = article.content.slice(0, 256);
    return { ...article, excerpt };
  });
};

export default function IndexPage({ articles: parsedArticles }: IndexPageProps) {
  const articles = useMemo<ArticleWithExcerpt[]>(() => addExcerpt(parsedArticles), [parsedArticles]);

  return (
    <Layout>
      <div className="bg-white max-w-4xl mx-auto p-4 rounded-lg flex flex-col gap-8">
        {articles.map((article) => (
          <ArticlePreview article={article} key={article.title} />
        ))}
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const articles = getArticles();

  return {
    props: { articles },
  };
}
