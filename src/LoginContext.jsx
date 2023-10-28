import React, { useState } from "react";
import WebSocketService from "./webSocketService";

const LoginContext = React.createContext([{}, () => {}]);
//const walletListCookie = Cookies.get('walletList');

const ws = new WebSocketService("ws://localhost:44326/xswd");

const LoginProvider = (props) => {
  const [state, setState] = useState({
    ws: ws,
    walletMode: "rpc",
    daemonMode: "pools",
  });
  return (
    <LoginContext.Provider value={[state, setState]}>
      {props.children}
    </LoginContext.Provider>
  );
};

export { LoginContext, LoginProvider };
