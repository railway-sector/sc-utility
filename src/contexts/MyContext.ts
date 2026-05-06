import { createContext } from "react";

type MyDropdownContextType = {
  contractcps: any;
  companies: any;
  ptLinetypes: any;
  chartPanelwidth: any;
  updateContractcps: any;
  updateCompanies: any;
  updateTypes: any;
  updateChartPanelwidth: any;
};

const initialState = {
  contractcps: undefined,
  companies: undefined,
  ptLinetypes: undefined,
  chartPanelwidth: undefined,
  updateContractcps: undefined,
  updateCompanies: undefined,
  updateTypes: undefined,
  updateChartPanelwidth: undefined,
};

export const MyContext = createContext<MyDropdownContextType>({
  ...initialState,
});
