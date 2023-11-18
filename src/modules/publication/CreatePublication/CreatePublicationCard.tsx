import React, { useState } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { MetadataAttributeType, textOnly } from "@lens-protocol/metadata";
import { useSDK, useStorageUpload } from "@thirdweb-dev/react";
import { lensClient, useLensAuth } from "../../lens";
import { isRelaySuccess } from "@lens-protocol/client";
import { APP_ID } from "~/constants";
import { useToast } from "~/components/ui/use-toast";
import { Loader2, Edit } from "lucide-react";
import { Dialog, DialogTrigger } from "~/components/ui/dialog";
import CreatePublicationModal from "./CreatePublicationModal";

// TODO: customise markdown editor command
// TODO: allow upload of images
// TODO: figure out how to include URL or other metadata

const CreatePublicationCard = () => {
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const { isSignedIn, profile } = useLensAuth();
  const { mutateAsync: uploadToIpfs } = useStorageUpload();
  const twSdk = useSDK();
  const { toast } = useToast();

  const createPublicationHandler = async (content: string) => {
    try {
      setShowCreatePostModal(false);
      setLoading(true);
      if (!twSdk) {
        throw new Error("SDK not initialized");
      }

      if (!isSignedIn) {
        throw new Error("User not signed in");
      }

      const metadata = textOnly({
        content,
        appId: APP_ID,
        // TODO: add randomly generated geojson
        // attributes: [
        //   {
        //     key: "geojson",
        //     value:
        //       '{"type":"LineString","coordinates":[[-101.744384,39.32155],[-101.552124,39.330048],[-101.403808,39.330048],[-101.332397,39.364032],[-101.041259,39.368279],[-100.975341,39.304549],[-100.914916,39.245016],[-100.843505,39.164141],[-100.805053,39.104488],[-100.491943,39.100226],[-100.437011,39.095962],[-100.338134,39.095962],[-100.195312,39.027718],[-100.008544,39.010647],[-99.865722,39.00211],[-99.684448,38.972221],[-99.51416,38.929502],[-99.382324,38.920955],[-99.321899,38.895308],[-99.113159,38.869651],[-99.0802,38.85682],[-98.822021,38.85682],[-98.448486,38.848264],[-98.206787,38.848264],[-98.020019,38.878204],[-97.635498,38.873928]]}',
        //     type: MetadataAttributeType.JSON,
        //   },
        // ],
      });
      const uri = await uploadToIpfs({ data: [metadata] });

      if (!uri?.length || uri.length === 0 || !uri[0]) {
        throw new Error("Failed to upload to IPFS");
      }

      const contentURI = uri[0];

      if (profile?.signless) {
        await createByLensProfileManager(contentURI);
      } else {
        await createByTypedData(contentURI);
      }

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

  const createByLensProfileManager = async (contentURI: string) => {
    try {
      const result = await lensClient.publication.postOnchain({
        contentURI,
      });

      const resultValue = result.unwrap();

      if (!isRelaySuccess(resultValue)) {
        console.log(`Something went wrong when posting on chain`, resultValue);
        throw new Error(resultValue.reason);
      }

      console.log(
        `Transaction was successfully broadcasted with txId ${resultValue.txId}`,
      );

      return resultValue.txId;
    } catch (error) {
      throw error;
    }
  };

  const createByTypedData = async (contentURI: string) => {
    try {
      if (!twSdk) {
        throw new Error("SDK not initialized");
      }

      const resultTypedData =
        await lensClient.publication.createOnchainPostTypedData({
          contentURI,
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

      return broadcastValue.txId;
    } catch (error) {
      throw error;
    }
  };

  return (
    <Dialog open={showCreatePostModal} onOpenChange={setShowCreatePostModal}>
      <Card className="relative w-full">
        {loading && (
          <div className="absolute left-0 top-0 flex h-full w-full flex-row items-center justify-center rounded-lg bg-slate-100 opacity-80">
            <Loader2 className="h-10 w-10 animate-spin" />
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
      <CreatePublicationModal
        createPublicationHandler={createPublicationHandler}
      />
    </Dialog>
  );
};

export default CreatePublicationCard;
