import { Mumbai, getChainByChainId } from "@thirdweb-dev/chains";
import {
  ThirdwebNftMedia,
  useAddress,
  useContract,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { env } from "~/env.mjs";
import { MissionCard } from "./MissionCard";

const getNFtExplorerUrl = (contractAddress: string, nftId: string) => {
  const chain = getChainByChainId(Mumbai.chainId);
  const validBlockExplorer = chain?.explorers?.find(
    (explorer) => explorer.standard === "EIP3091",
  );

  if (!validBlockExplorer) {
    return null;
  }

  return `${validBlockExplorer.url}/nft/${contractAddress}/${nftId}`;
};

const AwardList = () => {
  const address = useAddress();
  const { contract } = useContract(env.NEXT_PUBLIC_AWARD_CONTRACT_ADDRESS);
  const { data: ownedNFTs, isLoading } = useOwnedNFTs(contract, address, {
    start: 0,
    count: 100,
  });

  if (!address) return null;

  if (isLoading) {
    return (
      <Card className="w-1/4">
        <CardContent className="flex flex-col items-center space-y-4 pt-6">
          <Skeleton className="h-[250px] w-[250px] " />
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
      <div className="w-full lg:w-[70%]">
        <Card>
          <CardHeader>
            <CardTitle>Award List</CardTitle>
            <CardDescription>
              List of digital collectibles earned from completing missions.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-row space-x-4">
            {ownedNFTs?.map((nft) => {
              const nftExplorerUrl = getNFtExplorerUrl(
                env.NEXT_PUBLIC_AWARD_CONTRACT_ADDRESS,
                nft.metadata.id,
              );

              return (
                <div key={nft.metadata.id} className="relative">
                  {nftExplorerUrl && (
                    <a
                      href={nftExplorerUrl}
                      className="absolute inset-0"
                      target="_blank"
                      rel="noreferrer"
                    />
                  )}
                  <ThirdwebNftMedia
                    className="bottom-1 rounded-lg border border-slate-300 p-4"
                    metadata={nft.metadata}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
      <div className="flex w-full flex-col space-y-8 lg:w-[30%] ">
        <MissionCard />
      </div>
    </div>
  );
};

export default AwardList;
