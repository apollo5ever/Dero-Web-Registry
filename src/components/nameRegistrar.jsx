import React, { useContext, useState } from "react";
import { useCheckNameAvailability } from "../hooks/useCheckNameAvailability";
import { useAssetLookup } from "../hooks/useAssetLookup";
import { useRegisterName } from "../hooks/useRegisterName";
import { LoginContext } from "../LoginContext";
import { Link } from "react-router-dom";

export default function NameRegistrar({ setKey }) {
  const [checkNameAvailability] = useCheckNameAvailability();
  const [registerName] = useRegisterName();
  const [assetLookup] = useAssetLookup();
  const [name, setName] = useState("");
  const [asset, setAsset] = useState("");
  const [available, setAvailable] = useState(true);
  const [names, setNames] = useState([]);
  const [state, setState] = useContext(LoginContext);
  const simulatorscid =
    "9c641071a8dcca07dd4faaefbeb0cfd18512c649b773be8add9019ddd865c886";
  const dnsRegistrar = simulatorscid;
  const [formData, setFormData] = useState({
    owner: "",
    name: "",
    key: "",
    dataToken: "",
    dataType: "",
    transferCost: 1,
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const toggleAdvanced = () => {
    setShowAdvanced(!showAdvanced);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNameChange = async (e) => {
    const value = e.target.value;
    setName(value);

    const availability = await checkNameAvailability(
      dnsRegistrar,
      value,
      ".dns"
    );

    if (availability.scid) {
      setAvailable(false);
    } else {
      setAvailable(true);
    }
  };
  const handleAssetChage = (e) => {
    setAsset(e.target.value);
  };
  const handleRegister = async () => {
    // Add your registration logic here
    let names = await assetLookup(dnsRegistrar, asset);
    await registerName(dnsRegistrar, name, asset, "", names.length, ".dns");
    console.log("index", names.length);

    console.log(`Registering name: ${name}`);
  };

  return (
    <div className="container mt-5">
      <h1>Name Your Asset</h1>
      <p>
        You must prepare an asset first. You can{" "}
        <Link to={"/assets/mint"}>mint here</Link> for free.
      </p>
      <p> Asset name registration costs 1 DNS.</p>
      <div className="mb-3">
        <input
          type="text"
          placeholder="name"
          value={name}
          onChange={handleNameChange}
          className={`form-control ${!available ? "is-invalid" : ""}`}
        />
        {!available && <div className="invalid-feedback">Name unavailable</div>}

        {showAdvanced ? (
          <div>
            <input
              className={"form-control"}
              placeholder="key scid"
              name="key"
              value={formData.key}
              onChange={handleFormChange}
            />
            <input
              className={"form-control"}
              placeholder="data scid"
              name="dataToken"
              value={formData.dataToken}
              onChange={handleFormChange}
            />
            <input
              className={"form-control"}
              placeholder="data type"
              name="dataType"
              value={formData.dataType}
              onChange={handleFormChange}
            />
            <input
              className={"form-control"}
              placeholder="owner"
              name="owner"
              value={formData.owner}
              onChange={handleFormChange}
            />

            <input
              className={"form-control"}
              placeholder="transferCost"
              name="transferCost"
              value={formData.transferCost}
              onChange={handleFormChange}
            />
            <h4>What Does All This Mean?</h4>
            <p>
              Dero Web's dns naming system gives you a few options. When you
              register your name you can decide how to attach your data to your
              name, and how your name will be managed going forward.
            </p>
            <h5>Key SCID</h5>
            <p>
              This is the scid for the asset used to control the name. With this
              key token, the name can be transferred to a new party, or its data
              can be modified.
            </p>
            <h5>Data SCID</h5>
            <p>
              This is the scid for the contract which contains the data you want
              your name to point to.
            </p>
            <h5>Data Type</h5>
            <p>
              This informs UIs how to parse the data stored in the contract. For
              example this could be nameOAO, DeroID, Basic Name Token, or
              something else.
            </p>
            <h5>Owner</h5>
            <p>
              This is the address that has full authority to transfer ownership
              or update name data. This field is optional. If you want your name
              to be held by an organization and not an individual, leave this
              blank.
            </p>
            <h5>Transfer Cost</h5>
            <p>
              This determines how many key tokens are required to change name
              ownership. Typically 1 for individually held names, and many for
              names held be organization.
            </p>
          </div>
        ) : (
          <div>
            <input
              type="text"
              placeholder="asset scid"
              value={asset}
              onChange={handleAssetChage}
            />
          </div>
        )}
      </div>

      <p>
        <u style={{ cursor: "pointer" }} onClick={toggleAdvanced}>
          {showAdvanced ? "Hide Advanced" : "Show Advanced"}
        </u>
      </p>

      <button
        onClick={handleRegister}
        className="btn btn-primary"
        disabled={!available}
      >
        Register
      </button>
      <br />
      <br />
      <br />
      {/*  <div>
        <h1>Transfer Your Name</h1>
        <p>Assign a new asset to your name.</p>
        <input
          className={"form-control"}
          id="name"
          name="name"
          placeholder="name"
          value={transferForm.name}
          onChange={handleTransferChange}
        />
        <input className={"form-control"} placeholder="new asset scid" />
      </div> */}
    </div>
  );
}
