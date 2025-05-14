// pages/index.tsx
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: 'https://luckstargram.com/',
      statusCode: 302,
    },
  };
};

export default function HomeRedirect() {
  return null;
}
