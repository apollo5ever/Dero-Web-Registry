import React, { useState, useEffect, useContext } from "react";
import { useSendTransaction } from "../hooks/useSendTransaction";
import { useGetSC } from "../hooks/useGetSC";
import { Button } from "react-bootstrap";
import { LoginContext } from "../LoginContext";

function WalletNameRegistrar() {
  const [sendTransaction] = useSendTransaction();
  const [getSC] = useGetSC();
  const [name, setName] = useState("");
  const [nameList, setNameList] = useState([]);
  const [state, setState] = useContext(LoginContext);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    console.log("using effect");
    const getNames = async () => {
      let names = await getSC(
        "0000000000000000000000000000000000000000000000000000000000000001",
        false,
        true
      );
      setNameList(Object.keys(names.stringkeys));
    };
    if (nameList.length == 0) {
      getNames();
    }
  }, [state]);

  const handleChange = async (e) => {
    const newName = e.target.value;
    setName(newName);
    if (nameList.includes(newName)) {
      setAvailable(false);
    } else {
      setAvailable(true);
    }
    console.log(nameList);
  };

  const register = async () => {
    let data = {
      ringsize: 2,
      scid: "0000000000000000000000000000000000000000000000000000000000000001",
      sc_rpc: [
        {
          name: "entrypoint",
          datatype: "S",
          value: "Register",
        },
        {
          name: "name",
          datatype: "S",
          value: name,
        },
      ],
    };

    await sendTransaction(data);
  };
  return (
    <div className="container mt-5">
      <h1>Register Your Wallet Name</h1>
      <p>
        Give your Dero wallet a name. This utility is free thanks to Captain.
        This name can be used in place of your address when accepting payments.
        Through Dero Web you can now also use this as a .dero domain name.
      </p>
      <input value={name} onChange={handleChange} />

      <Button disabled={!available} onClick={register}>
        Register
      </Button>
    </div>
  );
}
export default WalletNameRegistrar;
