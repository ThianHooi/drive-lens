import React from "react";
import { lensClient, useLensAuth } from "../lens";
import { useSDK } from "@thirdweb-dev/react";
import { useToast } from "~/components/ui/use-toast";
import { type GraphqlErrorResponse } from "~/types/graphql";
import { Switch } from "~/components/ui/switch";
import { useLoading } from "../loading/LoadingProvider";

const ToastMessages = {
  enabled: {
    title: "Successfully enabled profile manager",
    description: "You can interact with better experiences now 🎉",
  },
  disabled: {
    title: "Disabled profile manager",
    description: "Enabled profile manager to interact with better experiences",
  },
};

const ProfileManagerSetting = () => {
  const { profile, refetchProfile } = useLensAuth();
  const twSdk = useSDK();
  const { toast } = useToast();
  const { startLoading, stopLoading } = useLoading();

  if (!profile) return null;

  const toggleProfileManager = async () => {
    try {
      startLoading();
      if (!twSdk) {
        throw new Error("SDK not initialized");
      }

      const typedDataResult = await lensClient.profile
        .createChangeProfileManagersTypedData({
          approveSignless: !profile.signless,
        })
        .catch((error: GraphqlErrorResponse) => {
          const firstError = error?.response?.errors?.[0];
          throw new Error(firstError?.message ?? "Something went wrong");
        });

      const { id, typedData } = typedDataResult.unwrap();

      const signedTypedData = await twSdk?.wallet.signTypedData(
        typedData.domain,
        typedData.types,
        typedData.value,
      );

      const broadcastResult = await lensClient.transaction.broadcastOnchain({
        id,
        signature: signedTypedData.signature,
      });

      const onchainRelayResult = broadcastResult.unwrap();

      if (onchainRelayResult.__typename === "RelayError") {
        console.log(
          `Something went wrong when broadcasting`,
          onchainRelayResult.reason,
        );
        throw new Error("Something went wrong when broadcasting");
      }

      console.log(
        `Successfully changed profile managers with transaction with txHash: ${onchainRelayResult.txHash}`,
      );

      toast({
        title: profile.signless
          ? ToastMessages.disabled.title
          : ToastMessages.enabled.title,
        description: profile.signless
          ? ToastMessages.disabled.description
          : ToastMessages.enabled.description,
        variant: "default",
      });

      await refetchProfile();
    } catch (error) {
      toast({
        title: (error as Error)?.message ?? "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={profile.signless}
        onCheckedChange={toggleProfileManager}
      />
      {profile.signless ? (
        <span>Profile manager enabled ✅</span>
      ) : (
        <span>Profile manager disabled 😟</span>
      )}
    </div>
  );
};

export default ProfileManagerSetting;
