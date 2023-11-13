import { useContext } from "react";
import { type ProfileFragment } from "@lens-protocol/client";
import { LensAuthContext } from "../providers/LensAuthProvider";

type AuthInfo = {
  isSignedIn: boolean;
  profileId: string | null;
  profile?: ProfileFragment | null;
};

type LensAuth = {
  signIn: (address: string) => Promise<void>;
  logout: () => Promise<void>;
  createProfile: () => Promise<void>;
  getProfilePictureUri: () => string | undefined;
  loading: boolean;
} & AuthInfo;

const useLensAuth = (): LensAuth => {
  const ctx = useContext(LensAuthContext);

  return Object.assign({}, ctx);
};

export default useLensAuth;
