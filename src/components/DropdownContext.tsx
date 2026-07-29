import { use, useMemo, useState } from "react";
import Select from "react-select";
import "../index.css";
import { utilityLineLayer, utilityPointLayer } from "../layers";
import GenerateDropdownData from "dropdown-pkg-arcgis";
import { useQuery } from "@tanstack/react-query";
import { MyContext } from "../contexts/MyContext";

const theme = {
  bg: "#2b2b2b",
  bgDisabled: "#232323",
  border: "#444444",
  borderHover: "#5a5a5a",
  borderFocus: "#6aa9ff",
  text: "#ffffff",
  textMuted: "#9a9a9a",
  optionFocused: "#3a3a3a",
  optionSelected: "#353535",
};

const customStyles = {
  container: (s: any) => ({ ...s, width: "180px" }),
  control: (s: any, { isDisabled, isFocused }: any) => ({
    ...s,
    backgroundColor: isDisabled ? theme.bgDisabled : theme.bg,
    borderColor: isFocused ? theme.borderFocus : theme.border,
    borderRadius: "6px",
    minHeight: "36px",
    boxShadow: "none",
    opacity: isDisabled ? 0.6 : 1,
    "&:hover": {
      borderColor: isFocused ? theme.borderFocus : theme.borderHover,
    },
  }),
  placeholder: (s: any) => ({ ...s, color: theme.textMuted }),
  singleValue: (s: any) => ({ ...s, color: theme.text }),
  input: (s: any) => ({ ...s, color: theme.text }),
  indicatorSeparator: (s: any) => ({ ...s, backgroundColor: theme.border }),
  dropdownIndicator: (s: any) => ({
    ...s,
    color: theme.textMuted,
    "&:hover": { color: theme.text },
  }),
  clearIndicator: (s: any) => ({
    ...s,
    color: theme.textMuted,
    "&:hover": { color: theme.text },
  }),
  menu: (s: any) => ({
    ...s,
    backgroundColor: theme.bg,
    border: `1px solid ${theme.border}`,
    overflow: "hidden",
  }),
  option: (s: any, { isFocused, isSelected }: any) => ({
    ...s,
    backgroundColor: isFocused
      ? theme.optionFocused
      : isSelected
        ? theme.optionSelected
        : theme.bg,
    color: theme.text,
    cursor: "pointer",
  }),
};

export function DropdownData() {
  const { updateCpackage, updateCompany, updateUtype } = use(MyContext);

  const [cpSelected, setCpSelected] = useState<null | any>(null);
  const [compSelected, setCompSelected] = useState<null | any>(null);
  const [utypeSelected, setUtypeSelected] = useState<null | any>(null);

  const { data: cpackageList } = useQuery<any>({
    queryKey: ["dropdownData"], // Do not add lotLayer as a dependency. The dropdown list will not be updated properly.
    queryFn: async () => {
      const dropdownData = new GenerateDropdownData(
        [utilityPointLayer, utilityLineLayer],
        ["CP", "Company", "Type"],
      );
      return await dropdownData.dropDownQuery();
    },
    staleTime: Infinity, // never refetch in the backround on its own.
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  //-- Recompute only when CP is changed:
  const companyList = useMemo(() => cpSelected?.field2 ?? [], [cpSelected]);
  const utypeList = useMemo(() => compSelected?.field3 ?? [], [compSelected]);

  const handleContractPackageChange = (obj: any) => {
    updateCpackage(obj?.field1 ?? null);
    updateCompany(null);
    updateUtype(null);
    setCpSelected(obj);
    setCompSelected(null);
    setUtypeSelected(null);
  };

  const handleCompanyChange = (obj: any) => {
    updateCompany(obj?.name ?? null);
    updateUtype(null);
    setCompSelected(obj);
    setUtypeSelected(null);
  };

  const handleTypeChange = (obj: any) => {
    updateUtype(obj?.name ?? null);
    setUtypeSelected(obj);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        margin: "auto",
        borderRadius: "5px",
        gap: "12px",
        marginRight: "15%",
      }}
    >
      <Select
        placeholder="Select CP"
        value={cpSelected}
        options={cpackageList && cpackageList}
        onChange={handleContractPackageChange}
        getOptionLabel={(x: any) => x.field1}
        isClearable
        styles={customStyles}
      />
      <br />

      <Select
        placeholder="Select Company"
        value={compSelected}
        options={companyList && companyList}
        onChange={handleCompanyChange}
        getOptionLabel={(x: any) => x.name}
        isClearable
        styles={customStyles}
      />
      <br />

      <Select
        placeholder="Select Type"
        value={utypeSelected}
        options={utypeList && utypeList}
        onChange={handleTypeChange}
        getOptionLabel={(x: any) => x.name}
        isClearable
        styles={customStyles}
      />
    </div>
  );
}
