// 参考: https://panda-program.com/posts/nextjs-google-analytics
'use client';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';
const existsGaId = GA_MEASUREMENT_ID !== '';

export const countPageView = (path: string) => {
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
  });
};

export const usePageView = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (!existsGaId || pathname === null) {
      return;
    }
    countPageView(pathname);
  }, [pathname]);
};

export const GoogleAnalytics = () => {
  usePageView();
  if (!existsGaId) return null;

  return (
    <>
      <Script
        defer
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script
        defer
        dangerouslySetInnerHTML={{
          __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `,
        }}
        strategy="afterInteractive"
      />
    </>
  );
};
