import {
  type AnyPublicationFragment,
  CommentRankingFilterType,
} from "@lens-protocol/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { lensClient } from "../lens";
import PublicationSkeleton from "./PublicationSkeleton";
import NotFoundIcon from "~/components/icons/NotFoundIcon";
import PublicationCard from "./PublicationCard";
import CreatePublicationCard from "./CreatePublication/CreatePublicationCard";
import { LocalPublicationType } from "./enum";
import CommentCard from "./CommentCard";
import ViewOnChain from "./ViewOnChain";
import { MissionCard } from "../mission/MissionCard";
import LinkCollection from "~/components/LinkCollection";

const SinglePublication = () => {
  const [loading, setLoading] = useState(true);
  const [publication, setPublication] =
    useState<AnyPublicationFragment | null>();
  const [comments, setComments] = useState<AnyPublicationFragment[]>([]);
  const [refetchFlag, setRefetchFlag] = useState(false);

  const router = useRouter();
  const { id } = router.query as { id: string };

  useEffect(() => {
    const fetchPublication = async () => {
      setLoading(true);
      const result = await lensClient.publication.fetch({
        forId: id,
      });

      setPublication(result);
    };

    fetchPublication()
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const fetchComments = async () => {
      if (!id || !publication) return;

      const result = await lensClient.publication.fetchAll({
        where: {
          commentOn: {
            id,
            ranking: {
              filter: CommentRankingFilterType.Relevant,
            },
          },
        },
      });

      setComments(result.items);
    };

    fetchComments().catch((error) => console.error(error));
  }, [id, publication, refetchFlag]);

  if (loading) {
    return <PublicationSkeleton />;
  }

  if (!publication) {
    return (
      <div className="mt-24 flex h-full w-full flex-col items-center justify-center space-y-8">
        <p className="text-2xl font-semibold">Publication not found</p>
        <NotFoundIcon className="h-60 w-60" />
      </div>
    );
  }

  return (
    <div className="flex flex-row space-x-4">
      <div className="flex w-full flex-col space-y-4 lg:w-[70%]">
        <PublicationCard publication={publication} shouldShowLink={false} />

        <CreatePublicationCard
          commentOn={publication.id}
          onCreateSuccess={(txId?: string) => {
            if (!txId) return;
            setTimeout(() => {
              setRefetchFlag((prev) => !prev);
            }, 3000);
          }}
          publicationType={LocalPublicationType.COMMENT}
        />

        {comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>

      <div className="hidden w-[30%] flex-col space-y-8 lg:flex ">
        <ViewOnChain txHash={publication.txHash!} />
        <MissionCard />
        <LinkCollection />
      </div>
    </div>
  );
};

export default SinglePublication;
