/* eslint-disable @next/next/next-script-for-ga */
// pages/_app.tsx
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // 페이지 이동 추적
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      window.gtag?.('config', 'G-RKR29X3BLE', {
        page_path: url,
      });
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router.events]);

  return (
    <>
      <Head>
        {/* 네이버 사이트 인증 */}
        <meta name="naver-site-verification" content="0fb0974edc03ecef50f9539be6f4c74ed2a1d9c3" />
        {/* Google Tag Manager */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-RKR29X3BLE" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-RKR29X3BLE');
            `,
          }}
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}