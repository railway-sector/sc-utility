/* eslint-disable @typescript-eslint/no-unused-expressions */
import { use, useEffect, useMemo, useRef, useState } from "react";
import {
  utilityPointLayer,
  utilityLineLayer,
  utilityLayers,
  utilityPointLayer1,
  utilityLineLayer1,
} from "../layers";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import { thousands_separators, zoomToLayer } from "../query";
import { ArcgisScene } from "@arcgis/map-components/dist/components/arcgis-scene";
import {
  cp_f,
  util_comp_f,
  util_dtype_f,
  util_status_f,
  util_status_q,
  util_type_f,
  util_types,
  viastatus_q,
} from "../uniqueValues";
import { queryDefinitionExpression } from "../queryExpression";
import { legendSetter, rootSetter } from "../chartSetter";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ChartResponse } from "../interfaceKeys";
import ChartStackColumnRender from "chart-stack-column-render";
import ChartStackColumns from "chart-stack-column";
import { MyContext } from "../contexts/MyContext";
import QueryExpressionLayers from "query-layers-expression";

const chartID = "utility_chart";

// Static layout constants (do not depend on props/state, so hoisted out of the component)
const CHART_MARGINS = {
  marginTop: 0,
  marginLeft: 0,
  marginRight: 0,
  marginBottom: 0,
};
const CHART_PADDING = {
  paddingTop: 10,
  paddingLeft: 5,
  paddingRight: 5,
  paddingBottom: 0,
};
const CHART_ICON_POSITION_X = -21;
const CHART_PADDING_RIGHT_ICON_LABEL = 45;
const CHART_BORDER_LINE_COLOR = "#00c5ff";
const CHART_BORDER_LINE_WIDTH = 0.4;
const PRIMARY_LABEL_COLOR = "#9ca3af";
const VALUE_LABEL_COLOR = "#d1d5db";

const PANEL_BORDER_STYLE = {
  borderStyle: "solid" as const,
  borderRightWidth: 3.5,
  borderTopWidth: 0.5,
  borderLeftWidth: 3.5,
  borderBottomWidth: 3.5,
  borderColor: "#555555",
  justifyContent: "space-between" as const,
};

//-----------------------//
//     usetUtilityData   //
//-----------------------//
function useUtilityData(
  cpackage: string,
  company: string,
  utype: string,
  query: QueryExpressionLayers,
) {
  return useQuery<ChartResponse | any>({
    queryKey: [
      cpackage,
      company,
      utype,
      utilityPointLayer,
      utilityPointLayer1,
      utilityLineLayer,
      utilityLineLayer1,
      util_status_f,
      query,
    ],
    queryFn: async () => {
      queryDefinitionExpression({
        queryExpression: query.queryExpression(),
        featureLayer: [
          utilityPointLayer,
          utilityPointLayer1,
          utilityLineLayer,
          utilityLineLayer1,
        ],
      });

      //--- chart data
      const chartData = await new ChartStackColumns({
        where: query,
        categoryTypes: util_types,
        categoryTypeField: util_type_f,
        layers: [utilityPointLayer, utilityLineLayer],
        statusField: util_status_f,
        statusState: [0, 2, 3, 1],
      }).chartDataStackColumns();

      return {
        chartData: chartData[0] || [],
        totaln: chartData[1] || 0,
        perc: chartData[2] || 0,
      };
    },
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });
}

// Draw chart
const Chart = () => {
  const { cpackage, company, utype } = use(MyContext);
  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
  const [chartPanelwidth, setChartPanelwidth] = useState<number>(0);

  //--Recompute only when utype is updated
  const rLayers = useMemo(
    () => (!utype ? Object.values(utilityLayers).flat() : utilityLayers[utype]),
    [utype],
  );

  //--- Query Expression
  const q1 = useMemo(
    () =>
      new QueryExpressionLayers({
        qFields: [cp_f, util_comp_f, util_dtype_f],
        qValues: [cpackage, company, utype],
      }),
    [cpackage, company, utype],
  );

  const { data, isLoading } = useUtilityData(cpackage, company, utype, q1);

  const chartData = data?.chartData ?? [];
  const totaln = data?.totaln ?? 0;
  const perc_comp = data?.perc ?? 0;

  const legendRef = useRef<unknown | any | undefined>({});
  const rendererRef = useRef<ChartStackColumnRender | null>(null);
  const chartRef = useRef<unknown | any | undefined>({});

  const fontSize = chartPanelwidth / 20;
  const valueSize = fontSize * 1.55;
  const chartIconSize = chartPanelwidth * 0.07;
  const axisFontSize = chartPanelwidth * 0.036;

  //--- Signature of the filters that should trigger a re-zoom.
  //  Set once from the true first render — NOT reset inside the
  //  effect — so React 18 StrictMode's dev-only double effect
  //  invoke (mount -> cleanup -> mount) sees "nothing changed"
  //  on both passes and correctly skips the zoom both times.
  //  A zoom only fires once one of these values genuinely
  //  changes on a later, real render.
  const zoomFiltersRef = useRef(`${cpackage}-${company}-${utype}`);

  useEffect(() => {
    const currentZoomFilters = `${cpackage}-${company}-${utype}`;

    if (currentZoomFilters !== zoomFiltersRef.current) {
      zoomFiltersRef.current = currentZoomFilters;
      zoomToLayer(utilityPointLayer, arcgisScene?.view);
    }
  }, [chartData]);

  //--- Keep click-handler-relevant values fresh without rebuilding the
  //    chart. view lives here too (not passed statically to the
  //    renderer) since arcgis-scene's view may not be ready on first
  //    mount.
  const configBaseArgs = {
    revit: false,
    layers: rLayers,
    buildingLayer: undefined,
    chartCategoryTypeField: util_type_f,
    where: q1,
    status_field: util_status_f,
    view: arcgisScene?.view,
  };
  const configRef = useRef({ ...configBaseArgs });
  useEffect(() => {
    configRef.current = { ...configBaseArgs };
  }, [data, util_status_f, arcgisScene]);

  //---  Column Chart Renderer — created ONCE (mount only)
  useEffect(() => {
    const root = rootSetter({ chartID: chartID });
    root.setThemes([]);
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        layout: root.verticalLayout,
        ...CHART_MARGINS,
        ...CHART_PADDING,
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

    //--- NOTE: no `view` here — it's read live from configRef.current
    //    inside chartrender.ts, since arcgis-scene may not have a
    //    ready `.view` yet at this point.
    const renderer = new ChartStackColumnRender({
      root,
      chart,
      data: [],
      configRef,
      chartCategoryTypes: util_types,
      statusTypename: ["Completed", "To be Constructed"], //["Completed", "To be Constructed", "Under Construction"],
      statusStatename: ["comp", "incomp"], //["comp", "incomp", "ongoing"],
      statusArray: util_status_q,
      seriesStatusColor: viastatus_q.map((c: any) => c.color),
      strokeColor: CHART_BORDER_LINE_COLOR,
      strokeWidth: CHART_BORDER_LINE_WIDTH,
      chartIconSize,
      axisFontSize,
      chartIconPositionX: CHART_ICON_POSITION_X,
      chartPaddingRightIconLabel: CHART_PADDING_RIGHT_ICON_LABEL,
      legend,
      updateChartPanelwidth: setChartPanelwidth,
    });
    rendererRef.current = renderer;
    renderer.chartRendererColumn();

    return () => {
      root.dispose();
      rendererRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //--- Push new data / inner value / affected-area figures into the
  //    already-mounted chart. No dispose, no rebuild -> no blink.
  //    NOTE: affectedAreaValue is NOT called here directly — it's
  //    registered once inside chartrender.ts and reads live data via
  //    closures, which updateData() keeps in sync. Calling it here on
  //    every render would both miss the first paint and stack
  //    duplicate adapters.
  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer || !chartPanelwidth) return; // wait for a real width

    //--- Sizes are captured at construction, so refresh them here
    renderer.chartIconSize = chartIconSize;
    renderer.axisFontSize = axisFontSize;

    renderer.updateData(chartData);
  }, [chartData, chartPanelwidth]);

  return (
    <div slot="panel-end" style={PANEL_BORDER_STYLE}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <img
          src="https://EijiGorilla.github.io/Symbols/Utility_Logo.png"
          alt="Utility Logo"
          height={`20%`}
          width={`20%`}
          style={{ marginLeft: "15px", marginTop: "10px" }}
        />
        <dl style={{ alignItems: "center", marginRight: "25px" }}>
          <dt style={{ color: PRIMARY_LABEL_COLOR, fontSize: `${fontSize}px` }}>
            TOTAL PROGRESS
          </dt>
          <dd
            style={{
              color: VALUE_LABEL_COLOR,
              fontSize: `${valueSize}px`,
              fontWeight: "bold",
              fontFamily: "calibri",
              lineHeight: "1.2",
              margin: "auto",
              opacity: isLoading ? 0 : 1,
            }}
          >
            {thousands_separators(perc_comp)} %
          </dd>
          <div
            style={{
              color: VALUE_LABEL_COLOR,
              fontSize: `${valueSize * 0.5}px`,
              fontFamily: "calibri",
              lineHeight: "1.2",
              opacity: isLoading ? 0 : 1,
            }}
          >
            ({thousands_separators(totaln)})
          </div>
        </dl>
      </div>

      <div
        id={chartID}
        style={{
          width: "95%",
          height: "72vh",
          backgroundColor: "rgb(0,0,0,0)",
          color: "white",
          marginRight: "10px",
          marginTop: "10px",
          opacity: isLoading ? 0 : 1,
        }}
      ></div>
    </div>
  );
};

export default Chart;
