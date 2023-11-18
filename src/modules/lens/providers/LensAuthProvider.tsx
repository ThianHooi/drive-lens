/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useCallback, useEffect, useState } from "react";
import { type AuthInfo, type LensAuth } from "../types/lens-auth";
import { type ChildrenT } from "~/types/Children";
import { useAddress, useSDK, useDisconnect } from "@thirdweb-dev/react";
import lensClient from "../lens-client";

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
  ...defaultAuthInfo,
};

export const LensAuthContext = React.createContext<LensAuth>(defaultLensAuth);
LensAuthContext.displayName = "LensAuthContext";

const LensAuthProvider = (props: ChildrenT) => {
  const address = useAddress();
  const twSDK = useSDK();

  const disconnect = useDisconnect();

  const [loading, setLoading] = useState(false);
  const [authInfo, setAuthInfo] = useState<AuthInfo>({
    isSignedIn: false,
    profileId: null,
    profile: null,
  });

  const resetAuthInfo = () => setAuthInfo(defaultAuthInfo);

  const signIntoLens = useCallback(async () => {
    const isAuthenticated = await lensClient.authentication.isAuthenticated();

    if (!isAuthenticated) {
      resetAuthInfo();
      return;
    }

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
  }, []);

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
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [address, signIntoLens, twSDK],
  );

  const createProfile = () => {
    throw new Error("Not implemented");
  };

  const logout = async () => {
    if (!address) {
      throw new Error("Wallet not connected");
    }

    if (!twSDK) {
      throw new Error("SDK not connected");
    }

    await lensClient.authentication.logout();

    await disconnect();

    resetAuthInfo();
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

  const refetchProfile = async () => {
    console.log('====================================');
    console.log('refetchProfile');
    console.log('====================================');
    if (!authInfo.profileId) {
      console.log('====================================');
      console.log('!authInfo.profileId');
      console.log('====================================');
      return;
    }

    const profile = await lensClient.profile.fetch({
      forProfileId: authInfo.profileId,
    });

    console.log('====================================');
    console.log('profile', profile);
    console.log('====================================');

    setAuthInfo((prev) => ({
      ...prev,
      profile,
    }));
  };

  useEffect(() => {
    twSDK?.wallet.events.on("signerChanged", (signer) => {
      if (!!signer) {
        signer
          .getAddress()
          .then((address) => {
            void signIn(address);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });

    return () => {
      twSDK?.wallet.events.off("signerChanged");
    };
  }, [signIn, twSDK]);

  const value = {
    loading,
    createProfile,
    logout,
    getProfilePictureUri,
    refetchProfile,
    ...authInfo,
  };

  return (
    <LensAuthContext.Provider value={value}>
      {props.children}
    </LensAuthContext.Provider>
  );
};

export default LensAuthProvider;
