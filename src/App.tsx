import { useState, useEffect } from "react";
import "./index.css";
import "@arcgis/map-components/dist/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";
import "@esri/calcite-components/components/calcite-shell";
import MapDisplay from "./components/MapDisplay";
import ActionPanel from "./components/ActionPanel";
import Header from "./components/Header";
import Chart from "./components/Chart";
import UndergroundSwitch from "./components/UndergroundSwitch";
import { MyContext } from "./contexts/MyContext";
import { authenticate } from "./autho";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function App(): React.JSX.Element {
  const [loggedInState, setLoggedInState] = useState<boolean>(false);
  useEffect(() => {
    authenticate(setLoggedInState, "9txmFgtIL6djtigu");
  }, []);

  const [contractcps, setContractcps] = useState<any>();
  const [companies, setCompanies] = useState<any>();
  const [ptLinetypes, setPtLineTypes] = useState<any>();
  const [chartPanelwidth, setChartPanelwidth] = useState<any>();

  const updateContractcps = (newContractcp: any) => {
    setContractcps(newContractcp);
  };

  const updateCompanies = (newCompany: any) => {
    setCompanies(newCompany);
  };

  const updateTypes = (newPtLineType: any) => {
    setPtLineTypes(newPtLineType);
  };

  const updateChartPanelwidth = (newWidth: any) => {
    setChartPanelwidth(newWidth);
  };

  return (
    <>
      {loggedInState === true ? (
        <div>
          <calcite-shell
            style={{ scrollbarWidth: "thin", scrollbarColor: "#888 #555" }}
          >
            <MyContext
              value={{
                contractcps,
                companies,
                ptLinetypes,
                chartPanelwidth,
                updateContractcps,
                updateCompanies,
                updateTypes,
                updateChartPanelwidth,
              }}
            >
              <QueryClientProvider client={queryClient}>
                <ActionPanel />
                <UndergroundSwitch />
                <Chart />
                <MapDisplay />
                <Header />
              </QueryClientProvider>
            </MyContext>
          </calcite-shell>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}

export default App;
