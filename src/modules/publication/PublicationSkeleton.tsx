import React from "react";
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

export default PublicationSkeleton;
