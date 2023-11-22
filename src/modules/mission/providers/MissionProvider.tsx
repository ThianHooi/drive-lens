/* eslint-disable @typescript-eslint/no-misused-promises */
import { useAddress, useContract, useNFTBalance } from "@thirdweb-dev/react";
import { type MissionContextType, MissionType } from "./types";
import { type ChildrenT } from "~/types/Children";
import React, { useEffect } from "react";
import {
  type ClaimMissionNftPayload,
  type ClaimMissionNftResponse,
} from "~/pages/api/claim-mission-nft";
import { useToast } from "~/components/ui/use-toast";
import { Button } from "~/components/ui/button";
import { ExternalLink } from "lucide-react";
import { env } from "~/env.mjs";
import Link from "next/link";

const defaultMissionContext: MissionContextType = {
  status: {
    [MissionType.FIRST_POST]: false,
    [MissionType.FIRST_COMMENT]: false,
  },
  completeTask: async () => Promise.resolve(),
};

export const MissionContext = React.createContext<MissionContextType>(
  defaultMissionContext,
);
MissionContext.displayName = "MissionContext";

export const MissionProvider = (props: ChildrenT) => {
  const address = useAddress();
  const { toast } = useToast();

  const { contract: awardContract } = useContract(
    env.NEXT_PUBLIC_AWARD_CONTRACT_ADDRESS,
  );

  const { data: firstPostNftBalance, refetch: firstPostNftBalanceRefetch } =
    useNFTBalance(awardContract, address, "0");

  const {
    data: firstCommentNftBalance,
    refetch: firstCommentNftBalanceRefetch,
  } = useNFTBalance(awardContract, address, "1");

  const completeTask = async (missionType: MissionType) => {
    const hasClaimedNft =
      missionType === MissionType.FIRST_POST
        ? firstPostNftBalance?.gt(0) ?? false
        : firstCommentNftBalance?.gt(0) ?? false;

    if (hasClaimedNft || !address) {
      return;
    }

    const claimNftPayload: ClaimMissionNftPayload = {
      missionType,
      for: address,
    };

    const response = await fetch("/api/claim-mission-nft", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(claimNftPayload),
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const claimNftResponse: ClaimMissionNftResponse = await response.json();

    if (response.ok && !claimNftResponse?.error) {
      toast({
        title: "Mission complete!",
        description: `🎉 You have earned an NFT for ${
          missionType === MissionType.FIRST_POST
            ? "making your first post"
            : "making your first comment"
        }.`,
        action: (
          <Link href={"/award"}>
            <Button
              variant="link"
              className="flex flex-row items-center justify-center space-x-2 underline"
            >
              <span>View</span>
              <span>
                <ExternalLink className="h-4 w-4" />
              </span>
            </Button>
          </Link>
        ),
      });

      if (missionType === MissionType.FIRST_POST) {
        void firstPostNftBalanceRefetch();
      } else {
        void firstCommentNftBalanceRefetch();
      }
    } else {
      console.error("Failed to claim mission NFT", response);
    }
  };

  const value = {
    status: {
      [MissionType.FIRST_POST]: firstPostNftBalance?.gt(0) ?? false,
      [MissionType.FIRST_COMMENT]: firstCommentNftBalance?.gt(0) ?? false,
    },
    completeTask,
  };

  return (
    <MissionContext.Provider value={value}>
      {props.children}
    </MissionContext.Provider>
  );
};

export const useMission = () => {
  const context = React.useContext(MissionContext);
  if (!context) {
    throw new Error("useMission must be used within a MissionProvider");
  }
  return context;
};
