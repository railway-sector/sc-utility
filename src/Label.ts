import LabelSymbol3D from "@arcgis/core/symbols/LabelSymbol3D";
import TextSymbol3DLayer from "@arcgis/core/symbols/TextSymbol3DLayer";
import LineCallout3D from "@arcgis/core/symbols/callouts/LineCallout3D";

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

export const labelSymbol3DLine = ({
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
        material: {
          color: materialColor,
        },
        size: fontSize,
        font: {
          family: fontFamily,
          weight: fontWeight,
        },
        halo: {
          color: haloColor,
          size: haloSize,
        },
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
      border: {
        color: calloutBorderColor,
      },
    }),
  });

  return labelSymbol3D;
};
