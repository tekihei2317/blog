import Link from 'next/link';
import { Layout } from '../components/Layout';
import { getArticles } from '../utils/article';
import { InferGetStaticPropsType } from 'next';

const ArticlePreview = ({ article }: { article: Article }) => {
  return (
    <article>
      <h2 className="text-xl font-bold hover:opacity-60">{article.title}</h2>
      <p className="mt-1 text-sm">{article.createdAt.toLocaleDateString()}</p>
      <div className="my-4 overflow-hidden" style={{ height: '72px' }}>
        {article.excerpt}
      </div>
      <Link className="border-b border-my-black hover:opacity-60 cursor-pointer" href={`/articles/${article.slug}`}>
        全文を読む→
      </Link>
    </article>
  );
};

type IndexPageProps = InferGetStaticPropsType<typeof getStaticProps>;

type Article = IndexPageProps['articles'][number];

export default function IndexPage({ articles }: IndexPageProps) {
  return (
    <Layout>
      <div className="bg-white max-w-4xl mx-auto p-4 rounded-lg flex flex-col gap-8">
        {articles.map((article) => (
          <ArticlePreview article={article} key={article.title} />
        ))}
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const articles = await getArticles();

  return {
    props: { articles },
  };
}
