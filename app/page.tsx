import { getArticles } from '../utils/article';
import { ArticlePagination, ArticlePreview, articlesPerPage, totalPageCount } from '../components/Article';
import { getBlogTitle } from '../utils/blog';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: getBlogTitle(),
};

export default async function IndexPage() {
  const articles = (await getArticles()).slice(0, articlesPerPage);
  const pageCount = totalPageCount(articles.length);

  return (
    <div className="bg-white max-w-4xl mx-auto p-4 rounded-lg flex flex-col gap-8">
      {articles.map((article) => (
        <ArticlePreview article={article} key={article.slug} />
      ))}
      <ArticlePagination currentPage={1} totalPageCount={pageCount} className="mt-4" />
    </div>
  );
}
