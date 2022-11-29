import Link from 'next/link';
import { InferGetStaticPropsType } from 'next';
import { Layout } from '../../components/Layout';
import { getAllTags } from '../../utils/article';
import Head from 'next/head';
import { getBlogTitle } from '../../utils/blog';

type TagsPageProps = InferGetStaticPropsType<typeof getStaticProps>;
type Tag = TagsPageProps['tags'][number];

function tagToString(tag: Tag): string {
  return `${tag.name} (${tag.count})`;
}

const Tag = ({ tag }: { tag: Tag }) => {
  return (
    <Link className="bg-my-primary text-white px-2 py-0.5 rounded inline-block" href={`/tags/${tag.name}`}>
      {tagToString(tag)}
    </Link>
  );
};

export default function TagsPage({ tags }: TagsPageProps) {
  return (
    <Layout>
      <Head>
        <title>{getBlogTitle('タグ一覧')}</title>
      </Head>
      <div className="bg-white max-w-4xl mx-auto p-4 rounded-lg">
        <h1 className="text-2xl font-bold">Tags</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Tag tag={tag} key={tag.name} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const tags = await getAllTags();

  return {
    props: { tags },
  };
}
