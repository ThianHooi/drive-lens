import React, { useState } from "react";
import PublicationList from "../publication/PublicationList";
import CreatePublicationCard from "../publication/CreatePublication/CreatePublicationCard";
import { LocalPublicationType } from "../publication/enum";
import { MissionCard } from "../mission/MissionCard";
import LinkCollection from "~/components/LinkCollection";

const Home = () => {
  const [refetchFlag, setRefetchFlag] = useState(false);
  return (
    <div className="flex flex-row space-x-4">
      <div className="flex w-full flex-col space-y-8 lg:w-[70%]">
        <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0 ">
          <CreatePublicationCard
            key="create-text"
            onCreateSuccess={() => setRefetchFlag((prev) => !prev)}
            publicationType={LocalPublicationType.TEXT}
          />
          <CreatePublicationCard
            key="share-drive"
            onCreateSuccess={() => setRefetchFlag((prev) => !prev)}
            publicationType={LocalPublicationType.DRIVE}
          />
        </div>
        <PublicationList refetchFlag={refetchFlag} />
      </div>
      <div className="hidden w-[30%] flex-col space-y-8 lg:flex ">
        <MissionCard />
        <LinkCollection />
      </div>
    </div>
  );
};

export default Home;
