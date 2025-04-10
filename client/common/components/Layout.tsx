import Head from 'next/head';

import AuthenticationInfo from './AuthenticationInfo';
import Footer from './common/Footer';
import Header from './common/Header';

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <Head>
        <title>TEST APP</title>
        <meta name="description" content="Yet another shop storefront" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="wrapper">
        <Header>
          <AuthenticationInfo />
        </Header>
        <main className="main">{children}</main>
        <Footer />
      </div>
    </>
  );
}
