import { Metadata } from 'next';
import Link from 'next/link';
import { getArticles, getArticleSlugs, ArticleWithExcerpt } from '../../../utils/article';
import { Tag } from '../../../components/Tag';
import { formatDate, getBlogTitle } from '../../../utils/blog';
import { Markdown } from '../../../components/Markdown';

function createOgDescription(article: ArticleWithExcerpt): string {
  const descriptionLength = 128;
  return article.excerpt.replace(/\n/g, '').substring(0, descriptionLength - 1) + '…';
}

export async function generateStaticParams() {
  const slugs = getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

async function getArticle(slug: string) {
  type IndexedArticle = [ArticleWithExcerpt, number];

  const articles: IndexedArticle[] = (await getArticles()).map((article, index) => [article, index]);
  const indexedArticle = articles.find(([article]) => article.slug === slug);

  if (!indexedArticle) {
    throw new Error(`No article found for slug: ${slug}`);
  }

  const previousArticle = articles.find(([_, index]) => index === indexedArticle[1] + 1);
  const nextArticle = articles.find(([_, index]) => index === indexedArticle[1] - 1);

  return {
    article: indexedArticle[0],
    previous: previousArticle?.[0],
    next: nextArticle?.[0],
  };
}

type PageProps = { params: { slug: string } };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { article } = await getArticle(params.slug);

  return {
    title: getBlogTitle(article.title),
    openGraph: {
      title: article.title,
      description: createOgDescription(article),
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { article, next, previous } = await getArticle(params.slug);

  return (
    <div className="bg-white max-w-4xl mx-auto p-4 rounded-lg">
      <h1 className="text-2xl font-bold">{article.title}</h1>
      <p className="text-sm mt-3">投稿日: {formatDate(article.createdAt)}</p>
      {article.tags.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1.5">
          {article.tags.map((tag) => (
            <Tag name={tag} key={tag} />
          ))}
        </div>
      )}
      <Markdown content={article.content} />
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
  );
}
