import React from "react";
import PublicationList from "../publication/PublicationList";
import CreatePublicationCard from "../publication/CreatePublication/CreatePublicationCard";

const Home = () => {
  return (
    <div className="flex flex-row space-x-4">
      <div className="flex w-full flex-col space-y-8 lg:w-[70%] ">
        <CreatePublicationCard />
        <PublicationList />
      </div>
      <div className="hidden w-[30%] flex-col space-y-8 lg:flex ">
        <div className="rounded-md bg-white p-4 shadow-md">
          <p>Right side</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
