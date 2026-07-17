import { DropdownData } from "./DropdownContext";
import { dateUpdate } from "../query";
import { useQuery } from "@tanstack/react-query";

function Header() {
  const { data } = useQuery<any>({
    queryKey: ["As_Of_Date"],
    queryFn: () => dateUpdate("Utility"),
    staleTime: Infinity,
  });
  const asofdate = data ?? "";

  return (
    <>
      <header
        slot="header"
        id="header-title"
        style={{
          display: "flex",

          height: "70px",
          padding: "0 1rem",
          borderStyle: "solid",
          borderWidth: 3.5,
          borderColor: "#555555",
        }}
      >
        <img
          src="https://EijiGorilla.github.io/Symbols/Projec_Logo/DOTr_Logo_v2.png"
          alt="DOTr Logo"
          height={"55px"}
          width={"55px"}
          style={{
            marginBottom: "auto",
            marginTop: "auto",
          }}
        />
        <h2 style={{ color: "white", marginLeft: "15px", width: "40%" }}>
          SC UTILITY
        </h2>
        <div
          style={{
            color: "#9ca3af",
            marginTop: "auto",
            width: "100%",
            paddingLeft: "70px",
          }}
        >
          {!asofdate ? "" : "As of " + asofdate}
        </div>

        {/* Dropdown component */}
        <DropdownData />

        <img
          src="https://EijiGorilla.github.io/Symbols/Projec_Logo/GCR LOGO.png"
          alt="GCR Logo"
          height={"50px"}
          width={"75px"}
          style={{
            marginBottom: "auto",
            marginTop: "auto",

            marginLeft: "25px",
            paddingRight: "35px",
          }}
        />
      </header>
    </>
  );
}

export default Header;
