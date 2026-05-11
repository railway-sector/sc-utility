import type { StatusStateType, StatusTypenamesType } from "./uniqueValues";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";
import Query from "@arcgis/core/rest/support/Query";
import { queryc2 } from "./layers";

//--------------------------------//
//    Chart RendererParameters    //
//--------------------------------//
//-- Responsve parameters
export function responsiveChart(chart: any, legend: any) {
  chart.onPrivate("width", (width: any) => {
    const availableSpace = width * 0.35; // original 0.7
    const new_fontSize = width / 35;

    legend.labels.template.setAll({
      fill: am5.color("#ffffff"),
      fontSize: new_fontSize,
    });

    legend.itemContainers.template.setAll({
      width: availableSpace,
      marginLeft: 10,
      marginRight: 10,
    });
  });
}

interface layerViewQueryType {
  layer?: any;
  qExpression?: any;
  view: any;
}
// FeatureLayer or SceneLayer
export const highlightFilterLayerView = ({
  layer,
  qExpression,
  view,
}: layerViewQueryType) => {
  const query = layer.createQuery();
  query.where = qExpression;
  let highlightSelect: any;

  view?.whenLayerView(layer).then((layerView: any) => {
    layer?.queryObjectIds(query).then((results: any) => {
      const objID = results;

      const queryExt = new Query({
        objectIds: objID,
      });
      layer?.queryExtent(queryExt).then((result: any) => {
        if (result?.extent) {
          view?.goTo(result.extent);
        }
      });

      highlightSelect && highlightSelect.remove();
      highlightSelect = layerView.highlight(objID);
    });

    layerView.filter = new FeatureFilter({
      where: qExpression,
    });

    // For initial state, we need to add this
    view?.on("click", () => {
      layerView.filter = new FeatureFilter({
        where: undefined,
      });
      highlightSelect && highlightSelect.remove();
    });
  });
};

//--- Click event on series
interface clickSeriesType {
  series: any;
  layers: any;
  q1Value: any;
  q1Field: any;
  q2Value: any;
  q2Field: any;
  q3Value: any;
  q3Field: any;
  chartCategoryTypes: any;
  chartCategoryFieldScene: any;
  statusStatename: any;
  statusField: any;
  arcgisScene: any;
}
export function clickSeries({
  series,
  layers,
  q1Value,
  q1Field,
  q2Value,
  q2Field,
  q3Value,
  q3Field,
  chartCategoryTypes,
  chartCategoryFieldScene,
  statusStatename,
  statusField,
  arcgisScene,
}: clickSeriesType) {
  series.columns.template.events.on("click", (ev: any) => {
    const selected: any = ev.target.dataItem?.dataContext;
    const categorySelected: string = selected.category;
    const find = chartCategoryTypes.find(
      (emp: any) => emp.category === categorySelected,
    );
    const typeSelected = find?.value;

    queryc2.qValues = [q1Value, q2Value, q3Value];
    queryc2.qFields = [q1Field, q2Field, q3Field];
    queryc2.chartCategory = typeSelected;
    queryc2.chartCategoryField = chartCategoryFieldScene;
    queryc2.chartCategoryType = "number";
    queryc2.status = statusStatename === "incomp" ? 0 : 1;
    queryc2.statusField = statusField;
    const geometryTypeSelected =
      q3Value === "Point"
        ? "point"
        : q3Value === "Line"
          ? "polyline"
          : undefined;

    for (const layer of layers) {
      if (!q3Value) {
        // both point and line
        highlightFilterLayerView({
          layer: layer,
          qExpression: queryc2.queryExpression(),
          view: arcgisScene?.view,
        });
      } else {
        // either point or line
        if (layer.geometryType === geometryTypeSelected) {
          highlightFilterLayerView({
            layer: layer,
            qExpression: queryc2.queryExpression(),
            view: arcgisScene?.view,
          });
        }
      }
    }
  });
}

//--- Chart series
interface makeSeriesType {
  root: any;
  chart: any;
  layers: any;
  q1Value: any;
  q1Field: any;
  q2Value: any;
  q2Field: any;
  q3Value: any;
  q3Field: any;
  chartCategoryTypes: any;
  chartCategoryFieldScene: any;
  data: any;
  statusTypename: any;
  statusStatename: any;
  statusStateValue: any;
  statusField: any;
  xAxis: any;
  yAxis: any;
  legend: any;
  new_axisFontSize: any;
  seriesStatusColor: any;
  strokeColor: any;
  strokeWidth: any;
  arcgisScene: any;
}

export function makeSeries({
  root,
  chart,
  layers,
  q1Value,
  q1Field,
  q2Value,
  q2Field,
  q3Value,
  q3Field,
  chartCategoryTypes,
  chartCategoryFieldScene,
  data,
  statusTypename,
  statusStatename,
  statusField,
  xAxis,
  yAxis,
  legend,
  new_axisFontSize,
  seriesStatusColor,
  strokeColor,
  strokeWidth,
  arcgisScene,
}: makeSeriesType) {
  const series = chart.series.push(
    am5xy.ColumnSeries.new(root, {
      name: statusTypename,
      stacked: true,
      xAxis: xAxis,
      yAxis: yAxis,
      baseAxis: yAxis,
      valueXField: statusStatename,
      valueXShow: "valueXTotalPercent",
      categoryYField: "category",
      fill:
        statusStatename === "incomp"
          ? am5.color(seriesStatusColor[0])
          : statusStatename === "comp"
            ? am5.color(seriesStatusColor[3])
            : statusStatename === "delayed"
              ? am5.color(seriesStatusColor[2])
              : am5.color(seriesStatusColor[1]),
      stroke: am5.color(strokeColor),
    }),
  );

  series.columns.template.setAll({
    fillOpacity: statusStatename === "comp" ? 1 : 0.5,
    tooltipText: "{name}: {valueX}", // "{categoryY}: {valueX}",
    tooltipY: am5.percent(90),
    strokeWidth: strokeWidth,
  });
  series.data.setAll(data);

  series.appear();

  series.bullets.push(() => {
    return am5.Bullet.new(root, {
      sprite: am5.Label.new(root, {
        text:
          statusStatename === "incomp"
            ? ""
            : "{valueXTotalPercent.formatNumber('#.')}%", //"{valueX}",
        fill: root.interfaceColors.get("alternativeText"),
        opacity: statusStatename === "incomp" ? 0 : 1,
        fontSize: new_axisFontSize,
        centerY: am5.p50,
        centerX: am5.p50,
        populateText: true,
      }),
    });
  });

  // Click series
  clickSeries({
    series: series,
    layers: layers,
    q1Value: q1Value,
    q1Field: q1Field,
    q2Value: q2Value,
    q2Field: q2Field,
    q3Value: q3Value,
    q3Field: q3Field,
    chartCategoryTypes: chartCategoryTypes,
    chartCategoryFieldScene: chartCategoryFieldScene,
    statusStatename: statusStatename,
    statusField: statusField,
    arcgisScene: arcgisScene,
  });

  legend.data.push(series);
}

//--- Chart Renderer
interface chartType {
  root: any;
  chart: any;
  data: any;
  layers: [FeatureLayer, FeatureLayer?, FeatureLayer?, FeatureLayer?];
  q1Value: any;
  q1Field: any;
  q2Value?: any;
  q2Field?: any;
  q3Value?: any;
  q3Field?: any;
  chartCategoryTypes?: any;
  chartCategoryFieldRevit?: any;
  chartCategoryFieldScene?: any;
  // 'statusTypename' and 'statusStatename': E.g., you can add or delete status you wish to add in stacked columns.
  statusTypename: StatusTypenamesType[]; // order has no effect on statistics
  statusStatename: StatusStateType[]; // order affects the order displayed in stacked column charts
  statusStateValue?: any;
  statusField: any;
  seriesStatusColor: any;
  strokeColor: any;
  strokeWidth: any;
  arcgisScene: any;
  setClickedCategory?: any;
  setSublayerViewFilter?: any;
  new_chartIconSize: any;
  new_axisFontSize: any;
  chartIconPositionX: any;
  chartPaddingRightIconLabel: any;
  legend: any;
  updateChartPanelwidth: any;
}
export function chartRenderer({
  root,
  chart,
  data,
  layers,
  q1Value,
  q1Field,
  q2Value,
  q2Field,
  q3Value,
  q3Field,
  chartCategoryTypes,
  chartCategoryFieldScene,
  statusTypename,
  statusStatename,
  statusStateValue,
  statusField,
  seriesStatusColor,
  strokeColor,
  strokeWidth,
  arcgisScene,
  new_chartIconSize,
  new_axisFontSize,
  chartIconPositionX,
  chartPaddingRightIconLabel,
  legend,
  updateChartPanelwidth,
}: chartType) {
  // Axis Renderer
  const yRenderer = am5xy.AxisRendererY.new(root, {
    inversed: true,
  });

  //--- yAxix
  const yAxis = chart.yAxes.push(
    am5xy.CategoryAxis.new(root, {
      categoryField: "category",
      renderer: yRenderer,
      bullet: function (root: any, _axis: any, dataItem: any) {
        return am5xy.AxisBullet.new(root, {
          location: 0.5,
          sprite: am5.Picture.new(root, {
            width: new_chartIconSize,
            height: new_chartIconSize,
            centerY: am5.p50,
            centerX: am5.p50,
            scale: 1.15,
            x: chartIconPositionX,
            src: dataItem.dataContext.icon,
          }),
        });
      },
      tooltip: am5.Tooltip.new(root, {}),
    }),
  );

  yRenderer.labels.template.setAll({
    paddingRight: chartPaddingRightIconLabel,
  });

  yRenderer.grid.template.setAll({
    location: 1,
  });

  yAxis.get("renderer").labels.template.setAll({
    oversizedBehavior: "wrap",
    textAlign: "center",
    fill: am5.color("#ffffff"),
    //maxWidth: 150,
    fontSize: new_axisFontSize,
  });
  yAxis.data.setAll(data);

  //--- xAxix
  const xAxis = chart.xAxes.push(
    am5xy.ValueAxis.new(root, {
      min: 0,
      max: 100,
      strictMinMax: true,
      numberFormat: "#'%'",
      calculateTotals: true,
      renderer: am5xy.AxisRendererX.new(root, {
        strokeOpacity: 0,
        strokeWidth: 1,
        stroke: am5.color("#ffffff"),
      }),
    }),
  );

  xAxis.get("renderer").labels.template.setAll({
    //oversizedBehavior: "wrap",
    textAlign: "center",
    fill: am5.color("#ffffff"),
    //maxWidth: 150,
    fontSize: new_axisFontSize,
  });

  //--- Responsive Chart
  responsiveChart(chart, legend);
  chart.onPrivate("width", (width: any) => {
    updateChartPanelwidth(width);
  });

  //--- Make Series
  statusTypename &&
    statusTypename.map((statustype: any, index: any) => {
      makeSeries({
        root: root,
        chart: chart,
        layers: layers,
        q1Value: q1Value,
        q1Field: q1Field,
        q2Value: q2Value,
        q2Field: q2Field,
        q3Value: q3Value,
        q3Field: q3Field,
        chartCategoryTypes: chartCategoryTypes,
        chartCategoryFieldScene: chartCategoryFieldScene,
        data: data,
        statusTypename: statustype,
        statusStatename: statusStatename[index],
        statusStateValue: statusStateValue[index],
        statusField: statusField,
        xAxis: xAxis,
        yAxis: yAxis,
        legend: legend,
        new_axisFontSize: new_axisFontSize,
        seriesStatusColor: seriesStatusColor,
        strokeColor: strokeColor,
        strokeWidth: strokeWidth,
        arcgisScene: arcgisScene,
      });
    });
}

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
