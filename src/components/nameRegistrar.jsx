import React, { useContext, useState } from "react";
import { useCheckNameAvailability } from "../hooks/useCheckNameAvailability";
import { useAssetLookup } from "../hooks/useAssetLookup";
import { useRegisterName } from "../hooks/useRegisterName";
import { LoginContext } from "../LoginContext";

export default function NameRegistrar({ setKey }) {
  const [checkNameAvailability] = useCheckNameAvailability();
  const [registerName] = useRegisterName();
  const [assetLookup] = useAssetLookup();
  const [name, setName] = useState("");
  const [asset, setAsset] = useState("");
  const [available, setAvailable] = useState(true);
  const [names, setNames] = useState([]);
  const [state, setState] = useContext(LoginContext);

  const handleNameChange = async (e) => {
    const value = e.target.value;
    setName(value);

    if (value.endsWith(".dero")) {
      const availability = await checkNameAvailability(
        state.scid,
        value.slice(0, -5),
        ".dero"
      );

      if (availability.scid) {
        setAvailable(false);
      } else {
        setAvailable(true);
      }
    } else {
      setAvailable(true);
    }
  };
  const handleAssetChage = (e) => {
    setAsset(e.target.value);
  };
  const handleRegister = async () => {
    // Add your registration logic here
    let names = await assetLookup(state.scid, asset);
    await registerName(
      state.scid,
      name.slice(0, -5),
      asset,
      "",
      names.length,
      ".dero"
    );
    console.log("index", names.length);

    console.log(`Registering name: ${name}`);
  };

  return (
    <div className="container mt-5">
      <h1>Register Your .dero Domain Name</h1>
      <p>
        You must prepare an asset to pair your .dero name with. Each .dero name
        registration will cost 1 dns.
      </p>
      <div className="mb-3">
        <input
          type="text"
          placeholder="asset scid"
          value={asset}
          onChange={handleAssetChage}
        />
        <button
          className="btn btn-primary"
          onClick={() => {
            setKey("mint");
          }}
        >
          No Asset? Mint First
        </button>
        <input
          type="text"
          placeholder="name"
          value={name}
          onChange={handleNameChange}
          className={`form-control ${!available ? "is-invalid" : ""}`}
        />
        {!available && <div className="invalid-feedback">Name unavailable</div>}
      </div>
      <button
        onClick={handleRegister}
        className="btn btn-primary"
        disabled={!available}
      >
        Register
      </button>
    </div>
  );
}
