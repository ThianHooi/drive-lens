import { useAddress } from "@thirdweb-dev/react";
import { CheckSquare, Square } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useMission } from "./providers/MissionProvider";
import { cn } from "~/utils/ui";

type MissionCheckboxProps = {
  label: string;
  checked: boolean;
};

const MissionCheckbox = ({ label, checked }: MissionCheckboxProps) => {
  return (
    <div className="flex items-center space-x-2">
      {checked ? (
        <CheckSquare className="h-4 w-4 text-green-600" strokeWidth={3} />
      ) : (
        <Square className="h-4 w-4" />
      )}
      <p
        className={cn("text-sm font-medium leading-none", {
          "line-through": checked,
        })}
      >
        {label}
      </p>
    </div>
  );
};

export const MissionCard = () => {
  const address = useAddress();
  const missionContext = useMission();

  if (!address) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          <Link href="/award">🏆 Mission</Link>
        </CardTitle>
        <CardDescription>
          Complete the following to earn your digital collectibles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <MissionCheckbox
            label="Create first post"
            checked={missionContext.status.FIRST_POST}
          />
          <MissionCheckbox
            label="Create first comment"
            checked={missionContext.status.FIRST_COMMENT}
          />
        </div>
      </CardContent>
    </Card>
  );
};
