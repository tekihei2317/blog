import { ArticlePagination, ArticlePreview, articlesPerPage, totalPageCount } from '../../../components/Article';
import { getArticles } from '../../../utils/article';

type Params = {
  page: string;
};

export async function generateStaticParams(): Promise<Params[]> {
  const articlesCount = (await getArticles()).length;

  return [...new Array(totalPageCount(articlesCount))].map((_, index) => ({
    page: (index + 1).toString(),
  }));
}

export default async function ArticlesPage({ params }: { params: Params }) {
  const allArticles = await getArticles();
  const articles = allArticles.slice(
    articlesPerPage * (Number(params.page) - 1),
    articlesPerPage * Number(params.page)
  );
  const currentPage = Number(params.page);
  const pageCount = totalPageCount(allArticles.length);

  return (
    <div className="bg-white max-w-4xl mx-auto p-4 rounded-lg flex flex-col gap-8">
      {articles.map((article) => (
        <ArticlePreview article={article} key={article.slug} />
      ))}
      <ArticlePagination currentPage={currentPage} totalPageCount={pageCount} className="mt-8" />
    </div>
  );
}
