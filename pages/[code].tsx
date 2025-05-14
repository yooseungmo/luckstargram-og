// pages/[code].tsx
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const code = params?.code as string;
  if (!code) return { notFound: true };

  const fetchUrl = `${process.env.API_BASE_URL}/short/${code}`;
  const res = await fetch(fetchUrl);
  if (!res.ok) return { notFound: true };

  const { uuid } = (await res.json()) as { uuid: string };
  if (!uuid) return { notFound: true };

  return {
    redirect: {
      destination: `/share/${uuid}`,
      statusCode: 302,
    },
  };
};

export default function ShortRedirect() {
  return null;
}
