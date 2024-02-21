import React, { useContext, useEffect, useState } from "react";
import { useGetSC } from "../hooks/useGetSC";
import { useSendTransactionWithGas } from "../hooks/useSendTransactionWithGas";
import { LoginContext } from "../LoginContext";
import hex2a from "../hex2a";
import { useGetRandomAddress } from "../hooks/useGetRandomAddress";
import { useGetAddress } from "../hooks/useGetAddress";

/*
What this component do
input field for name
similar to search page
once it finds the asset:
  actions:
    change data with key
    change key (and cost) with key
    change owner with key
    change data with wallet
    change key (and cost) with wallet
    change owner with wallet
*/

function ManageAsset() {
  const [state, setState] = useContext(LoginContext);
  const [getSC] = useGetSC();
  const [sendTransactionWithGas] = useSendTransactionWithGas();
  const [name, setName] = useState("");
  const [dataToken, setDataToken] = useState("");
  const [newData, setNewData] = useState("");
  const [dataType, setDataType] = useState("");
  const [newDataType, setNewDataType] = useState("");
  const [key, setKey] = useState("");
  const [newKey, setNewKey] = useState("");
  const [transferCost, setTransferCost] = useState(1);
  const [newTransferCost, setNewTransferCost] = useState("");
  const [owner, setOwner] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [getRandomAddress] = useGetRandomAddress();
  const [getAddress] = useGetAddress();

  const updateData = async () => {
    let randomAddress = await getRandomAddress();
    let address = await getAddress();
    if (address == owner) {
      // use owner store
    } else {
      let txid = await sendTransactionWithGas({
        scid: state.scids.mainnet.assetRegistry,
        ringsize: 2,
        transfers: [
          {
            scid: key,
            burn: 1,
            destination: randomAddress,
          },
        ],
        sc_rpc: [
          {
            name: "entrypoint",
            datatype: "S",
            value: "ChangeData",
          },
          {
            name: "name",
            datatype: "S",
            value: name,
          },
          {
            name: "data",
            datatype: "S",
            value: newData,
          },
          {
            name: "datatype",
            datatype: "S",
            value: newDataType,
          },
          {
            name: "address",
            datatype: "S",
            value: address,
          },
        ],
      });
    }
  };

  const getAsset = async () => {
    let nameLower = name.toLowerCase();
    let result = await getSC(state.scids.mainnet.assetRegistry, false, true);
    const dataToken = hex2a(result.stringkeys[`data:${nameLower}`]);
    const dataType = hex2a(result.stringkeys[`datatype:${nameLower}`]);
    const key = hex2a(result.stringkeys[`key:${nameLower}`]);
    const transferCost = result.stringkeys[`transferCost:${nameLower}`];
    const owner = hex2a(result.stringkeys[`owner:${nameLower}`]);
    setDataToken(dataToken);
    setNewData(dataToken);
    setDataType(dataType);
    setNewDataType(dataType);
    setKey(key);
    setNewKey(key);
    setTransferCost(transferCost);
    setNewTransferCost(transferCost);
    setOwner(owner);
    setNewOwner(owner);
  };

  useEffect(() => {
    getAsset();
  }, [name]);

  return (
    <div className="container mt-5">
      <h1>Manage Your Asset Names</h1>
      <div className="mb-3">
        <input
          className="form-control"
          placeholder="Asset Name"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {/*<button className="btn btn-success me-2">Find</button>*/}
      </div>
      <div className="mb-3">Name: {name && name}</div>
      <div className="mb-3">
        Data:{" "}
        <input
          className="form-control"
          placeholder="Data Token"
          id="dataToken"
          name="dataToken"
          value={newData}
          onChange={(e) => setNewData(e.target.value)}
        />
        <button className="btn btn-success me-2" onClick={updateData}>
          Update Data
        </button>
      </div>
      <div className="mb-3">
        Data Type:{" "}
        <input
          className="form-control"
          placeholder="Data Type"
          id="dataType"
          name="dataType"
          value={newDataType}
          onChange={(e) => setNewDataType(e.target.value)}
        />
        <button className="btn btn-success me-2">Update Data Type</button>
      </div>
      <div className="mb-3">
        Key Token:{" "}
        <input
          className="form-control"
          placeholder="Key Token"
          id="key"
          name="key"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
        />
        Transfer Cost:{" "}
        <input
          className="form-control"
          placeholder="Transfer Cost"
          id="transferCost"
          dataToken
          name="transferCost"
          value={newTransferCost}
          onChange={(e) => setNewTransferCost(e.target.value)}
          type="number"
        />
        <button className="btn btn-success me-2">
          Update Key Token & Transfer Cost
        </button>
      </div>

      <div className="mb-3">
        Owner:{" "}
        <input
          className="form-control"
          placeholder="Owner (Dero Address)"
          id="owner"
          name="owner"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
        />
        <button className="btn btn-success me-2">Update Owner</button>
      </div>
      <div className="mb-3">
        <h4>What Does All This Mean?</h4>
        <p>
          Dero Web's dns naming system gives you a few options. When you
          register your name you can decide how to attach your data to your
          name, and how your name will be managed going forward.
        </p>
        <h5>Key SCID</h5>
        <p>
          This is the scid for the asset used to control the name. With this key
          token, the name can be transferred to a new party, or its data can be
          modified.
        </p>
        <h5>Data SCID</h5>
        <p>
          This is the scid for the contract which contains the data you want
          your name to point to.
        </p>
        <h5>Data Type</h5>
        <p>
          This informs UIs how to parse the data stored in the contract. For
          example this could be nameOAO, DeroID, Basic Name Token, or something
          else.
        </p>
        <h5>Owner</h5>
        <p>
          This is the address that has full authority to transfer ownership or
          update name data. This field is optional. If you want your name to be
          held by an organization and not an individual, leave this blank.
        </p>
        <h5>Transfer Cost</h5>
        <p>
          This determines how many key tokens are required to change name
          ownership. Typically 1 for individually held names, and many for names
          held be organization.
        </p>
      </div>
    </div>
  );
}

export default ManageAsset;
