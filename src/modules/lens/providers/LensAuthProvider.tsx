/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useCallback, useEffect, useState } from "react";
import { type AuthInfo, type LensAuth } from "../types/lens-auth";
import { type ChildrenT } from "~/types/Children";
import { useAddress, useSDK, useDisconnect } from "@thirdweb-dev/react";
import lensClient from "../lens-client";
import { env } from "~/env.mjs";
import CreateProfileDialog from "../CreateProfileDialog";
import { useToast } from "~/components/ui/use-toast";

const SHOULD_POLL_PROFILE = env.NEXT_PUBLIC_SHOULD_POLL_PROFILE;
const POLL_INTERVAL = env.NEXT_PUBLIC_POLL_PROFILE_INTERVAL_MS;

const defaultAuthInfo: AuthInfo = {
  isSignedIn: false,
  profileId: null,
  profile: null,
};

const defaultLensAuth: LensAuth = {
  logout: async () => {},
  createProfile: async () => {},
  getProfilePictureUri: () => undefined,
  refetchProfile: async () => {},
  loading: false,
  showCreateProfileDialog: () => {},
  onCreateProfileSuccess: () => {},
  ...defaultAuthInfo,
};

export const LensAuthContext = React.createContext<LensAuth>(defaultLensAuth);
LensAuthContext.displayName = "LensAuthContext";

const LensAuthProvider = (props: ChildrenT) => {
  const address = useAddress();
  const twSDK = useSDK();
  const { toast } = useToast();

  const disconnect = useDisconnect();

  const [signedInWalletAddress, setSignedInWalletAddress] = useState<string>();
  const [showCreateProfileDialog, setShowCreateProfileDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authInfo, setAuthInfo] = useState<AuthInfo>({
    isSignedIn: false,
    profileId: null,
    profile: null,
  });

  const resetAuthInfo = () => {
    setAuthInfo(defaultAuthInfo);
    setSignedInWalletAddress(undefined);
  };

  const signIntoLens = useCallback(async () => {
    const isAuthenticated = await lensClient.authentication.isAuthenticated();

    if (!isAuthenticated) {
      resetAuthInfo();
      return;
    }

    try {
      const profileId = await lensClient.authentication.getProfileId();
      const profile = await lensClient.profile.fetch({
        forProfileId: profileId,
      });

      setAuthInfo((prev) => ({
        ...prev,
        isSignedIn: true,
        profileId,
        profile,
      }));

      setSignedInWalletAddress(profile?.handle?.ownedBy);

      if (!profile) {
        setShowCreateProfileDialog(true);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    await lensClient.authentication.logout();

    await disconnect();

    resetAuthInfo();
  }, [disconnect]);

  const signIn = useCallback(
    async (_address: string) => {
      setLoading(true);

      try {
        if (!address && !_address) {
          throw new Error("Wallet not connected");
        }

        if (!twSDK) {
          throw new Error("SDK not connected");
        }

        const isAuthenticated =
          await lensClient.authentication.isAuthenticated();

        if (isAuthenticated) {
          await signIntoLens();
          return;
        }

        const profileManaged = await lensClient.wallet.profilesManaged({
          for: _address ?? address,
        });

        const { id, text } = await lensClient.authentication.generateChallenge({
          signedBy: _address ?? address,
          for: profileManaged.items?.[0]?.id,
        });

        const signature = await twSDK.wallet.sign(text);

        await lensClient.authentication.authenticate({
          id,
          signature,
        });

        await signIntoLens();
      } catch (error) {
        console.error("Sign in error", error);
        void logout();
      } finally {
        setLoading(false);
      }
    },
    [address, logout, signIntoLens, twSDK],
  );

  const createProfile = () => {
    throw new Error("Not implemented");
  };

  const getProfilePictureUri = () => {
    const profile = authInfo.profile;

    if (!profile?.metadata) {
      return undefined;
    }

    const { picture } = profile.metadata;

    if (!picture || picture.__typename !== "ImageSet" || !picture?.optimized) {
      return undefined;
    }

    return picture.optimized.uri;
  };

  const refetchProfile = useCallback(async () => {
    const profileID = await lensClient.authentication.getProfileId();

    if (!profileID) {
      return;
    }

    const profile = await lensClient.profile.fetch({
      forProfileId: profileID,
    });

    setAuthInfo((prev) => ({
      ...prev,
      profile,
    }));
  }, []);

  useEffect(() => {
    if (SHOULD_POLL_PROFILE === false) {
      return;
    }

    const intervalId = setInterval(() => {
      if (authInfo.isSignedIn) {
        void refetchProfile();
      }
    }, POLL_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
  }, [authInfo.isSignedIn, refetchProfile]);

  useEffect(() => {
    twSDK?.wallet.events.on("signerChanged", (signer) => {
      if (!!signer) {
        signer
          .getAddress()
          .then((signerAddress) => {
            if (!signedInWalletAddress) {
              void signIn(signerAddress);
              return;
            }

            if (signerAddress !== signedInWalletAddress) {
              void logout();
              return;
            }
          })
          .catch((error) => {
            console.error(error);
          });

        return;
      }

      setSignedInWalletAddress(undefined);
    });

    return () => {
      twSDK?.wallet.events.off("signerChanged");
    };
  }, [address, logout, signIn, signedInWalletAddress, twSDK]);

  const onCreateProfileSuccess = () => {
    lensClient.authentication
      .logout()
      .then(() => {
        void signIn(address!);
      })
      .then(() => setShowCreateProfileDialog(false))
      .then(() => {
        toast({
          title: "Profile created 🎉",
          description: "Your profile was successfully created",
          variant: "default",
        });
      })
      .catch((err) => {
        console.log("onCreateProfileSuccess error", err);
      });
  };

  const value = {
    loading,
    createProfile,
    logout,
    getProfilePictureUri,
    refetchProfile,
    showCreateProfileDialog: () => setShowCreateProfileDialog(true),
    onCreateProfileSuccess,
    ...authInfo,
  };

  return (
    <LensAuthContext.Provider value={value}>
      {props.children}
      <CreateProfileDialog
        open={showCreateProfileDialog}
        onOpenChange={(open) => setShowCreateProfileDialog(open)}
      />
    </LensAuthContext.Provider>
  );
};

export default LensAuthProvider;
