import React, { useContext } from "react";
import { useSendTransaction } from "./useSendTransaction";
import { useCheckNameAvailability } from "./useCheckNameAvailability";
import { useRegisterName } from "./useRegisterName";
import { LoginContext } from "../LoginContext";

export function useMintIsland() {
  const [sendTransaction] = useSendTransaction();
  const [checkNameAvailability] = useCheckNameAvailability();
  const [registerName] = useRegisterName();
  const [state, setState] = useContext(LoginContext);

  async function mintIsland(data) {
    try {
      const available = await checkNameAvailability(
        state.scid,
        data.name,
        "PRIVATE-ISLANDS"
      );
      console.log("available ", available);
      if (available.scid != null) {
        return "This island name already exists";
      }

      //probably good idea to put get gas estimate in here
      const response = await fetch("/island.bas");
      const scData = await response.text();
      const sc = btoa(scData);
      const result = await sendTransaction({
        ringsize: 2,
        sc,
        sc_rpc: [
          { name: "entrypoint", datatype: "S", value: "Initialize" },
          { name: "Name", datatype: "S", value: data.name },
          { name: "Tagline", datatype: "S", value: data.tagline },
          { name: "Image", datatype: "S", value: data.image },
          { name: "Bio", datatype: "S", value: data.bio },
        ],
      });
      await registerName(
        state.scid,
        data.name,
        result,
        "",
        0,
        "PRIVATE-ISLANDS"
      );

      return result;
    } catch (error) {
      console.error("Error reading or sending transaction:", error);
      return null; // You might want to handle errors appropriately
    }
  }

  return [mintIsland];
}
