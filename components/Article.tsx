import Link from 'next/link';
import { Tag } from './Tag';
import { ArticleWithExcerpt as Article } from '../utils/article';

export const ArticlePreview = ({ article }: { article: Article }) => {
  return (
    <article>
      <Link href={`/articles/${article.slug}`}>
        <h2 className="text-xl font-bold hover:opacity-60 cursor-pointer">{article.title}</h2>
      </Link>
      <p className="mt-1 text-sm">{article.createdAt.toLocaleDateString()}</p>
      {article.tags.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1.5">
          {article.tags.map((tag) => (
            <Tag name={tag} key={tag} />
          ))}
        </div>
      )}
      <div className="my-4 overflow-hidden" style={{ height: '72px' }}>
        {article.excerpt}
      </div>
      <Link className="border-b border-my-black hover:opacity-60 cursor-pointer" href={`/articles/${article.slug}`}>
        全文を読む→
      </Link>
    </article>
  );
};
