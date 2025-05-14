// pages/[code].tsx
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const code = params?.code as string;
  if (!code) return { notFound: true };

  // 백엔드에서 uuid만 가져오기
  const apiRes = await fetch(`${process.env.API_BASE_URL}/short/${code}`);
  if (!apiRes.ok) return { notFound: true };
  const { uuid } = await apiRes.json();

  // /share/:uuid 로 리다이렉트
  return {
    redirect: {
      destination: `/share/${uuid}`,
      permanent: false,  // 302
    },
  };
};

export default function ShortRedirect() {
  return null;
}
