import { GetServerSideProps } from 'next';
import Head from 'next/head';

interface Data {
  name: string;
  fortune_date: string;
  message: string;
  action_tip: string;
}

interface Props {
  data: Data;
  meta: {
    title: string;
    description: string;
    image: string;
    url: string;
  };
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params, req }) => {
  const uuid = params?.uuid as string;
  if (!uuid) return { notFound: true };

  // 1) AWS API Gateway 호출
  const res = await fetch(`${process.env.API_BASE_URL}/share/${uuid}`);
  if (!res.ok) return { notFound: true };
  const data: Data = await res.json();

  // 2) 메타 생성
  const d = new Date(data.fortune_date);
  const mm = d.getMonth() + 1;
  const dd = d.getDate();
  const nameOnly = data.name.length > 1 ? data.name.slice(1) : data.name;
  const title = `${nameOnly}님의 ${mm}월 ${dd}일 운세 🍀`;
  const firstSentence = data.message.split('. ')[0] + '.';
  const description = `${firstSentence} AI가 예측한 운세를 확인해보세요!`;
  const origin = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}`;
  const image = `${origin}/logo.png`;
  const url = `${origin}/share/${uuid}`;

  return {
    props: {
      data,
      meta: { title, description, image, url },
    },
  };
};

export default function SharePage({ data, meta }: Props) {
  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:image" content={meta.image} />
        <meta property="og:url" content={meta.url} />
        <meta property="og:locale" content="ko_KR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.image} />
      </Head>
      <main>
        {/* SharePage UI: 나머지 UI는 React/Vite 코드 재사용 가능 */}
        <h1>{meta.title}</h1>
        <p>{data.message}</p>
        <p>Tip: {data.action_tip}</p>
      </main>
    </>
  );
}