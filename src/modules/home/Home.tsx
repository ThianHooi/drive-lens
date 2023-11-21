import React from "react";
import PublicationList from "../publication/PublicationList";
import CreatePublicationCard from "../publication/CreatePublication/CreatePublicationCard";
import { LocalPublicationType } from "../publication/enum";
import { MissionCard } from "../mission/MissionCard";

const Home = () => {
  return (
    <div className="flex flex-row space-x-4">
      <div className="flex w-full flex-col space-y-8 lg:w-[70%]">
        <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0 ">
          <CreatePublicationCard
            publicationType={LocalPublicationType.TEXT}
            key="create-text"
          />
          <CreatePublicationCard
            publicationType={LocalPublicationType.DRIVE}
            key="share-drive"
          />
        </div>
        <PublicationList />
      </div>
      <div className="hidden w-[30%] flex-col space-y-8 lg:flex ">
        <MissionCard />
      </div>
    </div>
  );
};

export default Home;
