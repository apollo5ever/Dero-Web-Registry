import React from "react";
import OAOCard from "../components/oaoCard";
import { useGetSC } from "./useGetSC";
import hex2a from "../hex2a";

export function useGetOAOCard() {
  const [getSC] = useGetSC();
  const getOAOCard = async (scid, name) => {
    const result = await getSC(scid, false, true);
    const url = hex2a(result.stringkeys.URL);
    const CEO = hex2a(result.stringkeys.CEO);

    return (
      <OAOCard
        scid={scid}
        name={name}
        url={url}
        //reputation={reputation}
      />
    );
  };
  return [getOAOCard];
}
