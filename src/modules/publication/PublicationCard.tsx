import { type AnyPublicationFragment } from "@lens-protocol/client";
import { User } from "lucide-react";
import React from "react";
import Markdown from "react-markdown";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { getLensProfileInfo } from "~/utils/lens-profile";

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
        <Markdown>{publication.metadata.content}</Markdown>
      </CardContent>
      {/* <CardFooter className="flex justify-between">
        
      </CardFooter> */}
    </Card>
  );
};

export default PublicationCard;
