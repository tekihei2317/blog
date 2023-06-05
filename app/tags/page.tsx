import { Metadata } from 'next';
import Link from 'next/link';
import { getAllTags, Tag } from '../../utils/article';
import { getBlogTitle } from '../../utils/blog';

export const metadata: Metadata = {
  title: getBlogTitle('タグ一覧'),
};

function tagToString(tag: Tag): string {
  return `${tag.name} (${tag.count})`;
}

const ArticleTag = ({ tag }: { tag: Tag }) => {
  return (
    <Link className="bg-my-primary text-white px-2 py-0.5 rounded inline-block" href={`/tags/${tag.name}`}>
      {tagToString(tag)}
    </Link>
  );
};

export default async function TagsPage() {
  const tags = await getAllTags();

  return (
    <div className="bg-white max-w-4xl mx-auto p-4 rounded-lg">
      <h1 className="text-2xl font-bold">Tags</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <ArticleTag tag={tag} key={tag.name} />
        ))}
      </div>
    </div>
  );
}
