import { Metadata } from 'next';
import { ArticlePreview } from '../../../components/Article';
import { getAllTags, getArticlesByTag } from '../../../utils/article';
import { getBlogTitle } from '../../../utils/blog';

type TagPageProps = { params: { tag: string } };

export function generateMetadata({ params }: TagPageProps): Metadata {
  return {
    title: getBlogTitle(`${params.tag}の記事一覧`),
  };
}

export async function generateStaticParams() {
  const tags = await getAllTags();

  return tags.map((tag) => ({ tag: tag.name }));
}

export default async function TagPage({ params }: TagPageProps) {
  const articles = await getArticlesByTag(decodeURIComponent(params.tag));

  return (
    <div className="bg-white max-w-4xl mx-auto p-4 rounded-lg flex flex-col gap-8">
      {articles.map((article) => (
        <ArticlePreview article={article} key={article.slug} />
      ))}
    </div>
  );
}
