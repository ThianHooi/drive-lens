import { type AnyPublicationFragment } from "@lens-protocol/client";
import { User } from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { getLensProfileInfo } from "~/utils/lens-profile";
import dynamic from "next/dynamic";

const EditorMarkdown = dynamic(
  () =>
    import("@uiw/react-md-editor").then((mod) => {
      return mod.default.Markdown;
    }),
  { ssr: false },
);

type Props = {
  publication: AnyPublicationFragment;
};

type PostAvatarProps = {
  uri: string | null | undefined;
};

const PostAvatar = ({ uri }: PostAvatarProps) => {
  return (
    <Avatar>
      {uri && <AvatarImage src={uri} />}
      <AvatarFallback>
        <User className="h-4 w-4" />
      </AvatarFallback>
    </Avatar>
  );
};

const PublicationCard = ({ publication }: Props) => {
  if (publication.__typename !== "Post") {
    return null;
  }

  if (publication.metadata.__typename !== "TextOnlyMetadataV3") {
    return null;
  }

  const { profilePictureUri, handle, displayName } = getLensProfileInfo(
    publication.by,
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4">
        <PostAvatar uri={profilePictureUri} />
        <div className="flex flex-col">
          <span className="font-bold">{displayName}</span>
          <div className="flex flex-row space-x-2 text-sm">
            <span className="text-gray-500">@{handle}</span>
            <span>&#x2022;</span>
            <span className="text-gray-500">
              {new Date(publication.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <EditorMarkdown
          wrapperElement={{
            "data-color-mode": "light",
          }}
          source={publication.metadata.content}
        />
      </CardContent>
    </Card>
  );
};

export default PublicationCard;
