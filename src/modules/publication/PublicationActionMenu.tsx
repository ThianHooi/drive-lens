import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import { MoreVertical, Trash2 } from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/button";
import { lensClient } from "../lens";
import { useToast } from "~/components/ui/use-toast";
import { useRouter } from "next/router";

type Props = {
  publicationId: string;
  onRemovePublication?: () => void;
};

const PublicationActionMenu = ({
  publicationId,
  onRemovePublication,
}: Props) => {
  const router = useRouter();
  const { toast } = useToast();

  const removePublication = async () => {
    try {
      await lensClient.publication.hide({
        for: publicationId,
      });

      onRemovePublication && onRemovePublication();

      toast({
        title: "Successfully removed",
        description: "Your post was successfully removed",
        variant: "default",
      });

      // TODO: refresh publications using context provider
      router.reload();
    } catch (error) {
      toast({
        title: (error as Error)?.message ?? "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreVertical className="h-5 w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Action</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button
            variant="link"
            size="sm"
            className="flex flex-row items-center space-x-2 text-destructive"
            onClick={removePublication}
          >
            <Trash2 className="h-5 w-5" />
            <span>Remove</span>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PublicationActionMenu;
