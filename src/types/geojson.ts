import { z } from "zod";

export const GeoJsonLineStringSchema = z.object({
  type: z.literal("LineString"),
  coordinates: z.array(z.tuple([z.number(), z.number()])),
});

export type GeoJsonLineString = z.infer<typeof GeoJsonLineStringSchema>;
