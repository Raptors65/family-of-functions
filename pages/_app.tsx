import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import "bootstrap/dist/css/bootstrap.min.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Magical Functions - Andy, Lucas, Stanley</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
