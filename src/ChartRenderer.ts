import { queryExpression } from "./QueryExpression";
import type { StatusStateType, StatusTypenamesType } from "./uniqueValues";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";
import Query from "@arcgis/core/rest/support/Query";

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
export function clickSeries(
  series: any,
  layers: any,
  q1Value: any,
  q1Field: any,
  q2Value: any,
  q2Field: any,
  q3Value: any,
  q3Field: any,
  chartCategoryTypes: any,
  chartCategoryFieldScene: any,
  statusStateValue: any,
  statusField: any,
  arcgisScene: any,
) {
  series.columns.template.events.on("click", (ev: any) => {
    const selected: any = ev.target.dataItem?.dataContext;
    const categorySelected: string = selected.category;
    const find = chartCategoryTypes.find(
      (emp: any) => emp.category === categorySelected,
    );
    const typeSelected = find?.value;

    const expression_layer = queryExpression({
      q1Value: q1Value,
      q1Field: q1Field,
      q2Value: q2Value,
      q2Field: q2Field,
      q3Value: q3Value,
      q3Field: q3Field,
      chartCategory: typeSelected,
      chartCategoryField: chartCategoryFieldScene,
      chartCategoryType: "number",
      status: statusStateValue,
      statusField: statusField,
    });

    for (const layer of layers) {
      highlightFilterLayerView({
        layer: layer,
        qExpression: expression_layer,
        view: arcgisScene?.view,
      });
    }
  });
}

//--- Chart series
export function makeSeries(
  root: any,
  chart: any,
  layers: any,
  q1Value: any,
  q1Field: any,
  q2Value: any,
  q2Field: any,
  q3Value: any,
  q3Field: any,
  chartCategoryTypes: any,
  chartCategoryFieldScene: any,
  data: any,
  statusTypename: any,
  statusStatename: any,
  statusStateValue: any,
  statusField: any,
  xAxis: any,
  yAxis: any,
  legend: any,
  new_axisFontSize: any,
  seriesStatusColor: any,
  strokeColor: any,
  strokeWidth: any,
  arcgisScene: any,
) {
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
  clickSeries(
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
    statusStateValue,
    statusField,
    arcgisScene,
  );

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
      makeSeries(
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
        statustype,
        statusStatename[index],
        statusStateValue[index],
        statusField,
        xAxis,
        yAxis,
        legend,
        new_axisFontSize,
        seriesStatusColor,
        strokeColor,
        strokeWidth,
        arcgisScene,
      );
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
