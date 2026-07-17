import { createContext } from "react";

type MyDropdownContextType = {
  cpackage: any;
  updateCpackage: any;
  company: any;
  updateCompany: any;
  utype: any;
  updateUtype: any;
};

const initialState = {
  cpackage: undefined,
  updateCpackage: undefined,
  company: undefined,
  updateCompany: undefined,
  utype: undefined,
  updateUtype: undefined,
};

export const MyContext = createContext<MyDropdownContextType>({
  ...initialState,
});
