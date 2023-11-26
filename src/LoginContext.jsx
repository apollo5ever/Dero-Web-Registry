import React, { useState } from "react";
import WebSocketService from "./webSocketService";

const LoginContext = React.createContext([{}, () => {}]);
//const walletListCookie = Cookies.get('walletList');

const ws = new WebSocketService("ws://127.0.0.1:44326/xswd");

const LoginProvider = (props) => {
  const [state, setState] = useState({
    ws: ws,
    walletMode: "rpc",
    daemonMode: "user",
    scid: "b0eab292394ee6b3dafe242be1ce9fa67a56dd3cafbc40b6302bd90bc38c0ea1",
    scidMain:
      "9da64a0403f569ac6f8606b33dbee38153ab25579e60efec0757fa51b4227ae0",
    dns: "bda5bbd0147c00a4512d43c1b132fae02f5ad9a739f76b4e52d183d89b4fa9f6",
    lotto: "86a52aa035cca54a07869a10ea5c232606ae7b64073ca004f253df1035ef3a8a",
  });
  return (
    <LoginContext.Provider value={[state, setState]}>
      {props.children}
    </LoginContext.Provider>
  );
};

export { LoginContext, LoginProvider };
