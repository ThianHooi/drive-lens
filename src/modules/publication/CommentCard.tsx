import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { getLensProfileInfo } from "~/utils/lens-profile";
import dynamic from "next/dynamic";
import { type AnyPublicationFragment } from "@lens-protocol/client";
import { useLensAuth } from "../lens";
import PublicationActionMenu from "./PublicationActionMenu";
import { PostAvatar } from "./PublicationCard";
import PublicationActions from "./PublicationActions";

const EditorMarkdown = dynamic(
  () =>
    import("@uiw/react-md-editor").then((mod) => {
      return mod.default.Markdown;
    }),
  { ssr: false },
);

type Props = {
  comment: AnyPublicationFragment;
};

const CommentCard = ({ comment }: Props) => {
  const { profile } = useLensAuth();

  if (
    comment.__typename !== "Comment" ||
    comment.metadata.__typename !== "TextOnlyMetadataV3"
  ) {
    return null;
  }

  const { profilePictureUri, handle, displayName } = getLensProfileInfo(
    comment.by,
  );

  const { content } = comment.metadata;

  return (
    <Card>
      <CardHeader className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-row items-center space-x-4">
          <PostAvatar uri={profilePictureUri} />
          <div className="flex flex-col">
            <span className="font-bold">{displayName}</span>
            <div className="flex flex-row space-x-2 text-sm">
              <span className="text-gray-500">@{handle}</span>
              <span>&#x2022;</span>
              <span className="text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {profile?.id === comment.by.id && (
          <PublicationActionMenu publicationId={comment.id} />
        )}
      </CardHeader>

      <CardContent className="flex flex-col space-y-4">
        <EditorMarkdown
          wrapperElement={{
            "data-color-mode": "light",
          }}
          source={content}
        />
      </CardContent>

      <CardFooter>
        <PublicationActions
          publicationId={comment.id}
          stats={comment.stats}
          operations={comment.operations}
        />
      </CardFooter>
    </Card>
  );
};

export default CommentCard;
