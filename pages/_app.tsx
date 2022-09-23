import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import "bootstrap/dist/css/bootstrap.min.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>test</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
