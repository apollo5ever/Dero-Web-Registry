import { Api, generateAppId } from "dero-xswd-api";
import React, { useContext, useState, useEffect } from "react";
import { LoginContext } from "../LoginContext";

export default function XSWDConnect() {
  const [state, setState] = useContext(LoginContext);
  const [connected, setConnected] = useState(false);

  /*   useEffect(() => {
    if (!connected) {
      handleConnect();
    }
  }, []); */
  const handleConnect = async () => {
    const name = "Dero Web";
    const appInfo = {
      id: await generateAppId(name),
      name,
      description: "Truly unstoppable",
    };
    const xswd = new Api(appInfo);
    xswd.config.ip = "127.0.0.1";
    //setState({ ...state, xswd: xswd });
    await xswd.initialize();
    console.log(xswd);

    setState({ ...state, xswd: xswd });

    setConnected(true);
  };
  return (
    <button onClick={handleConnect}>
      {connected ? "Connected" : "Connect"}
    </button>
  );
}
