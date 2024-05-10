import { useAddress } from "@thirdweb-dev/react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/components/ui/use-toast";
import { lensClient } from "../lens";
import { isRelaySuccess } from "@lens-protocol/client";

const CreateProfileModal = () => {
  const address = useAddress();
  const { toast } = useToast();

  const [value, setValue] = useState<string | undefined>();

  // const onCreateHandler = async () => {
  //   console.log("====================================");
  //   console.log("Create profile with handle: ", value);
  //   console.log("====================================");

  //   if (!address) {
  //     toast({
  //       title: "Please connect your wallet",
  //       description: "You need to connect your wallet to create a profile.",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

    // const profileCreateResult = await lensClient.profile.create({
    //   handle: value!,
    //   to: address,
    // });

    // const profileCreateResultValue = profileCreateResult.unwrap();

    // if (!isRelaySuccess(profileCreateResultValue)) {
    //   console.log(`Something went wrong`, profileCreateResultValue);
    //   return;
    // }

    // console.log(
    //   `Transaction to create a new profile with handle "${value}" was successfuly broadcasted with txId ${profileCreateResultValue.txId}`,
    // );

    // console.log(`Waiting for the transaction to be indexed...`);
    // await lensClient.transaction.waitUntilComplete({
    //   txId: profileCreateResultValue.txId,
    // });

    // const allOwnedProfiles = await lensClient.profile.fetchAll({
    //   where: {
    //     ownedBy: [address],
    //   },
    // });

    // console.log(
    //   `All owned profiles: `,
    //   allOwnedProfiles.items.map((i) => ({ id: i.id, handle: i.handle })),
    // );

    // const newProfile = allOwnedProfiles.items.find(
    //   (item) => item.handle === `${handle}.test`,
    // );

    // if (newProfile) {
    //   console.log(`The newly created profile's id is: ${newProfile.id}`);
    // }
  // };

  return (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>Create testnet profile.</DialogTitle>
        <DialogDescription>
          Create a testnet profile to interact with the app.
        </DialogDescription>
      </DialogHeader>
      <div>
        <Label htmlFor="handle"></Label>
        <Input
          id="handle"
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter your handle"
        />
      </div>
      <DialogFooter>
        <Button
          onClick={() => console.log("Not implemented")}
          variant="default"
        >
          Create
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default CreateProfileModal;
