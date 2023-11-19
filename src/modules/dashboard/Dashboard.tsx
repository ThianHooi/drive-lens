import React from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";

const Dashboard = () => {
  return (
    <div className="flex flex-row space-x-4">
      <Card className="w-[350px]">
        <CardContent className="pt-6 text-center">
          <p className="text-5xl font-bold">123</p>
        </CardContent>
        <CardFooter className="w-full justify-center text-center">
          <p>km driven in past 30 days</p>
        </CardFooter>
      </Card>
      <Card className="w-[350px]">
        <CardContent className="pt-6 text-center">
          <p className="text-5xl font-bold">67</p>
        </CardContent>
        <CardFooter className="w-full justify-center text-center">
          <p>hours driven in past 30 days</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Dashboard;
