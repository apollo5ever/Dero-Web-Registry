import { useContext } from "react";
import { LoginContext } from "../LoginContext";
import to from "await-to-js";
//import LoggerContext, { LOG } from "@/components/providers/LoggerContext.jsx";

export function useNameToAddress() {
  const [state, setState] = useContext(LoginContext);
  // const logger = useContext(LoggerContext);

  async function nameToAddress(name) {
    if (state.daemonMode == "pools") {
      let data = JSON.stringify({
        jsonrpc: "2.0",
        id: "1",
        method: "DERO.NameToAddress",
        params: {
          name: name,
        },
      });

      let res = await fetch(`https://dero-api.mysrv.cloud/json_rpc`, {
        method: "POST",

        body: data,
        headers: { "Content-Type": "application/json" },
      });
      let body = await res.json();
      let scData = body.result?.address;
      console.log(scData);
      return scData;
    } else if (state.walletMode == "rpc") {
      console.log("rpc get sc");
      const deroBridgeApi = state.deroBridgeApiRef.current;

      const [err, res] = await to(
        deroBridgeApi.daemon("name-to-address", {
          name: name,
        })
      );
      console.log("res", res);
      console.log("res.data", res.data);
      console.log("res.data.result", res.data.result);
      return res?.data?.result?.address;
    } else if (state.walletMode == "xswd") {
      return new Promise((resolve, reject) => {
        const payload = {
          jsonrpc: "2.0",
          id: `nameToAddress${name}`,
          method: "DERO.NameToAddress",
          params: {
            name: name,
          },
        };

        const handleResponse = (response) => {
          console.log("handling it", response.id);
          if (response.id === `nameToAddress${name}`) {
            console.log("yep!", response);
            resolve(response.result?.address);
          }
        };
        state.ws.socket.addEventListener("message", (event) => {
          const response = JSON.parse(event.data);
          handleResponse(response);
        });

        // Send the payload
        state.ws.sendPayload(payload);
      });
    }
  }

  return [nameToAddress];
}
