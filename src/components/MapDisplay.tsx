import "../index.css";
import "@arcgis/map-components/dist/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";
import "@arcgis/map-components/components/arcgis-basemap-gallery";
import "@arcgis/map-components/components/arcgis-layer-list";
import "@arcgis/map-components/components/arcgis-expand";
import "@arcgis/map-components/components/arcgis-search";
import "@arcgis/map-components/components/arcgis-compass";
import {
  stationLayer,
  alignmentGroupLayer,
  utilityGroupLayer,
  lagunaLakeRoadNetworkLayer,
  ngcp_permanentRelo_GroupLayer,
  ngcp_site7_GroupLayer,
  ngcp_site6_GroupLayer,
  viaductLayer,
  sources,
} from "../layers";
import type { ArcgisScene } from "@arcgis/map-components/dist/components/arcgis-scene";
import type { ArcgisSearch } from "@arcgis/map-components/components/arcgis-search";
import { useState } from "react";
import { addLayersToMap } from "../query";

function MapDisplay() {
  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
  const arcgisSearch = document.querySelector("arcgis-search") as ArcgisSearch;
  const [_mapView, setMapView] = useState<any>();

  arcgisScene?.viewOnReady(() => {
    addLayersToMap(arcgisScene?.map, [
      viaductLayer,
      lagunaLakeRoadNetworkLayer,
      ngcp_permanentRelo_GroupLayer,
      ngcp_site7_GroupLayer,
      ngcp_site6_GroupLayer,
      alignmentGroupLayer,
      utilityGroupLayer,
      stationLayer,
    ]);

    arcgisScene.hideAttribution = true;
    arcgisScene.view.environment.atmosphereEnabled = false;
    arcgisScene.view.environment.starsEnabled = false;

    if (arcgisScene?.map?.ground) {
      arcgisScene.map.ground.navigationConstraint = { type: "none" };
      arcgisScene.map.ground.opacity = 0.7;
    }

    arcgisSearch.allPlaceholder = "Pier Number, Chainage, Utility ID";
    arcgisSearch.includeDefaultSourcesDisabled = true;
    arcgisSearch.locationDisabled = true;
    arcgisSearch?.sources.push(...sources);
  });

  return (
    <arcgis-scene
      basemap="dark-gray-vector"
      ground="world-elevation"
      viewingMode="local"
      zoom={13}
      center="120.9793, 14.62"
      onarcgisViewReadyChange={(event: any) => {
        setMapView(event.target.id);
      }}
    >
      <arcgis-compass slot="top-right"></arcgis-compass>
      <arcgis-expand close-on-esc slot="top-right" mode="floating">
        <arcgis-search></arcgis-search>
      </arcgis-expand>
      <arcgis-zoom slot="bottom-right"></arcgis-zoom>
    </arcgis-scene>
  );
}

export default MapDisplay;
