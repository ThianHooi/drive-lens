import type { NextApiRequest, NextApiResponse } from "next";
import { ThirdwebSDK, type TransactionResult } from "@thirdweb-dev/sdk";
import { z } from "zod";
import { MISSION_TO_NFT_ID } from "~/constants";
import { MissionType } from "~/modules/mission/providers/types";
import { env } from "~/env.mjs";

const ClaimMissionNftSchema = z.object({
  missionType: z.enum([MissionType.FIRST_POST, MissionType.FIRST_COMMENT]),
  for: z.string(),
});

export type ClaimMissionNftPayload = z.infer<typeof ClaimMissionNftSchema>;

export type ClaimMissionNftResponse =
  | {
      txResult: TransactionResult;
      error?: string;
    }
  | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ClaimMissionNftResponse>,
) {
  if (req.method !== "POST") {
    res.status(500).json({ error: "Only POST requests allowed" });
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { body } = req;

  const safeParseResult = ClaimMissionNftSchema.safeParse(body);

  if (!safeParseResult.success) {
    res.status(400).json({ error: "Invalid payload" });
    return;
  }

  const { missionType, for: forAddress } = safeParseResult.data;

  const NFT_ID = MISSION_TO_NFT_ID[missionType];

  const twSdk = getTwSdk();
  const awardContract = await getAwardContract(twSdk);

  try {
    const txResult = await awardContract.erc1155.claimTo(forAddress, NFT_ID, 1);

    res.status(200).json({ txResult });
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    res
      .status(500)
      .json({
        error: (error as { message?: string }).message ?? "Error claiming NFT",
      });
  }
}

function getTwSdk() {
  const sdk = ThirdwebSDK.fromPrivateKey(
    env.OWNER_WALLET_PRIVATE_KEY,
    "mumbai",
    {
      clientId: env.NEXT_PUBLIC_TW_CLIENT_ID,
      secretKey: env.TW_CLIENT_SECRET,
    },
  );

  return sdk;
}

async function getAwardContract(sdk: ThirdwebSDK) {
  const contract = await sdk.getContract(
    env.NEXT_PUBLIC_AWARD_CONTRACT_ADDRESS,
  );
  return contract;
}
