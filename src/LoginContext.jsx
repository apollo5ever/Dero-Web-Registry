import React, { useState } from "react";
import WebSocketService from "./webSocketService";

const LoginContext = React.createContext([{}, () => {}]);
//const walletListCookie = Cookies.get('walletList');

const ws = new WebSocketService("ws://127.0.0.1:44326/xswd");

const LoginProvider = (props) => {
  const [state, setState] = useState({
    ws: ws,
    walletMode: "rpc",
    daemonMode: "pools",
    scid: "a40759ab41b642551584b9b91eaae4d95482b73627d6eaa9e08b6cc54c06fdac",
  });
  return (
    <LoginContext.Provider value={[state, setState]}>
      {props.children}
    </LoginContext.Provider>
  );
};

export { LoginContext, LoginProvider };
