import React, { useState } from "react";
import {
  type PublicationOperationsFragment,
  type PublicationStatsFragment,
  PublicationReactionType,
} from "@lens-protocol/client";
import { Heart, MessageSquare } from "lucide-react";
import FilledHeart from "~/components/icons/FilledHeart";
import { lensClient } from "../lens";
import { Button } from "~/components/ui/button";

type Props = {
  publicationId: string;
  stats: PublicationStatsFragment;
  operations: PublicationOperationsFragment;
};

const PublicationActions = ({ publicationId, stats, operations }: Props) => {
  const [likeCount, setLikeCount] = useState<number>(stats?.upvotes ?? 0);
  const [hasUserLiked, setHasUserLiked] = useState(operations.hasUpvoted);

  const handleUpvote = async () => {
    try {
      await lensClient.publication.reactions.add({
        for: publicationId,
        reaction: PublicationReactionType.Upvote,
      });

      setLikeCount((prev) => prev + 1);
      setHasUserLiked(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownvote = async () => {
    try {
      await lensClient.publication.reactions.remove({
        for: publicationId,
        reaction: PublicationReactionType.Upvote,
      });

      setLikeCount((prev) => prev - 1);
      setHasUserLiked(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-row space-x-8">
      <div className="flex flex-row items-center space-x-1">
        {hasUserLiked ? (
          <Button variant={"ghost"} className="h-auto p-0">
            <FilledHeart onClick={handleDownvote} className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant={"ghost"} className="h-auto p-0">
            <Heart onClick={handleUpvote} size={16} />
          </Button>
        )}
        <span>{likeCount}</span>
      </div>
      <div className="flex flex-row items-center space-x-1">
        <MessageSquare size={16} />
        <span>{stats.comments}</span>
      </div>
    </div>
  );
};

export default PublicationActions;
