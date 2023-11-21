import { type DAppMetaData } from "@thirdweb-dev/wallets";
import { type GeoJsonLineString } from "./types/geojson";
import { MissionType } from "./modules/mission/providers/types";

export const dAPP_METADATA: DAppMetaData = {
  name: "Mazda x Lens",
  description: "Connecting Mazda owners with Lens",
  isDarkMode: false,
  url: "",
};

export const APP_ID = "mazda-x-lens";

export const GEO_JSON_ATTRIBUTE_KEY = `${APP_ID}:geojson`;
export const DRIVING_DISTANCE_ATTRIBUTE_KEY = `${APP_ID}:driving-distance`;
export const DRIVING_DURATION_ATTRIBUTE_KEY = `${APP_ID}:driving-duration`;

export const MISSION_TO_NFT_ID = {
  [MissionType.FIRST_POST]: "0",
  [MissionType.FIRST_COMMENT]: "1",
};

export const DUMMY_DRIVING_JOURNEYS: GeoJsonLineString[] = [
  {
    type: "LineString",
    coordinates: [
      [35.6895, 139.6917],
      [35.709, 139.7671],
      [35.6895, 139.7917],
      [35.7126, 139.7748],
      [35.6528, 139.8395],
    ],
  },
  {
    type: "LineString",
    coordinates: [
      [35.6528, 139.8395],
      [35.6895, 139.7748],
      [35.709, 139.7917],
      [35.6895, 139.7671],
      [35.6917, 139.6917],
    ],
  },
  {
    type: "LineString",
    coordinates: [
      [35.6895, 139.6917],
      [35.7126, 139.7748],
      [35.7917, 139.7917],
      [35.709, 139.7671],
      [35.6528, 139.8395],
    ],
  },
  {
    type: "LineString",
    coordinates: [
      [35.6528, 139.8395],
      [35.7748, 139.7126],
      [35.7917, 139.6917],
      [35.7671, 139.7671],
      [35.6895, 139.6528],
    ],
  },
  {
    type: "LineString",
    coordinates: [
      [35.7671, 139.7671],
      [35.7917, 139.7126],
      [35.6528, 139.6528],
      [35.6895, 139.7748],
      [35.709, 139.8395],
    ],
  },
];
