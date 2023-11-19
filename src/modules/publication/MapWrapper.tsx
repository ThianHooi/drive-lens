import React, { Suspense, lazy } from "react";
import dynamic from "next/dynamic";
import { type LatLngTuple } from "leaflet";
import { type GeoJsonLineString } from "~/types/geojson";

const MapContainer = dynamic(
  () =>
    import("react-leaflet").then((mod) => {
      return mod.MapContainer;
    }),
  { ssr: false },
);

const TileLayer = dynamic(
  () =>
    import("react-leaflet").then((mod) => {
      return mod.TileLayer;
    }),
  { ssr: false },
);

type MapWrapperProps = {
  geoJson: GeoJsonLineString;
};

const LazyMapRoute = lazy(async () => await import("./MapRoute"));

const MapWrapper = ({ geoJson }: MapWrapperProps) => {
  const { coordinates } = geoJson;

  const center = coordinates.reduce<LatLngTuple>(
    (acc, coord) => [
      acc[0] + coord[0] / coordinates.length,
      acc[1] + coord[1] / coordinates.length,
    ],
    [0, 0],
  );

  return (
    <Suspense fallback={<></>}>
      <MapContainer
        center={center}
        className="z-0 h-96 w-full rounded-md"
        zoom={12}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Suspense fallback={<></>}>
          <LazyMapRoute coordinates={geoJson.coordinates} />
        </Suspense>
      </MapContainer>
    </Suspense>
  );
};

export default MapWrapper;
