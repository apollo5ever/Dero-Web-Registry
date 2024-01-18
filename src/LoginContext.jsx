import React, { useState } from "react";
import { XSWDConnection } from "dero-xswd-api";
//import WebSocketService from "./webSocketService";

const LoginContext = React.createContext([{}, () => {}]);
//const walletListCookie = Cookies.get('walletList');

//const ws = new WebSocketService("ws://127.0.0.1:44326/xswd");

//mainnet scids
const mainAssetRegistry =
  "f8a81d0e5c5f9df1f9e41b186f77d1ddbd4daab4e25a380ddde44d66c040da8f";
const mainWalletData =
  "9d189d114a5ef9c99ec46daa0f29aa44629d2d711f83c7cad92824cf7eadc6ea";
const mainDNS = "";

//simulator scids
const simAssetRegistry =
  "f00339a150660cabd311fedbb75e582ac0a101152741ff93fa9ed4668361a496";
const simWalletData =
  "d2ea0ca62a6cd1f3a52bdb0dba444df3e47414504cb662c746b0ae759303af8e";
const simDNS =
  "94f68877bf389263f39036d01d1975fedc63082262860c5a1324b7d39b9a2ccf";

const LoginProvider = (props) => {
  const [state, setState] = useState({
    walletMode: "rpc",
    daemonMode: "user",
    scids: {
      simulator: {
        assetRegistry:
          "f00339a150660cabd311fedbb75e582ac0a101152741ff93fa9ed4668361a496",
        walletRegistry:
          "d2ea0ca62a6cd1f3a52bdb0dba444df3e47414504cb662c746b0ae759303af8e",
        dns: "c75a2fe3a8a00dab1931e7cf9c0077a5e2a9bfb0516abde4b88d58c8dccf86f1",
        lotto:
          "a4794babd817991e7af6d527f30247377a3cb682350793543f21a5bcd0a701c1",
      },
      mainnet: {
        assetRegistry:
          "f8a81d0e5c5f9df1f9e41b186f77d1ddbd4daab4e25a380ddde44d66c040da8f",
        walletRegistry:
          "9d189d114a5ef9c99ec46daa0f29aa44629d2d711f83c7cad92824cf7eadc6ea",
        dns: "bda5bbd0147c00a4512d43c1b132fae02f5ad9a739f76b4e52d183d89b4fa9f6",
      },
    },
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
