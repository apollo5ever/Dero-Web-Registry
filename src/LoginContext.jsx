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
    scid: "a8801cc71ada2eb38f790472fe41f47be5b6be5a8a6c74f056b455fbbee632d5",
    dns: "8fe3b53bcbbf0dff7898dc9a660b28a687c4f44d22e8b6d07b44d2e9063b6e9e",
    lotto: "cf023a114189ab4e9076c1aced74b77f081d4f1f963c03f4b17e7c87e16083e7",
  });
  return (
    <LoginContext.Provider value={[state, setState]}>
      {props.children}
    </LoginContext.Provider>
  );
};

export { LoginContext, LoginProvider };
