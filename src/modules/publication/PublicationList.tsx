import React, { useEffect, useState } from "react";
import {
  type AnyPublicationFragment,
  ExplorePublicationsOrderByType,
} from "@lens-protocol/client";
import { lensClient } from "../lens";
import PublicationCard from "./PublicationCard";
import { ExplorePublicationType } from "@lens-protocol/react-web";
import { APP_ID } from "~/constants";
import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

const PublicationSkeleton = () => (
  <Card className="w-full">
    <CardContent className="flex items-center space-x-4 pt-6">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </CardContent>
  </Card>
);

const PublicationList = () => {
  const [publications, setPublications] = useState<AnyPublicationFragment[]>(
    [],
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublications = async () => {
      setLoading(true);
      const result = await lensClient.explore.publications({
        orderBy: ExplorePublicationsOrderByType.TopCommented,
        where: {
          publicationTypes: [ExplorePublicationType.Post],
          metadata: {
            publishedOn: [APP_ID],
          },
        },
      });

      setPublications(result.items);
    };

    fetchPublications()
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <p>Publications</p>

      {loading && (
        <div className="flex w-full flex-col items-center justify-center space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <PublicationSkeleton key={index} />
          ))}
        </div>
      )}

      {publications.length === 0 && !loading && (
        <div className="flex w-full flex-col items-center justify-center space-y-4">
          <p className="text-2xl">🥲</p>
          <p className="text-gray-500">
            There are no publications yet. Be the first to create one!
          </p>
        </div>
      )}

      {publications.length > 0 && !loading && (
        <div className="flex flex-col space-y-4">
          {publications.map((publication) => {
            return (
              <PublicationCard key={publication.id} publication={publication} />
            );
          })}
        </div>
      )}
    </>
  );
};

export default PublicationList;
