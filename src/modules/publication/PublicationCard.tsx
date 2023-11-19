import { type AnyPublicationFragment } from "@lens-protocol/client";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { getLensProfileInfo } from "~/utils/lens-profile";
import dynamic from "next/dynamic";
import {
  DRIVING_DISTANCE_ATTRIBUTE_KEY,
  DRIVING_DURATION_ATTRIBUTE_KEY,
  GEO_JSON_ATTRIBUTE_KEY,
} from "~/constants";
import MapWrapper from "./MapWrapper";
import { type GeoJsonLineString } from "~/types/geojson";
import { isValidGeoJsonLineStringObject } from "~/utils/geojson";
import PublicationActionMenu from "./PublicationActionMenu";
import { useLensAuth } from "../lens";
import { z } from "zod";
import { getDrivingDuration } from "~/utils/format";

const EditorMarkdown = dynamic(
  () =>
    import("@uiw/react-md-editor").then((mod) => {
      return mod.default.Markdown;
    }),
  { ssr: false },
);

type Props = {
  publication: AnyPublicationFragment;
};

type PostAvatarProps = {
  uri: string | null | undefined;
};

const PostAvatar = ({ uri }: PostAvatarProps) => {
  return (
    <Avatar>
      {uri && <AvatarImage src={uri} />}
      <AvatarFallback>
        <User className="h-4 w-4" />
      </AvatarFallback>
    </Avatar>
  );
};

const PublicationCard = ({ publication }: Props) => {
  const { profile } = useLensAuth();

  if (
    publication.__typename !== "Post" ||
    publication.metadata.__typename !== "TextOnlyMetadataV3"
  ) {
    return null;
  }

  const { profilePictureUri, handle, displayName } = getLensProfileInfo(
    publication.by,
  );

  const { attributes, content } = publication.metadata;

  const geoJsonAttribute = (attributes ?? []).find((attr) => {
    if (
      (attr.type as string) === "JSON" &&
      attr.key === GEO_JSON_ATTRIBUTE_KEY
    ) {
      return isValidGeoJsonLineStringObject(JSON.parse(attr.value) as unknown);
    }

    return false;
  });

  const drivingDurationAttribute = (attributes ?? []).find((attr) => {
    if (
      (attr.type as string) === "NUMBER" &&
      attr.key === DRIVING_DURATION_ATTRIBUTE_KEY
    ) {
      return z.number().safeParse(Number(attr.value)).success;
    }

    return false;
  });

  const drivingDistanceAttribute = (attributes ?? []).find((attr) => {
    if (
      (attr.type as string) === "NUMBER" &&
      attr.key === DRIVING_DISTANCE_ATTRIBUTE_KEY
    ) {
      return z.number().safeParse(Number(attr.value)).success;
    }

    return false;
  });

  return (
    <Card>
      <CardHeader className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-row items-center space-x-4">
          <PostAvatar uri={profilePictureUri} />
          <div className="flex flex-col">
            <span className="font-bold">{displayName}</span>
            <div className="flex flex-row space-x-2 text-sm">
              <span className="text-gray-500">@{handle}</span>
              <span>&#x2022;</span>
              <span className="text-gray-500">
                {new Date(publication.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {profile?.id === publication.by.id && (
          <PublicationActionMenu publicationId={publication.id} />
        )}
      </CardHeader>
      <CardContent className="flex flex-col space-y-4">
        <EditorMarkdown
          wrapperElement={{
            "data-color-mode": "light",
          }}
          source={content}
        />
        {!!geoJsonAttribute && (
          <MapWrapper
            geoJson={JSON.parse(geoJsonAttribute.value) as GeoJsonLineString}
          />
        )}
        {!!drivingDurationAttribute || !!drivingDistanceAttribute ? (
          <div className="flex w-full flex-row justify-between">
            <div className="flex flex-col space-y-1">
              <span className="items-center text-sm italic text-slate-500">
                Distance 🏎️
              </span>
              <span className="font-bold italic">
                {drivingDistanceAttribute?.value} km
              </span>
            </div>

            <div className="flex flex-col space-y-1">
              <span className="items-center text-sm italic text-slate-500">
                Duration ⏱️
              </span>
              <span className="font-bold italic">
                {getDrivingDuration(drivingDurationAttribute?.value)}
              </span>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default PublicationCard;
