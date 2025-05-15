// pages/share/[uuid].tsx
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';

export const runtime = 'experimental-edge'; // Edge Runtime 사용

interface Data {
  name: string;
  fortune_date: string;
  message: string;
  action_tip: string;
}

interface Meta {
  title: string;
  description: string;
  image: string;
  url: string;
}

interface Props {
  meta: Meta;
}

// 1) getStaticPaths: 모든 경로를 미리 생성하지 않고, 요청 시 blocking fallback 처리
export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: 'blocking',
});

// 2) ISR: 60초마다 페이지를 백그라운드에서 재생성
export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const uuid = params?.uuid as string;
  if (!uuid) {
    return { notFound: true };
  }

  // 백엔드에서 공유용 운세 데이터 fetch (ISR 캐시 60초)
  const res = await fetch(
    `${process.env.API_BASE_URL}/share/${uuid}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) {
    return { notFound: true };
  }
  const data: Data = await res.json();

  // OG 메타 생성
  const d = new Date(data.fortune_date);
  const mm = d.getMonth() + 1;
  const dd = d.getDate();
  const nameOnly = data.name.length > 1 ? data.name.slice(1) : data.name;
  const title = `${nameOnly}님의 ${mm}월 ${dd}일 운세 🥠`;
  const firstSentence = data.message.split('. ')[0] + '.';
  const description = firstSentence;

  // site origin 은 고정값으로
  const origin = 'https://luckstargram.com';
  const image = `${origin}/logo.webp`;
  const url = `${origin}/share/${uuid}`;

  return {
    props: {
      meta: { title, description, image, url },
    },
    revalidate: 60, // ISR: 60초마다 백그라운드에서 페이지 재생성
  };
};

export default function SharePage({ meta }: Props) {
  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />

        {/* Open Graph */}
        <meta property="og:type"        content="website" />
        <meta property="og:title"       content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:image"       content={meta.image} />
        <meta property="og:url"         content={meta.url} />
        <meta property="og:locale"      content="ko_KR" />

        {/* Twitter Card */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image"       content={meta.image} />
        {/* ※ 클라이언트 리프레시 메타는 제거했습니다 */}
      </Head>

      {/* 빈 바디: OG 메타만 필요 */}
      <div />
    </>
  );
}