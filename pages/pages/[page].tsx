import { InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import { ArticlePagination, ArticlePreview, articlesPerPage, totalPageCount } from '../../components/Article';
import { Layout } from '../../components/Layout';
import { getArticles } from '../../utils/article';
import { getBlogTitle } from '../../utils/blog';

type ArticlePageProps = InferGetStaticPropsType<typeof getStaticProps>;

export default function ArticlesPage({ articles, currentPage, totalPageCount }: ArticlePageProps) {
  return (
    <Layout>
      <Head>
        <title>{getBlogTitle()}</title>
      </Head>
      <div className="bg-white max-w-4xl mx-auto p-4 rounded-lg flex flex-col gap-8">
        {articles.map((article) => (
          <ArticlePreview article={article} key={article.slug} />
        ))}
        <ArticlePagination currentPage={currentPage} totalPageCount={totalPageCount} className="mt-8" />
      </div>
    </Layout>
  );
}

type Params = {
  page: string;
};

export async function getStaticPaths() {
  const articlesCount = (await getArticles()).length;
  const pages: { params: Params }[] = [...new Array(totalPageCount(articlesCount))].map((_, index) => ({
    params: { page: (index + 1).toString() },
  }));

  return {
    paths: pages,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: Params }) {
  const articles = await getArticles();

  return {
    props: {
      articles: articles.slice(articlesPerPage * (Number(params.page) - 1), articlesPerPage * Number(params.page)),
      currentPage: Number(params.page),
      totalPageCount: totalPageCount(articles.length),
    },
  };
}
