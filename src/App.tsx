import { useState, useEffect, useCallback } from "react";
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
import { authenticate } from "./autho";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MyContext } from "./contexts/MyContext";

const queryClient = new QueryClient();

export function App(): React.JSX.Element {
  //--- Viewer authentication
  const [loggedInState, setLoggedInState] = useState<boolean>(false);
  useEffect(() => {
    authenticate(setLoggedInState, "9txmFgtIL6djtigu");
  }, []);

  //--- Parameter update using hook
  const [cpackage, setCpackage] = useState<any>(null);
  const updateCpackage = useCallback((newcp: any) => {
    setCpackage(newcp);
  }, []);

  const [company, setCompany] = useState<any>();
  const updateCompany = useCallback((newComp: any) => {
    setCompany(newComp);
  }, []);

  const [utype, setUtype] = useState<any>();
  const updateUtype = useCallback((newtype: any) => {
    setUtype(newtype);
  }, []);

  return (
    <>
      {loggedInState === true && (
        <div>
          <calcite-shell
            style={{ scrollbarWidth: "thin", scrollbarColor: "#888 #555" }}
          >
            <MyContext
              value={{
                cpackage,
                updateCpackage,
                company,
                updateCompany,
                utype,
                updateUtype,
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
      )}
    </>
  );
}

export default App;
