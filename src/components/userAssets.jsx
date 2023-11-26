import React, { useContext, useState } from "react";
import { useSendTransaction } from "../hooks/useSendTransaction";
import { LoginContext } from "../LoginContext";
import { useGetSC } from "../hooks/useGetSC";
import hex2a from "../hex2a";

export default function UserAssets() {
  const [sendTransaction] = useSendTransaction();
  const [state, setState] = useContext(LoginContext);
  const [getSC] = useGetSC();
  const [names, setNames] = useState([]);

  //let's load asset first to create array of name/index pairs

  const loadAsset = async (event) => {
    event.preventDefault();
    let scData = await getSC(state.scid, false, true);
    const assetSearch = new RegExp(`n.dero${event.target.scid.value}`);
    let names = Object.keys(scData.stringkeys)
      .filter((x) => assetSearch.test(x))
      .map(
        (x) =>
          new Object({
            name: hex2a(scData.stringkeys[x]),
            index: x.slice(70),
          })
      );
    console.log("load asset", names);
    setNames(names);
  };

  const updateAsset = async (event) => {
    event.preventDefault();
    let scData = await getSC(state.scid, false, true);

    let data = {
      scid: state.scid,
      ringsize: 2,
      transfers: [
        {
          burn: 1,
          scid: event.target.oldSCID.value,
        },
      ],
      sc_rpc: [
        {
          name: "entrypoint",
          value: "UpdateAsset",
          datatype: "S",
        },
        {
          name: "collection",
          value: ".dero",
          datatype: "S",
        },
        {
          name: "name",
          value: "",
          datatype: "S",
        },
        {
          name: "scid",
          value: event.target.newSCID.value,
          datatype: "S",
        },
        {
          name: "index",
          value: 0,
          datatype: "U",
        },
      ],
    };
    await sendTransaction(data);
  };

  const setURL = async (event) => {
    event.preventDefault();
    let data = {
      scid: event.target.scid.value,
      ringsize: 2,
      transfers: [
        {
          burn: 1,
          scid: event.target.scid.value,
        },
      ],
      sc_rpc: [
        {
          name: "entrypoint",
          value: "SetUrl",
          datatype: "S",
        },
        {
          name: "t",
          value: "",
          datatype: "S",
        },
        {
          name: "url",
          value: event.target.url.value,
          datatype: "S",
        },
      ],
    };
    await sendTransaction(data);
  };
  return (
    <>
      <h1>Your Assets</h1>
      <h3>Basic Name Tokens</h3>
      {names.map((x) => (
        <div key={x.index}>
          <p>{x.name}</p>
          <button onClick={() => transferName(x.index)}>Transfer Name</button>
          <button onClick={() => updateUrl(x.index)}>Update URL</button>
        </div>
      ))}
      {/* Existing code for loading asset */}

      {/* Bootstrap modal for transferring name */}
      {selectedName !== null && (
        <div className="modal">
          {/* Modal content for transferring name */}
          <button onClick={handleTransfer}>Transfer</button>
        </div>
      )}

      {/* Bootstrap modal for updating URL */}
      {selectedName !== null && (
        <div className="modal">
          {/* Modal content for updating URL */}
          <button onClick={handleUpdateUrl}>Update URL</button>
        </div>
      )}
    </>
  );
}
