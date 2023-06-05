import '../styles/global.css';
import type { AppProps } from 'next/app';
import { GoogleAnalytics, usePageView } from '../utils/google-analytics';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <GoogleAnalytics />
      <Component {...pageProps} />;
    </>
  );
}
