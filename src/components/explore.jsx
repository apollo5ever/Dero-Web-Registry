import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { useGetSC } from "../hooks/useGetSC";
import { LoginContext } from "../LoginContext";
import hex2a from "../hex2a";
import { useGetDeroIDCard } from "../hooks/useGetDeroIDCard";

export default function Explore() {
  const [getDeroIDCard] = useGetDeroIDCard();
  const [state, setState] = useContext(LoginContext);
  const [getSC] = useGetSC();
  const [dataToken, setDataToken] = useState("");
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const q = searchParams.get("q");
  const [deroID, setDeroID] = useState(null);

  const getSCID = async () => {
    let result = await getSC(state.scids.simulator.assetRegistry, false, true);
    const dataToken = hex2a(result.stringkeys[`data:${q}`]);
    setDataToken(dataToken);
    console.log("result", hex2a(result.stringkeys[`data:zAPOLLO`]));
    const deroID = await getDeroIDCard(dataToken, q);
    setDeroID(deroID);
  };

  useEffect(() => {
    getSCID();
  }, [q]);

  return (
    <>
      <h1>Explore</h1>
      {q}
      {dataToken}
      {deroID}
    </>
  );
}
