import Link from 'next/link';
import { Tag } from './Tag';
import { ArticleWithExcerpt as Article } from '../utils/article';
import { ComponentProps } from 'react';
import { formatDate } from '../utils/blog';

export const ArticlePreview = ({ article }: { article: Article }) => {
  return (
    <article>
      <Link href={`/articles/${article.slug}`}>
        <h2 className="text-xl font-bold hover:opacity-60 cursor-pointer">{article.title}</h2>
      </Link>
      <p className="mt-1 text-sm">{formatDate(article.createdAt)}</p>
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

export const articlesPerPage = 10;

export const totalPageCount = (articlesCount: number) => Math.ceil(articlesCount / articlesPerPage);

type PaginationProps = {
  currentPage: number;
  totalPageCount: number;
} & ComponentProps<'div'>;

export const ArticlePagination = ({ currentPage, totalPageCount, className, ...props }: PaginationProps) => {
  return (
    <div className={`flex justify-between ${className}`} {...props}>
      {currentPage >= 2 ? (
        <Link href={`/pages/${currentPage - 1}`} className="text-my-primary text-lg">
          Previous
        </Link>
      ) : (
        <div />
      )}
      <div className="text-lg">
        {currentPage} of {totalPageCount}
      </div>
      {currentPage < totalPageCount ? (
        <Link href={`/pages/${currentPage + 1}`} className="text-my-primary text-lg">
          Next
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
};
