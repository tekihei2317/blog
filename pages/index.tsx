import { Layout } from '../components/Layout';

type Article = {
  title: string;
  createdAt: string;
  excerpt: string;
};

const dummyArticle: Article = {
  title: 'Prisma Clientを使ってみた感想',
  createdAt: '2022-10-29',
  excerpt:
    'Prismaとは Prismaは、Node.jsとTypeScriptのためのデータベースの周辺ツールです。具体的には、データベースクライアントのPrisma Client、データベースのマイグレーションを行うPrisma Migrateなどがあります。この2つは、どちらもPrisma schemaという独自のスキーマファイルを用います。 Prisma',
};

const articles: Article[] = [dummyArticle, dummyArticle, dummyArticle];

const ArticlePreview = ({ article }: { article: Article }) => {
  return (
    <article>
      <h2 className="text-xl font-bold hover:opacity-60">{article.title}</h2>
      <p className="mt-1 text-sm">{article.createdAt}</p>
      <div className="my-4">{article.excerpt}</div>
      <a className="border-b border-my-black hover:opacity-60">全文を読む→</a>
    </article>
  );
};

export default function IndexPage() {
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
