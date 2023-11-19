import React, { useState } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { MetadataAttributeType, textOnly } from "@lens-protocol/metadata";
import { useSDK, useStorageUpload } from "@thirdweb-dev/react";
import { lensClient, useLensAuth } from "../../lens";
import { isRelaySuccess } from "@lens-protocol/client";
import {
  APP_ID,
  DRIVING_DISTANCE_ATTRIBUTE_KEY,
  DRIVING_DURATION_ATTRIBUTE_KEY,
  GEO_JSON_ATTRIBUTE_KEY,
} from "~/constants";
import { useToast } from "~/components/ui/use-toast";
import { Edit, CarFront } from "lucide-react";
import { Dialog, DialogTrigger } from "~/components/ui/dialog";
import CreatePublicationModal from "./CreatePublicationModal";
import { useLoading } from "~/modules/loading/LoadingProvider";
import { getRandomGeoJsonLineString } from "~/utils/geojson";
import { LocalPublicationType } from "../enum";
import { getRandomNumber } from "~/utils/random-number";

const PublicationCardContent = {
  [LocalPublicationType.TEXT]: {
    title: "Post something...",
    icon: <Edit className="mr-2 h-4 w-4" />,
  },
  [LocalPublicationType.DRIVE]: {
    title: "Share a drive...",
    icon: <CarFront className="mr-2 h-4 w-4" />,
  },
};

// TODO: allow upload of images

type CreatePublicationCardProps = {
  publicationType: LocalPublicationType;
};

const CreatePublicationCard = ({
  publicationType,
}: CreatePublicationCardProps) => {
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const { startLoading, stopLoading } = useLoading();

  const { isSignedIn, profile } = useLensAuth();
  const { mutateAsync: uploadToIpfs } = useStorageUpload();
  const twSdk = useSDK();
  const { toast } = useToast();

  const createPublicationHandler = async (content: string) => {
    try {
      setShowCreatePostModal(false);
      startLoading();
      if (!twSdk) {
        throw new Error("SDK not initialized");
      }

      if (!isSignedIn) {
        throw new Error("User not signed in");
      }

      const metadata = textOnly({
        content,
        appId: APP_ID,
        ...(publicationType === LocalPublicationType.DRIVE && {
          attributes: [
            {
              key: GEO_JSON_ATTRIBUTE_KEY,
              value: JSON.stringify(getRandomGeoJsonLineString()),
              type: MetadataAttributeType.JSON,
            },
            {
              key: DRIVING_DURATION_ATTRIBUTE_KEY,
              value: getRandomNumber(1, 18000).toString(), // 1 to 5 hours
              type: MetadataAttributeType.NUMBER,
            },
            {
              key: DRIVING_DISTANCE_ATTRIBUTE_KEY,
              value: getRandomNumber(1, 400).toString(), // 1 to 400 km
              type: MetadataAttributeType.NUMBER,
            },
          ],
        }),
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
      stopLoading();
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
    <Dialog
      key={`modal-${publicationType}`}
      open={showCreatePostModal}
      onOpenChange={setShowCreatePostModal}
    >
      <Card className="relative w-full">
        <CardContent className="pt-6">
          <DialogTrigger className="w-full">
            <div className="inline-flex h-10 w-full items-center justify-start rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background hover:bg-accent hover:text-accent-foreground">
              {PublicationCardContent[publicationType].icon}
              {PublicationCardContent[publicationType].title}
            </div>
          </DialogTrigger>
        </CardContent>
      </Card>
      <CreatePublicationModal
        key={`create-${publicationType}-publication-modal`}
        createPublicationHandler={createPublicationHandler}
        publicationType={publicationType}
      />
    </Dialog>
  );
};

export default CreatePublicationCard;
