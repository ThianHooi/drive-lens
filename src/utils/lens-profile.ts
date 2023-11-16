import { type ProfileFragment } from "@lens-protocol/client";

type LensProfileInfo = {
  profilePictureUri?: string;
  handle?: string;
  displayName?: string | null;
};

const getProfilePictureUri = (profile: ProfileFragment) => {
  if (!profile?.metadata) {
    return undefined;
  }

  const { picture } = profile.metadata;

  if (!picture || picture.__typename !== "ImageSet" || !picture?.optimized) {
    return undefined;
  }

  return picture.optimized.uri;
};

const getHandle = (profile: ProfileFragment) => {
  if (!profile?.handle) {
    return undefined;
  }

  return profile.handle?.localName;
};

const getDisplayName = (profile: ProfileFragment) => {
  if (!profile?.metadata) {
    return undefined;
  }

  return profile.metadata.displayName;
};

export const getLensProfileInfo = (
  profile: ProfileFragment,
): LensProfileInfo => {
  const profilePictureUri = getProfilePictureUri(profile);
  const handle = getHandle(profile);
  const displayName = getDisplayName(profile);

  return {
    profilePictureUri,
    handle,
    displayName,
  };
};
