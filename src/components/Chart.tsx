/* eslint-disable @typescript-eslint/no-unused-expressions */
import { use, useEffect, useRef, useState } from "react";
import {
  utilityPointLayer1,
  utilityLineLayer1,
  utilityPointLayer,
  utilityLineLayer,
  queryc,
} from "../layers";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import { thousands_separators, zoomToLayer } from "../Query";
import { ArcgisScene } from "@arcgis/map-components/dist/components/arcgis-scene";
import { MyContext } from "../contexts/MyContext";
import {
  chartCategoryTypeField,
  company_field,
  cp_field,
  status_Field,
  statusColorForChart,
  utility_category_types,
  utilityStatusArray,
  utilTypeField,
} from "../uniqueValues";
import { queryDefinitionExpression } from "../QueryExpression";
import { chartDataStackColumns } from "../ChartDataGenerator";
import { chartRenderer } from "../ChartRenderer";

// Dispose function
function maybeDisposeRoot(divId: any) {
  am5.array.each(am5.registry.rootElements, function (root) {
    if (root.dom.id === divId) {
      root.dispose();
    }
  });
}

// Draw chart
const Chart = () => {
  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
  const {
    contractcps,
    companies,
    ptLinetypes,
    updateChartPanelwidth,
    chartPanelwidth,
  } = use(MyContext);
  const contractp = contractcps;
  const company = companies;
  const type = ptLinetypes;
  const legendRef = useRef<unknown | any | undefined>({});
  const chartRef = useRef<unknown | any | undefined>({});
  const [chartData, setChartData] = useState([]);
  const [totalNumber, setTotalNumber] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  const chartID = "utility-bar";
  useEffect(() => {
    queryc.qValues = [contractp, company, type];
    queryc.qFields = [cp_field, company_field, utilTypeField];

    queryDefinitionExpression({
      queryExpression: queryc.queryExpression(),
      featureLayer: [
        utilityPointLayer,
        utilityPointLayer1,
        utilityLineLayer,
        utilityLineLayer1,
      ],
    });

    chartDataStackColumns({
      qChart: queryc.queryExpression(),
      chartCategoryTypes: utility_category_types,
      chartCategoryField: chartCategoryTypeField, // "UtilType"
      chartCategoryValueType: "number",
      layers: [utilityPointLayer, utilityLineLayer],
      statusState: [0, 1],
      statusField: status_Field,
    }).then((result: any) => {
      setChartData(result[0]);
      setTotalNumber(result[1]);
      setProgress(result[2]);
    });

    zoomToLayer(utilityPointLayer, arcgisScene?.view);
  }, [contractp, company, type]);

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

  // ************************************
  //  Responsive Chart parameters
  // ***********************************
  const new_fontSize = chartPanelwidth / 20;
  const new_valueSize = new_fontSize * 1.55;
  const new_chartIconSize = chartPanelwidth * 0.07;
  const new_axisFontSize = chartPanelwidth * 0.036;
  const new_imageSize = chartPanelwidth * 0.055;

  // Utility Chart
  useEffect(() => {
    maybeDisposeRoot(chartID);

    const root = am5.Root.new(chartID);
    root.container.children.clear();
    root._logo?.dispose();

    // Set themesf
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root),
      am5themes_Responsive.new(root),
    ]);

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

    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        centerY: am5.percent(50),
        x: am5.percent(60),
        y: am5.percent(97),
        marginTop: 20,
      }),
    );
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
      q1Value: contractp,
      q1Field: cp_field,
      q2Value: company,
      q2Field: company_field,
      q3Value: type,
      q3Field: utilTypeField,
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
      updateChartPanelwidth: updateChartPanelwidth,
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
              {thousands_separators(progress)} %
            </dd>
            <div
              style={{
                color: valueLabelColor,
                fontSize: `${new_valueSize}*0.5px`,
                fontFamily: "calibri",
                lineHeight: "1.2",
              }}
            >
              ({thousands_separators(totalNumber)})
            </div>
          </dl>
        </div>

        <div
          id={chartID}
          style={{
            height: "69vh",
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
