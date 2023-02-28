import { Layout } from '../components/Layout';
import Image from 'next/image';
import Link from 'next/link';
import { IconContext } from 'react-icons';
import { FaGithub, FaTwitter } from 'react-icons/fa';
import Head from 'next/head';
import { getBlogTitle } from '../utils/blog';

export default function AboutPage() {
  return (
    <Layout>
      <Head>
        <title>{getBlogTitle('About')}</title>
      </Head>
      <div className="bg-white max-w-4xl mx-auto p-4 rounded-lg">
        <h1 className="text-2xl font-bold">About</h1>
        <div className="mt-8 flex gap-8">
          <div>
            <Image src="/profile.png" alt="profile" width="160" height="160" />
            <div className="text-center mt-2 font-bold text-lg">tekihei2317</div>
          </div>
          <div>
            <p className="text-lg">ソフトウェアエンジニアをしているひと。</p>
            <p className="text-lg mt-2">文章とコードを書くのが好き。</p>
            <p className="text-lg mt-2">最近は早寝早起きできるように習慣を作り直している。</p>
            <div className="mt-4 flex gap-4">
              <IconContext.Provider value={{ size: '26px' }}>
                <Link href="https://twitter.com/tekihei2317_">
                  <FaTwitter />
                </Link>
                <Link href="https://github.com/tekihei2317">
                  <FaGithub />
                </Link>
              </IconContext.Provider>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
