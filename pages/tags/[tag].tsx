import { InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import { ArticlePreview } from '../../components/Article';
import { Layout } from '../../components/Layout';
import { getAllTags, getArticlesByTag } from '../../utils/article';
import { getBlogTitle } from '../../utils/blog';

type TagPageProps = InferGetStaticPropsType<typeof getStaticProps>;

export default function TagPage({ articles, tag }: TagPageProps) {
  return (
    <Layout>
      <Head>
        <title>{getBlogTitle(`${tag}の記事一覧`)}</title>
      </Head>
      <div className="bg-white max-w-4xl mx-auto p-4 rounded-lg flex flex-col gap-8">
        {articles.map((article) => (
          <ArticlePreview article={article} key={article.slug} />
        ))}
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const tags = await getAllTags();

  return {
    paths: tags.map((tag) => ({ params: { tag: tag.name } })),
    fallback: false,
  };
}

type Context = {
  params: {
    tag: string;
  };
};

export async function getStaticProps({ params }: Context) {
  const articles = await getArticlesByTag(params.tag);

  return {
    props: { articles, tag: params.tag },
  };
}
