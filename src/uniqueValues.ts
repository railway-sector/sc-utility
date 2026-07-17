import LineCallout3D from "@arcgis/core/symbols/callouts/LineCallout3D";
import LabelClass from "@arcgis/core/layers/support/LabelClass";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import TextSymbol3DLayer from "@arcgis/core/symbols/TextSymbol3DLayer";
import LabelSymbol3D from "@arcgis/core/symbols/LabelSymbol3D";
import SolidEdges3D from "@arcgis/core/symbols/edges/SolidEdges3D";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import PolygonSymbol3D from "@arcgis/core/symbols/PolygonSymbol3D";
import ExtrudeSymbol3DLayer from "@arcgis/core/symbols/ExtrudeSymbol3DLayer";
import PointSymbol3D from "@arcgis/core/symbols/PointSymbol3D";
import IconSymbol3DLayer from "@arcgis/core/symbols/IconSymbol3DLayer";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import CustomContent from "@arcgis/core/popup/content/CustomContent";
import PopupTemplate from "@arcgis/core/PopupTemplate";
import LineSymbol3D from "@arcgis/core/symbols/LineSymbol3D.js";
import PathSymbol3DLayer from "@arcgis/core/symbols/PathSymbol3DLayer.js";
import WebStyleSymbol from "@arcgis/core/symbols/WebStyleSymbol.js";
import SizeVariable from "@arcgis/core/renderers/visualVariables/SizeVariable.js";
import RotationVariable from "@arcgis/core/renderers/visualVariables/RotationVariable.js";
import MeshSymbol3D from "@arcgis/core/symbols/MeshSymbol3D.js";
import FillSymbol3DLayer from "@arcgis/core/symbols/FillSymbol3DLayer.js";
import { toAsofdate } from "./query";

//----------------------------------------------//
//              portalItem                      //
//----------------------------------------------//
const portalItem_url = { url: "https://gis.railway-sector.com/portal" };

export const portalItems = (id: any) => {
  return { id: id, portal: portalItem_url };
};

export const cpackages = [
  "All",
  "S-01",
  "S-02",
  "S-03a",
  "S-03b",
  "S-03c",
  "S-04",
  "S-05",
  "S-06",
  "S-07",
];

//----------------------------------------------//
//              Chart Parameters                //
//----------------------------------------------//
export const chart_width = "26vw";
export const chart_box_width = 250;

export const construction_status = [
  "To be Constructed",
  "Under Construction",
  "Completed",
];

// Chart and chart label color
export const primaryLabelColor = "#9ca3af";
export const valueLabelColor = "#d1d5db";

//----------------------------------------------//
//            Alignment Layers                  //
//----------------------------------------------//
//--- STATION LAYER ---//
export const label_stationp = new LabelClass({
  symbol: new LabelSymbol3D({
    symbolLayers: [
      new TextSymbol3DLayer({
        material: { color: "#d4ff33" },
        size: 15,
        halo: { color: "black", size: 0.5 },
      }),
    ],
    verticalOffset: {
      screenLength: 100,
      maxWorldLength: 700,
      minWorldLength: 80,
    },

    callout: {
      type: "line",
      color: [128, 128, 128, 0.5],
      size: 0.2,
      border: { color: "grey" },
    },
  }),
  labelPlacement: "above-center",
  labelExpressionInfo: { expression: "$feature.Station" },
});

//--- CHAINAGE LAYER ---//
export const label_chainage = new LabelClass({
  labelExpressionInfo: { expression: "$feature.KmSpot" },
  symbol: {
    type: "text",
    color: [85, 255, 0],
    haloColor: "black",
    haloSize: 0.5,
    font: { size: 15, weight: "bold" },
  },
});

export const chainage_renderer = new SimpleRenderer({
  symbol: new SimpleMarkerSymbol({
    size: 5,
    color: [255, 255, 255, 0.9],
    outline: { width: 0.2, color: "black" },
  }),
});

//--- STATION BOX LAYER ---//
export const stationbox_renderer = new UniqueValueRenderer({
  field: "Layer",
  uniqueValueInfos: [
    {
      value: "00_Platform",
      label: "Platform",
      symbol: new SimpleFillSymbol({
        color: [160, 160, 160],
        style: "backward-diagonal",
        outline: { width: 1, color: "black" },
      }),
    },
    {
      value: "00_Platform 10car",
      label: "Platform 10car",
      symbol: new SimpleFillSymbol({
        color: [104, 104, 104],
        style: "cross",
        outline: { width: 1, color: "black", style: "short-dash" },
      }),
    },
    {
      value: "00_Station",
      label: "Station Box",
      symbol: new SimpleFillSymbol({
        color: [0, 0, 0, 0],
        outline: { width: 2, color: [115, 0, 0] },
      }),
    },
  ],
});

//--- PIER HEAD & COLUMN LAYER ---//
const pHeight = 0;

const pier_column_symbol = new PolygonSymbol3D({
  symbolLayers: [
    new ExtrudeSymbol3DLayer({
      size: pHeight + 10,
      material: { color: [78, 78, 78, 0.5] },
      edges: new SolidEdges3D({ color: "#4E4E4E", size: 0.3 }),
    }),
  ],
});

const pilecap_symbol = new PolygonSymbol3D({
  symbolLayers: [
    new ExtrudeSymbol3DLayer({
      size: pHeight + 3,
      material: { color: [200, 200, 200, 0.7] },
      edges: new SolidEdges3D({ color: "#4E4E4E", size: 1.0 }),
    }),
  ],
});

export const pierhead_renderer = new UniqueValueRenderer({
  field: "Layer",
  legendOptions: { title: "Pile Cap/Column" },
  uniqueValueInfos: [
    { value: "Pier_Column", symbol: pier_column_symbol, label: "Column" },
    { value: "Pile_Cap", symbol: pilecap_symbol, label: "Pile Cap" },
  ],
});

//--- PIER ACCESS POINT LAYER ---//
export const pier_access_label = new LabelClass({
  symbol: new LabelSymbol3D({
    symbolLayers: [
      new TextSymbol3DLayer({
        material: { color: valueLabelColor },
        size: 15,
        font: { family: "Ubuntu Mono", weight: "bold" },
      }),
    ],
    verticalOffset: {
      screenLength: 80,
      maxWorldLength: 500,
      minWorldLength: 30,
    },
    callout: {
      type: "line",
      size: 0.5,
      color: [0, 0, 0],
      border: { color: [255, 255, 255, 0.7] },
    },
  }),
  labelExpressionInfo: { expression: "$feature.PierNumber" },
  labelPlacement: "above-center",
});

//--- CP BREAKLINE LAYER ---//
export const cp_breakline_renderer = new SimpleRenderer({
  symbol: new SimpleLineSymbol({ color: "#4ce600", width: "2px" }),
});

//--- SC SUBSTATION LAYER ---//
export const substation_renderer = new SimpleRenderer({
  symbol: new SimpleFillSymbol({
    color: [115, 178, 255],
    style: "backward-diagonal",
    outline: { color: "#004DA8", width: 1.5 },
  }),
});

//--- PROW LAYER ---//
// ORIGINAL (DEFAULT)
export const prow_renderer = new SimpleRenderer({
  symbol: new SimpleLineSymbol({ color: "#ff0000", width: "2px" }),
});

//----------------------------------------------//
//                Other Layers                  //
//----------------------------------------------//
//--- NGCP LAYER SITE 6---//
export const ngcp6_line_renderer = new SimpleRenderer({
  symbol: new SimpleLineSymbol({
    color: "#FFFF00",
    width: "3px",
    style: "dash",
  }),
});

export const ngcp6_point_renderer = new SimpleRenderer({
  symbol: new SimpleMarkerSymbol({
    size: 11,
    color: "#FFFF00",
    outline: { width: 1.5, color: "grey" },
  }),
});

//--- NGCP LAYER SITE 7---//
export const ngcp7_line_renderer = new SimpleRenderer({
  symbol: new SimpleLineSymbol({
    color: "#55FF00",
    width: "3px",
    style: "dash",
  }),
});

export const ngcp7_point_renderer = new SimpleRenderer({
  symbol: new SimpleMarkerSymbol({
    size: 11,
    color: "#55FF00",
    outline: { width: 1.5, color: "grey" },
  }),
});

//--- NGCP PERMANENT RELOCATION LAYER---//
export const ngcp_perm_point_renderer = new SimpleRenderer({
  symbol: new SimpleMarkerSymbol({
    size: 11,
    color: "#FF5500",
    outline: { width: 1.5, color: "grey" },
  }),
});

export const ncgp_perm_line_renderer = new SimpleRenderer({
  symbol: new SimpleLineSymbol({
    color: "#FF5500",
    width: "3px",
    style: "dash",
  }),
});

//--- LANGNAL LAKE ROAD NETWORK LAYER---//
export const lagnal_road_renderer = new SimpleRenderer({
  symbol: new SimpleFillSymbol({
    color: [0, 0, 0, 0],
    outline: { width: 2, color: "#cccccc", style: "short-dash" },
  }),
});

//---------------------------------------------//
//             Utility Relocation              //
//---------------------------------------------//
//--- Utility Fields
export const cp_f = "CP";
export const util_status_f = "Status";
export const util_dtype_f = "Type";
export const util_comp_f = "Company";
export const util_remark_f = "Remarks";
export const util_id_f = "Id";
export const util_layer_f = "LAYER";
export const util_height_f = "Height";
export const util_type_f = "UtilType";

export const util_type_icons = [
  "https://EijiGorilla.github.io/Symbols/Telecom_Logo2.svg",
  "https://EijiGorilla.github.io/Symbols/Water_Logo2.svg",
  "https://EijiGorilla.github.io/Symbols/Sewage_Logo2.svg",
  "https://EijiGorilla.github.io/Symbols/Power_Logo2.svg",
  "https://EijiGorilla.github.io/Symbols/Gas_Logo2.svg",
];

export const util_types = [
  { value: 1, category: "Telecom", icon: util_type_icons[0] },
  { value: 2, category: "Water", icon: util_type_icons[1] },
  { value: 3, category: "Sewage", icon: util_type_icons[2] },
  { value: 4, category: "Power", icon: util_type_icons[3] },
  { value: 5, category: "Oil & Gas", icon: util_type_icons[4] },
];

export const util_status_q = [
  { value: 0, status: "incomp", color: "#000000" },
  { value: 1, status: "comp", color: "#0070ff" },
];

//--- UtilityType2 parameters
export const utilityType2Field = "UtilType2";

//--- COMMON PARAMETERS ---//
//--- Label definition
interface labelSymbol3DProps {
  materialColor: any;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: "normal" | "bold";
  haloColor?: any;
  haloSize?: number;
  vOffsetScreenLength?: number;
  vOffsetMaxWorldLength?: number;
  vOffsetMinWorldLength?: number;
  calloutType?: number;
  calloutColor?: any;
  calloutSize?: number;
  calloutBorderColor?: any;
}

export const utilLabelSymbol3D = ({
  materialColor,
  fontSize,
  fontFamily,
  fontWeight,
  haloColor,
  haloSize,
  vOffsetScreenLength,
  vOffsetMaxWorldLength,
  vOffsetMinWorldLength,
  calloutColor,
  calloutSize,
  calloutBorderColor,
}: labelSymbol3DProps) => {
  const labelSymbol3D = new LabelSymbol3D({
    symbolLayers: [
      new TextSymbol3DLayer({
        material: { color: materialColor },
        size: fontSize,
        font: { family: fontFamily, weight: fontWeight },
        halo: { color: haloColor, size: haloSize },
      }),
    ],
    verticalOffset: {
      screenLength: vOffsetScreenLength,
      maxWorldLength: vOffsetMaxWorldLength,
      minWorldLength: vOffsetMinWorldLength,
    },
    callout: new LineCallout3D({
      color: calloutColor,
      size: calloutSize,
      border: { color: calloutBorderColor },
    }),
  });

  return labelSymbol3D;
};

//-- Utility Status Maps
const util_status_map: UtilityStatusEntry[] = [
  {
    value: "DemolishComplete",
    label: "Demolision Completed",
    status: 1,
    layer: 1,
    iconUrl: "https://EijiGorilla.github.io/Symbols/DemolishComplete_v2.png",
    color: "#D13470",
    size: 25,
  },
  {
    value: "DemolishIncomplete",
    label: "To be Demolished",
    status: 0,
    layer: 1,
    iconUrl: "https://EijiGorilla.github.io/Symbols/Demolished.png",
    color: "#D13470",
    size: 20,
  },
  {
    value: "RelocIncomplete",
    label: "Proposed Relocation",
    status: 0,
    layer: 2,
    iconUrl: "https://EijiGorilla.github.io/Symbols/Relocatd.png",
    color: "#D13470",
    size: 30,
  },
  {
    value: "RelocComplete",
    label: "Relocation Completed",
    status: 1,
    layer: 2,
    iconUrl:
      "https://EijiGorilla.github.io/Symbols/Utility_Relocated_Completed_Symbol.png",
    color: "#D13470",
    size: 30,
  },
  {
    value: "NewlyAdded",
    label: "Add New Utility",
    status: 0,
    layer: 3,
    iconUrl: "https://EijiGorilla.github.io/Symbols/NewlyAdded.png",
    color: "#D13470",
    size: 35,
  },
  {
    value: "NewlyAddedComplete",
    label: "Newly Utility Added",
    status: 1,
    layer: 3,
    iconUrl: "https://EijiGorilla.github.io/Symbols/NewlyAdded_Completed.png",
    color: "#D13470",
    size: 35,
  },
];

//--- Popup
// Point popup
export const util_popup = {
  title: "<div style='color: #eaeaea'>{comp_agency}</div>",
  lastEditInfoEnabled: false,
  returnGeometry: true,
  content: [
    {
      type: "fields",
      fieldInfos: [
        { fieldName: "Id" },
        { fieldName: "UtilType", label: "Utility Type" },
        { fieldName: "UtilType2", label: "Utility Name" },
        { fieldName: "LAYER", label: "<h5>Action</h5>" },
        { fieldName: "Status", label: "<h5>Status</h5>" },
        { fieldName: "CP" },
        { fieldName: "Remarks" },
      ],
    },
  ],
};

//--- UTILITY POINT LAYER 1 (Point Symbol) ---//
//--- Point Symbol
function utilCustomSymbol3D(name: string) {
  return new WebStyleSymbol({
    styleUrl:
      "https://www.maps.arcgis.com/sharing/rest/content/items/c04d4d4145f64f8fa38407dd5331dd1f/data",
    name: name,
  });
}

function utilPtSymbolInfra(name: string) {
  return new WebStyleSymbol({
    name: name,
    styleName: "EsriInfrastructureStyle",
  });
}

function utilPtSymbolStreet(name: string) {
  return new WebStyleSymbol({
    name: name,
    styleName: "EsriRealisticStreetSceneStyle",
  });
}

const util_v_offset = {
  screenLength: 10,
  maxWorldLength: 30,
  minWorldLength: 35,
};

// Utility Point symbol creator
type UtilTypeEntry = {
  code: number;
  label: string;
  symbol?: () => any; // omit if no symbol is defined for this type
};

const utilp_type_map: UtilTypeEntry[] = [
  {
    code: 1,
    label: "Telecom Pole (BTS)",
    symbol: () => utilCustomSymbol3D("3D_Telecom_BTS"),
  },
  {
    code: 2,
    label: "Telecom Pole (CATV)",
    symbol: () => utilCustomSymbol3D("3D_TelecomCATV_Pole"),
  },
  { code: 3, label: "Water Meter" }, // no symbol defined
  { code: 4, label: "Water Valve" }, // no symbol defined
  {
    code: 5,
    label: "Manhole",
    symbol: () => utilPtSymbolStreet("Storm_Drain"),
  },
  { code: 6, label: "Drain Box" }, // no symbol defined
  {
    code: 7,
    label: "Electric Pole",
    symbol: () => utilCustomSymbol3D("3D_Electric_Pole"),
  },
  {
    code: 8,
    label: "Street Light",
    symbol: () =>
      utilPtSymbolStreet("Overhanging_Street_and_Sidewalk_-_Light_on"),
  },
  {
    code: 9,
    label: "Junction Box",
    symbol: () => utilCustomSymbol3D("3D_Drain_Box"),
  },
  {
    code: 10,
    label: "Coupling",
    symbol: () => utilCustomSymbol3D("3D_Drain_Box"),
  },
  {
    code: 11,
    label: "Fitting",
    symbol: () => utilCustomSymbol3D("3D_Drain_Box"),
  },
  {
    code: 12,
    label: "Transformer",
    symbol: () => utilCustomSymbol3D("3D_Drain_Box"),
  },
  {
    code: 13,
    label: "Truss Guy",
    symbol: () => utilCustomSymbol3D("3D_Drain_Box"),
  },
  {
    code: 14,
    label: "Concrete Pedestal",
    symbol: () => utilCustomSymbol3D("Concrete Pedestal"),
  },
  {
    code: 15,
    label: "Ground",
    symbol: () => utilCustomSymbol3D("3D_Drain_Box"),
  },
  {
    code: 16,
    label: "Down Guy",
    symbol: () => utilCustomSymbol3D("3D_Drain_Box"),
  },
  {
    code: 17,
    label: "Entry/Exit Pit",
    symbol: () => utilCustomSymbol3D("3D_Drain_Box"),
  },
  {
    code: 18,
    label: "Handhole",
    symbol: () => utilCustomSymbol3D("3D_Drain_Box"),
  },
  {
    code: 19,
    label: "Transmission Tower",
    symbol: () => utilPtSymbolInfra("Powerline_Pole"),
  },
];

// Build the Arcade expression from the map
const utilp1_condition = utilp_type_map
  .map((entry) => `$feature.UtilType2 == ${entry.code}, '${entry.label}'`)
  .join(", ");

const valueExpression = `When(${utilp1_condition}, $feature.UtilType)`;

// Build uniqueValueInfos only from entries that have a symbol
const utilp_uniqueV = utilp_type_map
  .filter((entry) => entry.symbol)
  .map((entry) => ({ value: entry.label, symbol: entry.symbol!() }));

// Point symbol renderer
export const utilp_renderer = new UniqueValueRenderer({
  valueExpression,
  uniqueValueInfos: utilp_uniqueV,
  visualVariables: [
    new SizeVariable({ axis: "height", field: "SIZE", valueUnit: "meters" }),
    new RotationVariable({ field: "ROTATION" }),
  ],
});

//--- UTILITY POINT LAYER 2 (Point Status) ---//
// Status Labels
const utilp2_text_symbol = utilLabelSymbol3D({
  materialColor: "white",
  fontSize: 10,
  haloColor: [0, 0, 0, 0.7],
  haloSize: 0.4,
});

export const utilp2_label = new LabelClass({
  labelPlacement: "above-center",
  labelExpressionInfo: {
    expression:
      "When($feature.Status >= 0, DomainName($feature, 'Comp_Agency'), '')", //$feature.Comp_Agency
  },
  symbol: utilp2_text_symbol,
});

// Status Symbol
function utilStatusSymbol(name: string, color: any, sizeS: number) {
  return new PointSymbol3D({
    symbolLayers: [
      new IconSymbol3DLayer({
        resource: { href: name },
        size: sizeS,
        outline: { color: color, size: 2 },
      }),
    ],

    verticalOffset: util_v_offset,

    callout: {
      type: "line", // autocasts as new LineCallout3D()
      color: [128, 128, 128, 0.1],
      size: 0.2,
      border: { color: "grey" },
    },
  });
}

type UtilityStatusEntry = {
  value: string;
  label: string;
  status?: number; // omitted for the special "pending" case
  layer?: number;
  iconUrl: string;
  color: string;
  size: number;
};

// Special case: "pending" remarks always maps to NoAction, checked first
const noActionEntry: UtilityStatusEntry = {
  value: "NoAction",
  label: "Require Data Checking",
  iconUrl: "https://EijiGorilla.github.io/Symbols/Unknown_v2.png",
  color: "#D13470",
  size: 35,
};

// Build the Arcade expression: pending check first, then status/layer pairs, fallback to Comp_Agency
const utilp2_con = util_status_map
  .map(
    (entry) =>
      `$feature.Status == ${entry.status} && $feature.LAYER == ${entry.layer}, '${entry.value}'`,
  )
  .join(", ");

const utilp2_qe = `When($feature.Remarks == 'pending', '${noActionEntry.value}', ${utilp2_con}, $feature.Comp_Agency)`;

// Build uniqueValueInfos from the same map, plus the NoAction entry
const utilp2_uniqueV = [...util_status_map, noActionEntry].map((entry) => ({
  value: entry.value,
  label: entry.label,
  symbol: utilStatusSymbol(entry.iconUrl, entry.color, entry.size),
}));

export const utilp2_renderer = new UniqueValueRenderer({
  valueExpression: utilp2_qe,
  uniqueValueInfos: utilp2_uniqueV,
});

//--- UTILITY LINE LAYER 1 (LINE SYMBOL) ---//
const utill_symbol_q = [
  { code: 1, color: [32, 178, 170, 0.5], label: "Telecom Line" },
  { code: 2, color: [112, 128, 144, 0.5], label: "Internet Cable Line" },
  { code: 3, color: [0, 128, 255, 0.5], label: " Water Distribution Pipe" },
  { code: 4, color: [224, 224, 224, 0.5], label: "Sewage" },
  { code: 5, color: [105, 105, 105, 0.5], label: "Drainage" },
  { code: 6, color: [205, 133, 63, 0.5], label: "Canal" },
  { code: 7, color: [139, 69, 19, 0.5], label: "Creek" },
  { code: 8, color: [211, 211, 211, 0.5], label: "Electric Line" },
  { code: 9, color: [0, 128, 255, 0.5], label: "Duct Bank" },
  { code: 10, color: [0, 128, 255, 0.5], label: "Water line" },
  { code: 11, color: [0, 128, 255, 0.5], label: "Gas Line" },
];

function utilLineSizeSymbol(
  profile: "circle" | "quad" | undefined,
  cap: "round" | "none" | "butt" | "square" | undefined,
  join: "round" | "miter" | "bevel" | undefined,
  width: number,
  height: number,
  profileRotation: "heading" | "all" | undefined,
  col: any,
) {
  return new LineSymbol3D({
    symbolLayers: [
      new PathSymbol3DLayer({
        profile: profile,
        material: { color: col },
        width: width,
        height: height,
        join: join,
        cap: cap,
        anchor: "bottom",
        profileRotation: profileRotation,
      }),
    ],
  });
}

export const utilLineRenderer = () => {
  const renderer = new UniqueValueRenderer({ field: "utiltype2" });

  utill_symbol_q.map((item: any) => {
    renderer.addUniqueValueInfo({
      value: item.code,
      symbol: utilLineSizeSymbol(
        "circle",
        "none",
        "miter",
        0.5,
        0.5,
        "all",
        item.color,
      ),
    });
  });
  return renderer;
};

//--- UTILITY LINE LAYER 2 (LINE STATUS) ---//
const utill2_text_symbol = utilLabelSymbol3D({
  materialColor: "black",
  fontSize: 10,
  haloColor: [255, 255, 255, 0.7],
  haloSize: 0.7,
});

export const utill2_line_label = new LabelClass({
  labelExpressionInfo: {
    expression:
      "When($feature.Status >= 0, DomainName($feature, 'Comp_Agency'), '')",
  },
  symbol: utill2_text_symbol,
});

//---------------------------------------------//
//             Viaduct Layer                   //
//---------------------------------------------//
export const via_type_f = "Type";
export const via_status_f = "Status";

//--- VIADUCT TYPES
const via_icons = [
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Pile_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Pilecap_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Pier_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Pierhead_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Precast_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Precast_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Precast_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Precast_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Precast_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Precast_Logo.svg",
];

export const viatypes_q = [
  { value: 1, category: "Bored Pile", icon: via_icons[0] },
  { value: 2, category: "Pile Cap", icon: via_icons[1] },
  { value: 3, category: "Pier", icon: via_icons[2] },
  { value: 4, category: "Pier Head", icon: via_icons[3] },
  { value: 5, category: "Precast", icon: via_icons[4] },
  { value: 6, category: "Cantillever", icon: via_icons[5] },
  { value: 7, category: "At-Grade", icon: via_icons[6] },
  { value: 8, category: "Noise Barrier", icon: via_icons[7] },
  { value: 9, category: "Bridge", icon: via_icons[8] },
  { value: 10, category: "Others", icon: via_icons[9] },
];

//--- VIADUCT STATUS
export const viastatus_q: any = [
  {
    value: 1,
    status: "incomp",
    label: "To be Constructed",
    color: "#000000",
    rgb: [225, 225, 225, 0.1],
  },
  {
    value: 2,
    status: "ongoing",
    label: "Under Construction",
    color: "#f7f7f7ff",
    rgb: [211, 211, 211, 0.5],
  },
  {
    value: 3,
    status: "delayed",
    label: "Delayed",
    color: "#FF0000",
    rgb: [255, 0, 0, 0.8],
  },
  {
    value: 4,
    status: "comp",
    label: "Completed",
    color: "#0070ff",
    rgb: [0, 112, 255, 0.8],
  },
];

const via_uniqueV = [1, 2, 4].map((v: any) => {
  return {
    value: v,
    label: viastatus_q.find((f: any) => f.value === v)?.label,
    symbol: new MeshSymbol3D({
      symbolLayers: [
        new FillSymbol3DLayer({
          material: {
            color: viastatus_q.find((f: any) => f.value === v)?.rgb,
            colorMixMode: "replace",
          },
          edges: new SolidEdges3D({ color: [225, 225, 225, 0.3] }),
        }),
      ],
    }),
  };
});

export const via_renderer = new UniqueValueRenderer({
  field: "Status",
  uniqueValueInfos: via_uniqueV,
});

//--- POPUP
const highlight = (value: unknown) =>
  `<span style="color: #d9dc00ff; font-weight: bold">${value}</span>`;

const via_customContentLot = new CustomContent({
  outFields: ["*"],
  creator: (event: any) => {
    const attrs = event.graphic.attributes;
    const cps = attrs[cp_f];
    const status = attrs[via_status_f];
    const type = attrs["Types"] ?? attrs["Type"];

    //-- Dates
    const start_date = toAsofdate(new Date(attrs["start_actual"]));
    const planned_date = toAsofdate(new Date(attrs["finish_plan"]));
    const end_date = toAsofdate(new Date(attrs["finish_actual"]));
    const typeV = viatypes_q.find((f: any) => f.value === type)?.category;
    const statusL = viastatus_q.filter((f: any) => f.value === status)[0]
      ?.label;

    return `
    <div style='line-height: 1.7'>
        <style>
        .lbl { padding: 2px 8px 2px 3px; font-weight: bold; }
      </style>
    <table style='border-collapse: collapse;'>
        <tr><td class='lbl'>Contract Package:</td><td>${highlight(cps)}</td></tr>
        <tr><td class='lbl'>Types:</td><td>${highlight(typeV)}</td></tr>
        <tr><td class='lbl'>Status:</td><td>${highlight(statusL ?? "")}</td></tr>
        <tr><td class='lbl'>Start Date:</td><td>${highlight(start_date ?? "")}</td></tr>
        <tr><td class='lbl'>Planned Date:</td><td>${highlight(planned_date ?? "")}</td></tr>
        <tr><td class='lbl'>End Date:</td><td>${highlight(end_date ?? "")}</td></tr>
      </table>
    </div>
              `;
  },
});

export const via_popup = new PopupTemplate({
  title: "<div style='color: #eaeaea'>Pier Number: <b>{PierNumber}</b></div>",
  lastEditInfoEnabled: false,
  content: [via_customContentLot],
});

//---------------------------------------------//
//              Layer List                     //
//---------------------------------------------//
export async function defineActions(event: any) {
  const { item } = event;
  if (item.layer.type !== "group") {
    item.panel = { content: "legend", open: true };
  }
  item.title === "Chainage" ||
  item.title === "Viaduct" ||
  item.title === "Pier No"
    ? (item.visible = false)
    : (item.visible = true);
}
