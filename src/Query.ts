/* eslint-disable @typescript-eslint/no-unused-expressions */
import type FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { dateTable } from "./layers";

//-----------------------------------------//
//        Layer visibility                //
//-----------------------------------------//
interface layersRevitVisibilityType {
  layers: [FeatureLayer, FeatureLayer?, FeatureLayer?, FeatureLayer?];
}

export const resetAllLayers = ({ layers }: layersRevitVisibilityType) => {
  if (layers) {
    layers.map((layer: any) => {
      if (layer) {
        layer.layer.definitionExpression = "1=1";
        layer.layer.visible = true;
      }
    });
  }
};

// Updat date
export async function dateUpdate() {
  const monthList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const query = dateTable.createQuery();
  query.where = "project = 'SC'" + " AND " + "category = 'Utility Relocation'";

  return dateTable.queryFeatures(query).then((response: any) => {
    const stats = response.features;
    const dates = stats.map((result: any) => {
      const date = new Date(result.attributes.date);
      const year = date.getFullYear();
      const month = monthList[date.getMonth()];
      const day = date.getDate();
      const final = year < 1990 ? "" : `${month} ${day}, ${year}`;
      return final;
    });
    return dates;
  });
}

// Thousand separators function
export function thousands_separators(num: any) {
  if (num) {
    const num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
  }
}

export async function zoomToLayer(layer: any, view: any) {
  const response = await layer?.queryExtent();
  view?.goTo(response.extent, { speedFactor: 2 }).catch((error: any) => {
    if (error.name !== "AbortError") {
      console.error(error);
    }
  });

  // return layer?.queryExtent().then((response: any) => {
  //   view
  //     ?.goTo(response.extent, {
  //       //response.extent
  //       speedFactor: 2,
  //     })
  //     .catch((error: any) => {
  //       if (error.name !== "AbortError") {
  //         console.error(error);
  //       }
  //     });
  // });
}

// Layter list
export async function defineActions(event: any) {
  const { item } = event;
  if (item.layer.type !== "group") {
    item.panel = {
      content: "legend",
      open: true,
    };
  }

  item.title === "Chainage" ||
  item.title === "Viaduct" ||
  item.title === "Pier No"
    ? (item.visible = false)
    : (item.visible = true);
}
