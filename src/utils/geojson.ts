import {
  type GeoJsonLineString,
  GeoJsonLineStringSchema,
} from "~/types/geojson";
import { DUMMY_DRIVING_JOURNEYS } from "~/constants";

export const isValidGeoJsonLineStringObject = (value: unknown) => {
  const parseResult = GeoJsonLineStringSchema.safeParse(value);

  return parseResult.success;
};

export const getRandomGeoJsonLineString = (): GeoJsonLineString => {
  const randomIndex = Math.floor(Math.random() * DUMMY_DRIVING_JOURNEYS.length);
  const randomObject = DUMMY_DRIVING_JOURNEYS[randomIndex]!;

  return randomObject;
};
