import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { textOnly } from "@lens-protocol/metadata";
import { useSDK, useStorageUpload } from "@thirdweb-dev/react";
import { lensClient } from "../../lens";
import { isRelaySuccess } from "@lens-protocol/client";
import { APP_ID } from "~/constants";
import { useToast } from "~/components/ui/use-toast";
import { Loader2, Edit } from "lucide-react";
import { Dialog, DialogTrigger } from "~/components/ui/dialog";
import CreatePublicationModal from "./CreatePublicationModal";

// TODO: allow edit in quill editor
// TODO: post based on whether user is signless or not
// TODO: allow upload of images
// TODO: figure out how to include URL or other metadata

const CreatePublicationCard = () => {
  const [loading, setLoading] = useState(false);

  const { mutateAsync: uploadToIpfs } = useStorageUpload();
  const twSdk = useSDK();
  const { toast } = useToast();

  const post = async (content: string) => {
    try {
      setLoading(true);
      if (!twSdk) {
        throw new Error("SDK not initialized");
      }

      const metadata = textOnly({ content, appId: APP_ID });
      const uri = await uploadToIpfs({ data: [metadata] });

      if (!uri?.length || uri.length === 0 || !uri[0]) {
        throw new Error("Failed to upload to IPFS");
      }

      const resultTypedData =
        await lensClient.publication.createOnchainPostTypedData({
          contentURI: uri[0],
        });

      const { id, typedData } = resultTypedData.unwrap();

      const signedTypedData = await twSdk?.wallet.signTypedData(
        typedData.domain,
        typedData.types,
        typedData.value,
      );

      const broadcastResult = await lensClient.transaction.broadcastOnchain({
        id,
        signature: signedTypedData.signature,
      });

      const broadcastValue = broadcastResult.unwrap();

      if (!isRelaySuccess(broadcastValue)) {
        console.error(`Something went wrong when broadcasting`, broadcastValue);
        throw new Error("Something went wrong when broadcasting");
      }

      console.log(`Broadcasted with txId ${broadcastValue.txId}`);

      toast({
        title: "Successfully posted",
        description: "Your post was successfully posted",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: (error as Error)?.message ?? "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <Card className="relative w-full">
        {loading && (
          <div className="absolute left-0 top-0 flex h-full w-full flex-row items-center justify-center rounded-lg bg-slate-100 opacity-80">
            <Loader2 className="absolute left-1/2 top-1/2 h-10 w-10 animate-spin" />
          </div>
        )}
        <CardContent className="pt-6">
          <DialogTrigger className="w-full">
            <div className="inline-flex h-10 w-full items-center justify-start rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background hover:bg-accent hover:text-accent-foreground">
              <Edit className="mr-2 h-4 w-4" />
              Post something...
            </div>
          </DialogTrigger>
        </CardContent>
      </Card>
      <CreatePublicationModal />
    </Dialog>
  );
};

export default CreatePublicationCard;
