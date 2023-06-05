import Image from 'next/image';
import Link from 'next/link';
import { FaGithub, FaTwitter } from 'react-icons/fa';
import { getBlogTitle } from '../../utils/blog';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: getBlogTitle('About'),
};

export default function AboutPage() {
  return (
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
            <Link href="https://twitter.com/tekihei2317_">
              <FaTwitter size="26px" />
            </Link>
            <Link href="https://github.com/tekihei2317">
              <FaGithub size="26px" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
