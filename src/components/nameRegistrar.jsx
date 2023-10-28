import React, { useState } from "react";
import { useCheckNameAvailability } from "../hooks/useCheckNameAvailability";
import { useAssetLookup } from "../hooks/useAssetLookup";
import { useRegisterName } from "../hooks/useRegisterName";

export default function NameRegistrar() {
  const [checkNameAvailability] = useCheckNameAvailability();
  const [registerName] = useRegisterName();
  const [assetLookup] = useAssetLookup();
  const [name, setName] = useState("");
  const [asset, setAsset] = useState("");
  const [available, setAvailable] = useState(true);
  const [names, setNames] = useState([]);

  const handleNameChange = async (e) => {
    const value = e.target.value;
    setName(value);

    if (value.endsWith(".dero")) {
      const availability = await checkNameAvailability(
        "ae0a1b2c1c8362278cc50333ad28c474537fee19ed771902066dfb4aae6cc9f4",
        value.slice(0, -5)
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
    let names = await assetLookup(
      "ae0a1b2c1c8362278cc50333ad28c474537fee19ed771902066dfb4aae6cc9f4",
      asset
    );
    await registerName(
      "ae0a1b2c1c8362278cc50333ad28c474537fee19ed771902066dfb4aae6cc9f4",
      name.slice(0, -5),
      asset,
      "",
      names.length
    );
    console.log("index", names.length);

    console.log(`Registering name: ${name}`);
  };

  return (
    <>
      <div className="mb-3">
        <input
          type="text"
          placeholder="asset scid"
          value={asset}
          onChange={handleAssetChage}
        />
        <button className="btn btn-primary">No Asset? Mint First</button>
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
    </>
  );
}
