/* eslint-disable @typescript-eslint/no-unused-expressions */
import type FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { dateTable } from "./layers";
import QueryExpressionLayers from "query-layers-expression";

//---------------------------------------------------------//
//                 Add Layers to Map                      //
//---------------------------------------------------------//
export function addLayersToMap(map: any, layersList: any[]) {
  layersList.forEach((layer: any) => {
    map.add(layer);
  });
}

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

//---------------------------------------------------------//
//                Get as-of-date                           //
//---------------------------------------------------------//
export function yearMonthDay(date: Date) {
  return {
    year: date?.getFullYear() ?? 0,
    month: date?.getMonth() + 1,
    day: date?.getDate(),
  };
}

export function toAsofdate(date: Date) {
  //--- Return displayed date: (as of date)
  const { year, day } = yearMonthDay(date);
  const cmonth = date?.toLocaleString("en-US", { month: "long" });
  return `${cmonth} ${day}, ${year}`;
}

export async function dateUpdate(category: string) {
  //--- Only executed during an initial render
  const query = dateTable.createQuery();
  query.where = `project = 'N2' AND category = '${category}'`;

  const { features } = await dateTable.queryFeatures(query);
  return features.map(({ attributes }: any) => {
    const date = new Date(attributes.date);
    const asofdate = toAsofdate(date);

    return asofdate;
  });
}

//---------------------------------------------//
//               Stack Columns                 //
//---------------------------------------------//
interface StackColumnChartDataType {
  colchart: any;
  qChart: any;
  categoryTypes: any;
  categoryTypeField: any;
  layers: any;
  statusField: any;
  statusState: any;
}

export async function stackColumnChartData({
  colchart,
  qChart,
  categoryTypes,
  categoryTypeField,
  layers,
  statusField,
  statusState,
}: StackColumnChartDataType) {
  colchart.qChart = qChart.queryExpression();
  colchart.categoryTypes = categoryTypes;
  colchart.categoryTypeField = categoryTypeField;
  colchart.layers = layers;
  colchart.statusField = statusField;
  colchart.statusState = statusState;

  return await colchart.chartDataStackColumns();
}

type StatusTypeNamesType =
  | "To be Constructed"
  | "Under Construction"
  | "delayed"
  | "Completed"
  | "Exceeded"
  | "Normal";

type StatusStateType =
  | "comp"
  | "incomp"
  | "ongoing"
  | "delayed"
  | "exceeded"
  | "normal";

interface ChartStackColumnRender {
  render: any;
  revit: boolean;
  layers: any;
  root: any;
  chart: any;
  data: any;
  buildingLayer?: any;
  qChart: any;
  chartCategoryTypes: any;
  chartCategoryTypeField: any;
  statusTypename: StatusTypeNamesType[];
  statusStatename: StatusStateType[];
  statusArray: any;
  statusField: any;
  seriesStatusColor: any;
  strokeColor: any;
  strokeWidth: any;
  view: any;
  setLayerViewFilter?: any;
  new_chartIconSize: any;
  new_axisFontSize: any;
  chartIconPositionX?: any;
  chartPaddingRightIconLabel: any;
  legend: any;
  updateChartPanelwidth: any;
}

export async function stackColumnChartRender({
  render,
  revit,
  layers,
  root,
  chart,
  data,
  buildingLayer,
  qChart,
  chartCategoryTypes,
  chartCategoryTypeField,
  statusTypename,
  statusStatename,
  statusArray,
  statusField,
  seriesStatusColor,
  strokeColor,
  strokeWidth,
  view,
  setLayerViewFilter,
  new_chartIconSize,
  new_axisFontSize,
  chartIconPositionX,
  chartPaddingRightIconLabel,
  legend,
  updateChartPanelwidth,
}: ChartStackColumnRender) {
  render.revit = revit;
  render.layers = layers;
  render.root = root;
  render.chart = chart;
  render.data = data;
  render.buildingLayer = buildingLayer;
  render.qChart = qChart;
  render.chartCategoryTypes = chartCategoryTypes;
  render.chartCategoryTypeField = chartCategoryTypeField;
  render.statusTypename = statusTypename;
  render.statusStatename = statusStatename;
  render.statusArray = statusArray;
  render.statusField = statusField;
  render.seriesStatusColor = seriesStatusColor;
  render.strokeColor = strokeColor;
  render.strokeWidth = strokeWidth;
  render.view = view;
  render.setLayerViewFilter = setLayerViewFilter;
  render.new_chartIconSize = new_chartIconSize;
  render.new_axisFontSize = new_axisFontSize;
  render.chartIconPositionX = chartIconPositionX;
  render.chartPaddingRightIconLabel = chartPaddingRightIconLabel;
  render.legend = legend;
  render.updateChartPanelwidth = updateChartPanelwidth;

  return await render.chartRendererColumn();
}

//--- Returns query expression
export const makeQuery = (
  qValues: string[],
  qFields: string[],
  qExpression?: string,
  q2Expression?: string,
) => {
  const q = new QueryExpressionLayers();
  q.qValues = qValues;
  q.qFields = qFields;
  if (qExpression) q.qExpression = qExpression;
  if (q2Expression) q.q2Expression = q2Expression;
  return q;
};

//------------------------------------------------//
//                Get as-of-date                  //
//------------------------------------------------//
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
    if (error.name !== "AbortError") console.error(error);
  });
}

// Layter list
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
