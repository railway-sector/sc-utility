import { useState } from "react";
import Select from "react-select";
import "../index.css";
import { utilityLineLayer, utilityPointLayer } from "../layers";
import GenerateDropdownData from "npm-dropdown-package";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { locationKeys } from "../interfaceKeys";
import type { SelectedLocation } from "../interfaceKeys";

export function DropdownData() {
  const queryClient = useQueryClient();

  const [cpSelected, setCpSelected] = useState<null | any>(null);
  const [companySelected, setCompanySelected] = useState<null | any>(null);
  const [utypeSelected, setUtypeSelected] = useState<null | any>(null);

  const [companyList, setCompanyList] = useState<any>([]);
  const [utypeList, setUtypeList] = useState<any>([]);

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

  // this instantly updates the global cache
  function updateDropdownListValues(
    cp_obj_field: SelectedLocation["cpackage"],
    comp_obj_field: SelectedLocation["company"],
    utype_obj_field: SelectedLocation["utype"],
  ) {
    return queryClient.setQueryData<SelectedLocation>(locationKeys.selected, {
      cpackage: cp_obj_field,
      company: comp_obj_field,
      utype: utype_obj_field,
    });
  }

  const handleContractPackageChange = (obj: any) => {
    updateDropdownListValues(obj.field1, undefined, undefined);
    setCpSelected(obj);
    setCompanyList(obj.field2);
    setCompanySelected(null);
    setUtypeSelected(null);
  };

  const handleCompanyChange = (obj: any) => {
    updateDropdownListValues(cpSelected?.field1, obj.name, undefined);
    setCompanySelected(obj);
    setUtypeList(obj.field3);
    setUtypeSelected(null);
  };

  const handleTypeChange = (obj: any) => {
    updateDropdownListValues(
      cpSelected?.field1,
      companySelected?.name,
      obj.name,
    );
    setUtypeSelected(obj);
  };

  // Style CSS
  const customstyles = {
    option: (styles: any, { isFocused, isSelected }: any) => {
      // const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isFocused
          ? "#555555"
          : isSelected
            ? "#2b2b2b"
            : "#2b2b2b",
        color: "#ffffff",
      };
    },

    control: (defaultStyles: any) => ({
      ...defaultStyles,
      backgroundColor: "#2b2b2b",
      borderColor: "#949494",
      height: 35,
      width: "170px",
      color: "#ffffff",
    }),
    singleValue: (defaultStyles: any) => ({ ...defaultStyles, color: "#fff" }),
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        margin: "auto",
        padding: "5px",
        borderRadius: "5px",
      }}
    >
      <b style={{ color: "white", margin: 10, fontSize: "0.9vw" }}></b>
      <Select
        placeholder="Select CP"
        value={cpSelected}
        options={cpackageList && cpackageList}
        onChange={handleContractPackageChange}
        getOptionLabel={(x: any) => x.field1}
        styles={customstyles}
      />
      <br />
      <b style={{ color: "white", margin: 10, fontSize: "0.9vw" }}></b>
      <Select
        placeholder="Select Company"
        value={companySelected}
        options={companyList && companyList}
        onChange={handleCompanyChange}
        getOptionLabel={(x: any) => x.name}
        styles={customstyles}
      />
      <br />
      <b style={{ color: "white", margin: 10, fontSize: "0.9vw" }}></b>
      <Select
        placeholder="Select Type"
        value={utypeSelected}
        options={utypeList && utypeList}
        onChange={handleTypeChange}
        getOptionLabel={(x: any) => x.name}
        styles={customstyles}
      />
    </div>
  );
}
