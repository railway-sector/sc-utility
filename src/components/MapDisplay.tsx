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
  pierNoLayer,
  chainageLayer,
  utilityPointLayer,
  utilityLineLayer1,
  lagunaLakeRoadNetworkLayer,
  ngcp_permanentRelo_GroupLayer,
  ngcp_site7_GroupLayer,
  ngcp_site6_GroupLayer,
} from "../layers";
import type { ArcgisScene } from "@arcgis/map-components/dist/components/arcgis-scene";
import type { ArcgisSearch } from "@arcgis/map-components/components/arcgis-search";

function MapDisplay() {
  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
  const arcgisSearch = document.querySelector("arcgis-search") as ArcgisSearch;

  arcgisScene?.viewOnReady(() => {
    arcgisScene?.map?.add(lagunaLakeRoadNetworkLayer);
    arcgisScene?.map?.add(ngcp_permanentRelo_GroupLayer);
    arcgisScene?.map?.add(ngcp_site7_GroupLayer);
    arcgisScene?.map?.add(ngcp_site6_GroupLayer);

    arcgisScene?.map?.add(alignmentGroupLayer);
    arcgisScene?.map?.add(utilityGroupLayer);
    arcgisScene?.map?.add(stationLayer);

    arcgisScene.hideAttribution = true;
    arcgisScene.view.environment.atmosphereEnabled = false;
    arcgisScene.view.environment.starsEnabled = false;

    if (arcgisScene?.map?.ground) {
      arcgisScene.map.ground.navigationConstraint = { type: "none" };
      arcgisScene.map.ground.opacity = 0.7;
    }

    const sources: any = [
      {
        layer: pierNoLayer,
        searchFields: ["PierNumber"],
        displayField: "PierNumber",
        exactMatch: false,
        outFields: ["PierNumber"],
        name: "Pier No",
        zoomScale: 1000,
        placeholder: "example: P-288",
      },
      {
        layer: chainageLayer,
        searchFields: ["KmSpot"],
        displayField: "KmSpot",
        exactMatch: false,
        outFields: ["*"],
        zoomScale: 1000,
        name: "Main KM",
        placeholder: "example: 80+400",
      },
      {
        layer: utilityPointLayer,
        searchFields: ["Id"],
        displayField: "Id",
        exactMatch: false,
        outFields: ["Id"],
        name: "Unique ID (Point)",
        placeholder: "example: MER0001-X01",
      },
      {
        layer: utilityLineLayer1,
        searchFields: ["Id"],
        displayField: "Id",
        exactMatch: false,
        outFields: ["Id"],
        name: "Unique ID (Line)",
        placeholder: "example: MER0001-X01",
      },
    ];
    arcgisSearch.allPlaceholder = "Pier Number, Chainage, Utility ID";
    arcgisSearch.includeDefaultSourcesDisabled = true;
    arcgisSearch.locationDisabled = true;
    arcgisSearch?.sources.push(...sources);
  });

  return (
    <arcgis-scene
      // item-id="5ba14f5a7db34710897da0ce2d46d55f"
      basemap="dark-gray-vector"
      ground="world-elevation"
      viewingMode="local"
      zoom={13}
      center="120.9793, 14.62"
    >
      <arcgis-compass slot="top-right"></arcgis-compass>
      <arcgis-expand close-on-esc slot="top-right" mode="floating">
        <arcgis-search></arcgis-search>
        {/* <arcgis-placement>
          <calcite-button>Placeholder</calcite-button>
        </arcgis-placement> */}
      </arcgis-expand>
      <arcgis-zoom slot="bottom-right"></arcgis-zoom>
    </arcgis-scene>
  );
}

export default MapDisplay;
