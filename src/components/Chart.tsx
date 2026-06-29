/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useEffect, useRef, useState } from "react";
import {
  utilityPointLayer1,
  utilityLineLayer1,
  utilityPointLayer,
  utilityLineLayer,
  queryc,
  chartstack,
} from "../layers";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import { thousands_separators, zoomToLayer } from "../query";
import { ArcgisScene } from "@arcgis/map-components/dist/components/arcgis-scene";
import {
  chartCategoryTypeField,
  status_Field,
  statusColorForChart,
  utility_category_types,
  utilityStatusArray,
} from "../uniqueValues";
import { queryDefinitionExpression } from "../queryExpression";
import { chartRenderer } from "../chartRenderer";
import { legendSetter, rootSetter } from "../chartSetter";
import { useQuery } from "@tanstack/react-query";
import { locationKeys } from "../interfaceKeys";
import type { SelectedLocation, ChartResponse } from "../interfaceKeys";

// Draw chart
const Chart = () => {
  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
  const [chartPanelwidth, setChartPanelwidth] = useState<any>();

  //--- 1. Location state
  const { data: selectedLocation } = useQuery<SelectedLocation | any>({
    queryKey: locationKeys.selected,
    queryFn: async () => ({}),
    staleTime: Infinity,
  });
  const cpackage = selectedLocation?.cpackage;
  const company = selectedLocation?.company;
  const utype = selectedLocation?.utype;

  //--- 2. Streamlined Data Fetching with useQuery
  const { data } = useQuery<ChartResponse | any>({
    queryKey: [
      cpackage,
      company,
      utype,
      utilityPointLayer,
      utilityPointLayer1,
      utilityLineLayer,
      utilityLineLayer1,
      status_Field,
    ],
    queryFn: async () => {
      queryc.qValues = [cpackage, company, utype];

      queryDefinitionExpression({
        queryExpression: queryc.queryExpression(),
        featureLayer: [
          utilityPointLayer,
          utilityPointLayer1,
          utilityLineLayer,
          utilityLineLayer1,
        ],
      });

      chartstack.qChart = queryc.queryExpression();
      chartstack.categoryTypeField = chartCategoryTypeField;
      chartstack.layers = [utilityPointLayer, utilityLineLayer];
      chartstack.statusState = [0, 2, 3, 1]; // 2, 3 are dummy
      chartstack.statusField = "Status";
      const chartData = await chartstack.chartDataStackColumns();

      zoomToLayer(utilityPointLayer, arcgisScene?.view);

      return {
        chartData: chartData[0] || [],
        totaln: chartData[1] || 0,
        perc: chartData[2] || 0,
      };
    },
    staleTime: Infinity,
  });
  const chartData = data?.chartData || [];
  const totaln = data?.totaln || 0;
  const perc_comp = data?.perc || 0;

  //-------------------------------

  const legendRef = useRef<unknown | any | undefined>({});
  const chartRef = useRef<unknown | any | undefined>({});
  const chartID = "utility_chart";

  // Define parameters
  const marginTop = 0;
  const marginLeft = 0;
  const marginRight = 0;
  const marginBottom = 0;
  const paddingTop = 10;
  const paddingLeft = 5;
  const paddingRight = 5;
  const paddingBottom = 0;
  const chartIconPositionX = -21;
  const chartPaddingRightIconLabel = 45;
  const chartBorderLineColor = "#00c5ff";
  const chartBorderLineWidth = 0.4;

  const new_fontSize = chartPanelwidth / 20;
  const new_valueSize = new_fontSize * 1.55;
  const new_chartIconSize = chartPanelwidth * 0.07;
  const new_axisFontSize = chartPanelwidth * 0.036;
  const new_imageSize = chartPanelwidth * 0.055;

  // Utility Chart
  useEffect(() => {
    const root = rootSetter({ chartID: chartID });
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        layout: root.verticalLayout,
        marginTop: marginTop,
        marginLeft: marginLeft,
        marginRight: marginRight,
        marginBottom: marginBottom,
        paddingTop: paddingTop,
        paddingLeft: paddingLeft,
        paddingRight: paddingRight,
        paddingBottom: paddingBottom,
        scale: 1,
        height: am5.percent(100),
      }),
    );
    chartRef.current = chart;

    const legend = legendSetter({
      chart: chart,
      root: root,
      centerX: 50,
      centerY: 50,
      x: 60,
      y: 97,
      marginTop: 20,
      layout: root.horizontalLayout,
    });
    legendRef.current = legend;

    chartRenderer({
      root: root,
      chart: chart,
      data: chartData,
      layers: [
        utilityPointLayer,
        utilityPointLayer1,
        utilityLineLayer,
        utilityLineLayer1,
      ],
      qChart: queryc,
      chartCategoryTypes: utility_category_types,
      chartCategoryFieldScene: chartCategoryTypeField,
      statusTypename: ["Completed", "To be Constructed"], //["Completed", "To be Constructed", "Under Construction"],
      statusStatename: ["comp", "incomp"], //["comp", "incomp", "ongoing"],
      statusArray: utilityStatusArray,
      statusField: status_Field,
      seriesStatusColor: statusColorForChart,
      strokeColor: chartBorderLineColor,
      strokeWidth: chartBorderLineWidth,
      arcgisScene: arcgisScene,
      new_chartIconSize: new_chartIconSize,
      new_axisFontSize: new_axisFontSize,
      chartIconPositionX: chartIconPositionX,
      chartPaddingRightIconLabel: chartPaddingRightIconLabel,
      legend: legend,
      updateChartPanelwidth: setChartPanelwidth,
    });

    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  });

  const primaryLabelColor = "#9ca3af";
  const valueLabelColor = "#d1d5db";

  return (
    <>
      <div
        slot="panel-end"
        style={{
          padding: "0 1rem",
          borderStyle: "solid",
          borderRightWidth: 3.5,
          borderLeftWidth: 3.5,
          borderBottomWidth: 3.5,
          borderColor: "#555555",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            // marginLeft: "15px",
            // marginRight: "25px",
            justifyContent: "space-between",
          }}
        >
          <img
            src="https://EijiGorilla.github.io/Symbols/Utility_Logo.png"
            alt="Utility Logo"
            height={`${new_imageSize}%`}
            width={`${new_imageSize}%`}
            style={{ marginLeft: "15px", marginTop: "10px" }}
          />
          <dl style={{ alignItems: "center", marginRight: "25px" }}>
            <dt
              style={{
                color: primaryLabelColor,
                fontSize: `${new_fontSize}px`,
              }}
            >
              TOTAL PROGRESS
            </dt>
            <dd
              style={{
                color: valueLabelColor,
                fontSize: `${new_valueSize}px`,
                fontWeight: "bold",
                fontFamily: "calibri",
                lineHeight: "1.2",
                margin: "auto",
              }}
            >
              {thousands_separators(perc_comp)} %
            </dd>
            <div
              style={{
                color: valueLabelColor,
                fontSize: `${new_valueSize}*0.5px`,
                fontFamily: "calibri",
                lineHeight: "1.2",
              }}
            >
              ({thousands_separators(totaln)})
            </div>
          </dl>
        </div>

        <div
          id={chartID}
          style={{
            height: "71vh",
            backgroundColor: "rgb(0,0,0,0)",
            color: "white",
            marginRight: "10px",
            marginTop: "10px",
          }}
        ></div>
      </div>
    </>
  );
};

export default Chart;
