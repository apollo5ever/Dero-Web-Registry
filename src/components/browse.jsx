import React, { useState, useContext, useEffect } from "react";
import { LoginContext } from "../LoginContext";
import { useSendTransaction } from "../hooks/useSendTransaction";
import { useGetGasEstimate } from "../hooks/useGetGasEstimate";
import { useGetAddress } from "../hooks/useGetAddress";
import { useGetSC } from "../hooks/useGetSC";
import SearchBar from "./searchBar";

export default function Browse() {
  const [state, setState] = useContext(LoginContext);
  const [amount, setAmount] = useState(1);
  const [sendTransaction] = useSendTransaction();
  const [getGasEstimate] = useGetGasEstimate();
  const [getAddress] = useGetAddress();
  const [getSC] = useGetSC();
  const [collections, setCollections] = useState([]);

  const scid = state.scid;

  useEffect(() => {
    const getCollections = async () => {
      let collectionArr = [];
      const scData = await getSC(scid, false, true);
      const collectionPattern = /c*.Owner\b/;
      let collections = Object.keys(scData.stringkeys).filter((x) =>
        collectionPattern.test(x)
      );
      for (let i = 0; i < collections.length; i++) {
        let collection = collections[i].slice(1, -5);
        console.log("collection", collection);
        collectionArr.push({ name: collection });
      }
      setCollections(collectionArr);
    };
    getCollections();
  }, [state.daemonMode]);

  const handleAmountChange = (e) => {
    const value = parseInt(e.target.value, 10);

    // If the value is valid (a positive integer or zero), update the state.
    // Otherwise, set it to 1 (minimum value).
    setAmount(isNaN(value) || value <= 0 ? 1 : value);
  };

  const handlePurchase = async () => {
    const address = await getAddress();
    console.log("user is purchasing ", amount, " tickets");
    const fees = await getGasEstimate({
      scid: scid,
      ringsize: 2,
      signer: address,
      transfers: [
        {
          burn: parseInt(amount * 1000),
          scid: dns,
        },
      ],
      gas_rpc: [
        {
          name: "SC_ACTION",
          datatype: "U",
          value: 0,
        },
        {
          name: "SC_ID",
          datatype: "H",
          value: scid,
        },
        {
          name: "entrypoint",
          datatype: "S",
          value: "BuyTickets",
        },
      ],
    });
    sendTransaction({
      scid: scid,
      ringsize: 2,
      fees: fees,
      transfers: [
        {
          burn: parseInt(amount * 1000),
          scid: dns,
        },
      ],
      sc_rpc: [
        {
          name: "entrypoint",
          datatype: "S",
          value: "BuyTickets",
        },
      ],
    });
  };

  return (
    <div className="container mt-5">
      <SearchBar />
      {collections.map((x) => (
        <h1>{x.name}</h1>
      ))}
    </div>
  );
}
