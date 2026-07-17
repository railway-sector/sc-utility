import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GroupLayer from "@arcgis/core/layers/GroupLayer";
import SceneLayer from "@arcgis/core/layers/SceneLayer";
import {
  utilp_renderer,
  utilp2_renderer,
  utilp2_label,
  util_popup,
  utilLineRenderer,
  utill2_line_label,
  via_renderer,
  via_popup,
  ngcp6_point_renderer,
  ngcp6_line_renderer,
  ngcp7_point_renderer,
  ngcp_perm_point_renderer,
  ngcp7_line_renderer,
  ncgp_perm_line_renderer,
  lagnal_road_renderer,
} from "./uniqueValues";

import {
  portalItems,
  label_chainage,
  chainage_renderer,
  stationbox_renderer,
  prow_renderer,
  label_stationp,
  pierhead_renderer,
  pier_access_label,
  cp_breakline_renderer,
  substation_renderer,
} from "./uniqueValues";

//----------------------------------------------//
//            Alignment Layers                  //
//----------------------------------------------//
//--- STATION LAYER ---//
export const stationLayer = new FeatureLayer({
  portalItem: portalItems("e09b9af286204939a32df019403ef438"),
  layerId: 6,
  title: "SC Stations",
  labelingInfo: [label_stationp],
  elevationInfo: { mode: "relative-to-ground" },
});
stationLayer.listMode = "hide";

//--- CHAINAGE LAYER ---//
export const chainageLayer = new FeatureLayer({
  portalItem: portalItems("e09b9af286204939a32df019403ef438"),
  layerId: 2,
  title: "Chainage",
  elevationInfo: { mode: "relative-to-ground" },
  labelingInfo: [label_chainage],
  minScale: 150000,
  maxScale: 0,
  renderer: chainage_renderer,
  popupEnabled: false,
});

//--- STATION BOX LAYER ---//
export const stationBoxLayer = new FeatureLayer({
  portalItem: portalItems("e09b9af286204939a32df019403ef438"),
  layerId: 7,
  renderer: stationbox_renderer,
  minScale: 150000,
  maxScale: 0,
  title: "Station Box",
  popupEnabled: false,
  elevationInfo: { mode: "on-the-ground" },
});

//--- PIER HEAD & COLUMN LAYER ---//
export const pierHeadColumnLayer = new FeatureLayer({
  portalItem: portalItems("e09b9af286204939a32df019403ef438"),
  layerId: 4,
  title: "Pile Cap/Column",
  definitionExpression: "Layer <> 'Pier_Head'",
  minScale: 150000,
  maxScale: 0,
  renderer: pierhead_renderer,
  popupEnabled: false,
  elevationInfo: { mode: "on-the-ground" },
});

//--- PIER ACCESS POINT LAYER ---//
export const pierAccessLayer = new FeatureLayer({
  portalItem: portalItems("e09b9af286204939a32df019403ef438"),
  layerId: 3,
  labelingInfo: [pier_access_label], // [pierAccessReadyDateLabel, pierAccessNotYetLabel, pierAccessDateMissingLabel], //[pierAccessDateMissingLabel, pierAccessReadyDateLabel, pierAccessNotYetLabel],
  title: "Pier Number", //'Pier with Access Date',
  minScale: 150000,
  maxScale: 0,
  popupEnabled: false,
  elevationInfo: { mode: "on-the-ground" },
});

//--- CP BREAKLINE LAYER ---//
export const cp_break_lines = new FeatureLayer({
  portalItem: portalItems("1a2be501a0f54e048a7200e482eb0dd5"),
  title: "CP Break Line",
  renderer: cp_breakline_renderer,
  popupEnabled: false,
  elevationInfo: { mode: "on-the-ground" },
});

//--- SC SUBSTATION LAYER ---//
export const substationLayer = new FeatureLayer({
  portalItem: portalItems("fd0fd77c428b4fae8f47ac46b26614ec"),
  layerId: 61,
  renderer: substation_renderer,
  popupEnabled: false,
  labelsVisible: false,
  title: "Substation",
  elevationInfo: { mode: "on-the-ground" },
});

//--- PROW LAYER ---//
export const prowLayer = new FeatureLayer({
  url: "https://gis.railway-sector.com/server/rest/services/SC_Alignment/FeatureServer/5",
  layerId: 5,
  title: "PROW",
  popupEnabled: false,
  renderer: prow_renderer,
});

export const alignmentGroupLayer = new GroupLayer({
  title: "Alignment",
  visible: true,
  visibilityMode: "independent",
  layers: [
    pierHeadColumnLayer,
    stationBoxLayer,
    chainageLayer,
    pierAccessLayer,
    prowLayer,
  ],
});

//----------------------------------------------//
//                Other Layers                  //
//----------------------------------------------//
//--- DATES FEATURE TABLE ---//
export const dateTable = new FeatureLayer({
  portalItem: portalItems("b2a118b088a44fa0a7a84acbe0844cb2"),
});

//--- NGCP LAYERS SITE 6 ---//
export const ngcp_site6_poleLayer = new FeatureLayer({
  portalItem: portalItems("b7d01020d54c4015ba0ba9454475d1dc"),
  elevationInfo: { mode: "on-the-ground" },
  layerId: 1,
  title: "Pole",
  definitionExpression: "SiteNo = '6'",
  popupEnabled: false,
  renderer: ngcp6_point_renderer,
});

export const ngcp_site6_lineLayer = new FeatureLayer({
  portalItem: portalItems("b7d01020d54c4015ba0ba9454475d1dc"),
  elevationInfo: { mode: "on-the-ground" },
  layerId: 2,
  title: "Line",
  definitionExpression: "SiteNo = '6'",
  popupEnabled: false,
  renderer: ngcp6_line_renderer,
});

//--- NGCP LAYERS SITE 7 ---//
export const ngcp_site7_poleLayer = new FeatureLayer({
  portalItem: portalItems("b7d01020d54c4015ba0ba9454475d1dc"),
  elevationInfo: { mode: "on-the-ground" },
  layerId: 1,
  title: "Pole",
  definitionExpression: "SiteNo = '7'",
  popupEnabled: false,
  renderer: ngcp7_point_renderer,
});

export const ngcp_site7_lineLayer = new FeatureLayer({
  portalItem: portalItems("b7d01020d54c4015ba0ba9454475d1dc"),
  elevationInfo: { mode: "on-the-ground" },
  layerId: 2,
  title: "Line",
  definitionExpression: "SiteNo = '7'",
  popupEnabled: false,
  renderer: ngcp7_line_renderer,
});

//--- NGCP PERMANENT RELOCATION LAYER
export const ngcp_permanent_relo_poleLayer = new FeatureLayer({
  portalItem: portalItems("b7d01020d54c4015ba0ba9454475d1dc"),
  elevationInfo: { mode: "on-the-ground" },
  layerId: 4,
  title: "Pole",
  popupEnabled: false,
  renderer: ngcp_perm_point_renderer,
});

export const ngcp_permanent_relo_lineLayer = new FeatureLayer({
  portalItem: portalItems("b7d01020d54c4015ba0ba9454475d1dc"),
  elevationInfo: { mode: "on-the-ground" },
  layerId: 5,
  title: "Line",
  popupEnabled: false,
  renderer: ncgp_perm_line_renderer,
});

//--- LANGNAL LAKE ROAD NETWORK LAYER---//
export const lagunaLakeRoadNetworkLayer = new FeatureLayer({
  portalItem: portalItems("b7d01020d54c4015ba0ba9454475d1dc"),
  elevationInfo: { mode: "on-the-ground" },
  layerId: 3,
  title: "Laguna Lakeshore Road Network (LLRN) Project",
  popupEnabled: false,
  renderer: lagnal_road_renderer,
});

//--- NGCP GROUP LAYERS ---//
export const ngcp_site6_GroupLayer = new GroupLayer({
  title: "NGCP Layers Site 6",
  visible: true,
  visibilityMode: "independent",
  layers: [ngcp_site6_lineLayer, ngcp_site6_poleLayer],
});

export const ngcp_site7_GroupLayer = new GroupLayer({
  title: "NGCP Layers Site 7",
  visible: true,
  visibilityMode: "independent",
  layers: [ngcp_site7_lineLayer, ngcp_site7_poleLayer],
});

export const ngcp_permanentRelo_GroupLayer = new GroupLayer({
  title: "NGCP Permanent Relocation",
  visible: false,
  visibilityMode: "independent",
  layers: [ngcp_permanent_relo_lineLayer, ngcp_permanent_relo_poleLayer],
});

//---------------------------------------------//
//           Utility Relocation                //
//---------------------------------------------//
//--- UTILITY POINT LAYER 1 (Point Symbol) ---//
export const utilityPointLayer = new FeatureLayer({
  portalItem: portalItems("b7d01020d54c4015ba0ba9454475d1dc"),
  layerId: 1,
  title: "Point Symbol",
  renderer: utilp_renderer,
  elevationInfo: {
    mode: "relative-to-ground",
    featureExpressionInfo: { expression: "$feature.Height" },
    unit: "meters",
  },
  popupTemplate: util_popup,
});

//--- UTILITY POINT LAYER 2 (Point Status) ---//
export const utilityPointLayer1 = new FeatureLayer({
  portalItem: portalItems("b7d01020d54c4015ba0ba9454475d1dc"),
  layerId: 1,
  title: "Point Status",
  renderer: utilp2_renderer,
  elevationInfo: {
    mode: "relative-to-ground",
    featureExpressionInfo: { expression: "$feature.Height" },
    unit: "meters",
  },
  labelingInfo: [utilp2_label],
  popupTemplate: util_popup,
});

//--- UTILITY LINE LAYER 1 (LINE SYMBOL) ---//
export const utilityLineLayer = new FeatureLayer({
  portalItem: portalItems("b7d01020d54c4015ba0ba9454475d1dc"),
  layerId: 2,
  title: "Line Symbol",
  elevationInfo: {
    mode: "relative-to-ground",
    featureExpressionInfo: { expression: "$feature.height" },
    unit: "meters",
  },
  renderer: utilLineRenderer(),
  popupTemplate: util_popup,
});

//--- UTILITY LINE LAYER 2 (LINE STATUS) ---//
export const utilityLineLayer1 = new FeatureLayer({
  portalItem: portalItems("b7d01020d54c4015ba0ba9454475d1dc"),
  layerId: 2,
  title: "Line Status",
  elevationInfo: {
    mode: "relative-to-ground", // original was "relative-to-scene"
    featureExpressionInfo: { expression: "$feature.height" },
    unit: "meters",
  },
  renderer: utilp2_renderer,
  labelingInfo: [utill2_line_label],
  popupTemplate: util_popup,
});

export const utilityGroupLayer = new GroupLayer({
  title: "Utility Relocation",
  visible: false,
  visibilityMode: "independent",
  layers: [
    utilityLineLayer1,
    utilityLineLayer,
    utilityPointLayer1,
    utilityPointLayer,
  ],
});

export const utilityLayers: any = {
  Point: [utilityPointLayer, utilityPointLayer1],
  Line: [utilityLineLayer, utilityLineLayer1],
};

//--- VIADUCT MULTIPATCH LAYER ---//
export const viaductLayer = new SceneLayer({
  portalItem: portalItems("1f89733a04b443e2a1e0e5e6dfd493e3"),
  elevationInfo: { mode: "absolute-height" },
  title: "Viaduct",
  labelsVisible: false,
  renderer: via_renderer,
  popupTemplate: via_popup,
});

//---------------------------------------------//
//            Other Parameters                 //
//---------------------------------------------//
//--- SEARCH WIDGET
export const sources: any = [
  {
    layer: pierAccessLayer,
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
