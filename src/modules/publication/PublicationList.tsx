import React, { useEffect, useState } from "react";
import {
  type AnyPublicationFragment,
  ExplorePublicationsOrderByType,
} from "@lens-protocol/client";
import { lensClient } from "../lens";
import PublicationCard from "./PublicationCard";
import { ExplorePublicationType } from "@lens-protocol/react-web";
import { APP_ID } from "~/constants";

const PublicationList = () => {
  const [publications, setPublications] = useState<AnyPublicationFragment[]>(
    [],
  );

  useEffect(() => {
    const fetchPublications = async () => {
      const result = await lensClient.explore.publications({
        orderBy: ExplorePublicationsOrderByType.TopCommented,
        where: {
          publicationTypes: [ExplorePublicationType.Post],
          metadata: {
            publishedOn: [APP_ID],
          },
        },
      });

      // const result = await lensClient.publication.fetchAll({
      //   where: {
      //     publicationTypes: [PublicationType.Post],
      //   },
      // });
      setPublications(result.items);
    };

    fetchPublications().catch((error) => console.error(error));
  }, []);

  return (
    <>
      <p>Publications</p>

      <div className="flex flex-col space-y-0">
        {publications.map((publication) => {
          return (
            <PublicationCard key={publication.id} publication={publication} />
          );
        })}
      </div>
    </>
  );
};

export default PublicationList;
