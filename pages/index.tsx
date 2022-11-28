import { Layout } from '../components/Layout';
import { getArticles, ArticleWithExcerpt as Article } from '../utils/article';
import { InferGetStaticPropsType } from 'next';
import { ArticlePagination, ArticlePreview, articlesPerPage, totalPageCount } from '../components/Article';

type IndexPageProps = InferGetStaticPropsType<typeof getStaticProps>;

export default function IndexPage({ articles, totalPageCount }: IndexPageProps) {
  return (
    <Layout>
      <div className="bg-white max-w-4xl mx-auto p-4 rounded-lg flex flex-col gap-8">
        {articles.map((article) => (
          <ArticlePreview article={article} key={article.slug} />
        ))}
        <ArticlePagination currentPage={1} totalPageCount={totalPageCount} className="mt-4" />
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const articles = await getArticles();

  return {
    props: {
      articles: articles.slice(0, articlesPerPage),
      totalPageCount: totalPageCount(articles.length),
    },
  };
}
