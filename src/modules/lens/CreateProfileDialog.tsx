import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import lensClient from "./lens-client";
import useLensAuth from "./hooks/useLensAuth";
import { useToast } from "~/components/ui/use-toast";
import { useAddress } from "@thirdweb-dev/react";
import { CreateProfileWithHandleErrorReasonType } from "@lens-protocol/client";

type CreateProfileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const CreateProfileDialog = ({
  open,
  onOpenChange,
}: CreateProfileDialogProps) => {
  const [handlerInput, setHandlerInput] = useState<string>("");
  const { onCreateProfileSuccess } = useLensAuth();
  const { toast } = useToast();
  const address = useAddress();

  // const createProfileHandler = async () => {
  //   try {
  //     const profileCreateResult = await lensClient.profile.create({
  //       handle: handlerInput,
  //       to: address!,
  //     });

  //     if ("reason" in profileCreateResult) {
  //       throw new Error(
  //         profileCreateResult.reason ===
  //         CreateProfileWithHandleErrorReasonType.HandleTaken
  //           ? "Handle is taken"
  //           : "Try again later",
  //       );
  //     }

  //     await lensClient.transaction.waitUntilComplete({
  //       forTxId: profileCreateResult.txId,
  //     });

  //     onCreateProfileSuccess();
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description:
  //         (error as { message?: string }).message ?? "Failed to create profile",
  //       variant: "destructive",
  //     });
  //   }
  // };

  const openChangeHandler = (open: boolean) => {
    if (!open) {
      setHandlerInput("");
    }
    onOpenChange(open);
  };

  return (
    <Dialog onOpenChange={openChangeHandler} open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a profile</DialogTitle>
          <DialogDescription>Create a profile using a handle</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-2">
          <Label htmlFor="handle" className="sr-only">
            Handle
          </Label>
          <Input
            id="handle"
            placeholder="Insert your unique handle"
            value={handlerInput}
            onChange={(e) => setHandlerInput(e.target.value)}
          />
        </div>
        <DialogFooter className="justify-start sm:justify-between ">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={() => console.log("Not implemented")} type="submit">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProfileDialog;
