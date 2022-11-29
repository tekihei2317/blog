import Link from 'next/link';

export const Tag = ({ name }: { name: string }) => {
  return (
    <Link
      href={`/tags/${name}`}
      className="bg-my-primary text-white text-sm px-1.5 py-0.5 rounded inline-block cursor-pointer"
    >
      {name}
    </Link>
  );
};
