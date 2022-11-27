import fs from 'fs';
import matter from 'gray-matter';
import { remark } from 'remark';
import strip from 'strip-markdown';

export type Article = {
  slug: string;
  content: string;
  title: string;
  createdAt: Date;
};

type ArticleWithExcerpt = Article & {
  excerpt: string;
};

type FrontMatter = {
  title: string;
  createdAt: Date;
};

const articlesDir = 'articles';
const articleDir = (articleFileName: string): string => `${articlesDir}/${articleFileName}`;

async function stripMarkdown(markdownString: string): Promise<string> {
  const vfile = await remark().use(strip).process(markdownString);
  return String(vfile);
}

async function addExcerptToArticle(article: Article): Promise<ArticleWithExcerpt> {
  const excerpt = (await stripMarkdown(article.content)).slice(0, 256);
  return { ...article, excerpt };
}

async function addExcerpt(articles: Article[]): Promise<ArticleWithExcerpt[]> {
  return Promise.all(articles.map((article) => addExcerptToArticle(article)));
}

function parseFrontMatter(data: Record<string, any>): FrontMatter {
  if (typeof data.title !== 'string') throw new Error('タイトルが文字列ではありません');
  if (!(data.createdAt instanceof Date)) throw new Error('作成日が日付ではありません');

  return {
    title: data.title,
    createdAt: data.createdAt,
  };
}

export async function getArticles(): Promise<ArticleWithExcerpt[]> {
  const articles = fs.readdirSync(articlesDir).map((fileName) => {
    const fileContent = fs.readFileSync(articleDir(fileName), 'utf-8');
    const matterData = matter(fileContent);
    const frontMatter = parseFrontMatter(matterData.data);

    return {
      slug: removeExtension(fileName),
      content: matterData.content,
      title: frontMatter.title,
      createdAt: frontMatter.createdAt,
    };
  });

  articles.sort(({ createdAt: a }, { createdAt: b }) => {
    if (a < b) return 1;
    else if (a == b) return 0;
    else return -1;
  });

  return addExcerpt(articles);
}

function removeExtension(fileName: string): string {
  return fileName.replace(/\.md$/, '');
}

export function getArticleSlugs(): string[] {
  return fs.readdirSync(articlesDir).map(removeExtension);
}

export function getArticleBySlug(slug: string): Article {
  const article = fs.readFileSync(articleDir(`${slug}.md`));
  const matterData = matter(article);
  const frontMatter = parseFrontMatter(matterData.data);

  return {
    slug,
    content: matterData.content,
    ...frontMatter,
  };
}
