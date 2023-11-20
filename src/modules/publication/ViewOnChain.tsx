import { Mumbai, getChainByChainId } from "@thirdweb-dev/chains";
import { ArrowUpRightFromCircle } from "lucide-react";
import React from "react";
import { Card, CardContent } from "~/components/ui/card";

type Props = {
  txHash: string;
};

const ViewOnChain = ({ txHash }: Props) => {
  const chain = getChainByChainId(Mumbai.chainId);
  const validBlockExplorer = chain?.explorers?.find(
    (explorer) => explorer.standard === "EIP3091",
  );

  if (!validBlockExplorer) {
    return null;
  }

  return (
    <Card>
      <div className="flex w-full flex-row items-center justify-start space-x-2 px-6 pt-6">
        <span className="text-sm">View on chain</span>
        <ArrowUpRightFromCircle className="h-3 w-3" />
      </div>
      <CardContent className="overflow-hidden text-ellipsis">
        <a
          href={`${validBlockExplorer.url}/tx/${txHash}`}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-blue-500 underline"
        >
          {txHash}
        </a>
      </CardContent>
    </Card>
  );
};

export default ViewOnChain;
