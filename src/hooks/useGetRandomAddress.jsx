import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { LoginContext } from "../LoginContext";
import DeroBridgeApi from "dero-rpc-bridge-api";
import to from "await-to-js";

export function useGetRandomAddress() {
  const [state, setState] = useContext(LoginContext);
  const [walletInfo, setWalletInfo] = useState(null);

  const getRandomRPC = useCallback(async (deroBridgeApiRef) => {
    let dba;
    if (state.deroBridgeApiRef) {
      dba = state.deroBridgeApiRef.current;
    } else {
      dba = deroBridgeApiRef.current;
    }

    const [err0, res0] = await to(dba.daemon("get-random-address", {}));

    return res0.data.result.address[0];
  });

  const getRandomPools = async () => {
    let data = JSON.stringify({
      jsonrpc: "2.0",
      id: "1",
      method: "DERO.GetRandomAddress",
    });

    let res = await fetch(`https://dero-api.mysrv.cloud/json_rpc`, {
      method: "POST",

      body: data,
      headers: { "Content-Type": "application/json" },
    });
    let body = await res.json();

    return body.result.address[42];
  };

  const getRandomXSWD = async () => {
    return new Promise((resolve, reject) => {
      const payload = {
        jsonrpc: "2.0",
        id: `getRandomAddress`,
        method: "DERO.GetRandomAddress",
      };

      const handleResponse = (response) => {
        console.log("handling it", response.id);
        if (response.id === `getRandomAddress`) {
          console.log("yep!", response);
          resolve(response.result);
        }
      };
      state.ws.socket.addEventListener("message", (event) => {
        const response = JSON.parse(event.data);
        handleResponse(response);
      });

      // Send the payload
      state.ws.sendPayload(payload);
    });
  };

  const getRandomAddress = async (deroBridgeApiRef) => {
    console.log("gettring random address");
    if (state.daemonMode == "pools") {
      return getRandomPools();
    } else if (state.walletMode == "rpc") {
      return await getRandomRPC(deroBridgeApiRef);
    } else if (state.walletMode == "xswd") {
      return;
    }
  };

  return [getRandomAddress];
}
