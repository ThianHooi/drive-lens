import Head from "next/head";
import { type ReactElement } from "react";
import { dAPP_METADATA } from "~/constants";
import MainLayout from "~/layout/MainLayout";
import Home from "~/modules/home/Home";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>{dAPP_METADATA.name}</title>
        <meta name="description" content={dAPP_METADATA.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex min-h-screen w-full flex-col">
        <Home />
      </div>
    </>
  );
}

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
