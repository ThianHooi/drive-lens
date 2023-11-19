import dynamic from "next/dynamic";
import { type GeoJsonLineString } from "~/types/geojson";

type MapRouteProps = {
  coordinates: GeoJsonLineString["coordinates"];
};

const Polyline = dynamic(
  () =>
    import("react-leaflet").then((mod) => {
      return mod.Polyline;
    }),
  { ssr: false },
);

const MapRoute = ({ coordinates }: MapRouteProps) => {
  return (
    <Polyline
      pathOptions={{ color: "red" }}
      positions={coordinates}
      lineJoin="bevel"
    />
  );
};

export default MapRoute;
