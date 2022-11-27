import { InferGetStaticPropsType } from 'next';
import ReactMarkdown from 'react-markdown';
import { getArticleSlugs } from '../../utils/article';
import { getArticleBySlug, Article } from '../../utils/article';
import { Layout } from '../../components/Layout';
import markdownStyle from '../../styles/article.module.css';

type ArticlePageProps = InferGetStaticPropsType<typeof getStaticProps>;

export default function ArticlePage({ article }: ArticlePageProps) {
  return (
    <Layout>
      <div className="bg-white max-w-4xl mx-auto p-4 rounded-lg">
        <h1 className="text-2xl font-bold">{article.title}</h1>
        <p className="text-sm mt-3">投稿日: {article.createdAt.toLocaleDateString()}</p>
        <ReactMarkdown className={`mt-4 ${markdownStyle.markdown}`}>{article.content}</ReactMarkdown>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const slugs = getArticleSlugs();

  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
}

type Context = {
  params: {
    slug: string;
  };
};

export async function getStaticProps({ params }: Context) {
  const article = getArticleBySlug(params.slug);

  return {
    props: { article },
  };
}
