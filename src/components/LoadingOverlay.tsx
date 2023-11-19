import { Loader2 } from "lucide-react";
import Overlay from "./ui/overlay";
import { useLoading } from "~/modules/loading/LoadingProvider";
import { cn } from "~/utils/ui";

const LoadingOverlay = () => {
  const { isLoading } = useLoading();

  return (
    <Overlay
      className={cn("flex items-center justify-center", {
        hidden: !isLoading,
      })}
    >
      <div className="flex flex-col items-center justify-center space-y-2">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <h1 className="text-center text-lg font-semibold text-primary">
          Loading...
        </h1>
      </div>
    </Overlay>
  );
};

export default LoadingOverlay;
