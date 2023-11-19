/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextPage } from "next";
import { type AppType } from "next/app";
import Head from "next/head";
import { type ReactElement, type ReactNode } from "react";
import "~/styles/globals.css";
import { api } from "~/utils/api";
import { Poppins, Raleway } from "next/font/google";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Mumbai } from "@thirdweb-dev/chains";
import { dAPP_METADATA } from "~/constants";
import LensAuthProvider from "~/modules/lens/providers/LensAuthProvider";
import { Toaster } from "~/components/ui/toaster";
import LoadingOverlay from "~/components/LoadingOverlay";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { LoadingProvider } from "~/modules/loading/LoadingProvider";

type NextPageWithLayout = NextPage & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getLayout?: (page: ReactElement, pageProps?: any) => ReactNode;
};

type AppPropsWithLayout = AppType & {
  Component: NextPageWithLayout;
};

const poppins = Poppins({
  subsets: ["devanagari", "latin", "latin-ext"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const raleway = Raleway({
  subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"],
});

const MyApp = ({ Component }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <LoadingProvider>
        <ThirdwebProvider
          activeChain={Mumbai}
          clientId="e007025daba08c7dd36091e467c8e65f"
          dAppMeta={dAPP_METADATA}
          autoConnect
        >
          <LensAuthProvider>
            <style jsx global>
              {`
                :root {
                  --poppins-font: ${poppins.style.fontFamily};
                  --raleway-font: ${raleway.style.fontFamily};
                }
              `}
            </style>
            <Head>
              <title>{dAPP_METADATA.name}</title>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
              />
              <link
                rel="stylesheet"
                href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
                crossOrigin=""
              />
            </Head>
            <main className="max-w-screen font-primary">
              {getLayout(<Component />)}
              <Toaster />
              <LoadingOverlay />
            </main>
          </LensAuthProvider>
        </ThirdwebProvider>
      </LoadingProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
