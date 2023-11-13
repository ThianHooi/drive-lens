import { type ProfileFragment } from "@lens-protocol/client";

export type AuthInfo = {
  isSignedIn: boolean;
  profileId: string | null;
  profile?: ProfileFragment | null;
};

export type LensAuth = {
  logout: () => Promise<void>;
  createProfile: () => Promise<void>;
  getProfilePictureUri: () => string | undefined;
  loading: boolean;
} & AuthInfo;
