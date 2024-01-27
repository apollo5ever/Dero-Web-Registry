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
          "8675af8bb767dbd3c36e0ece222bbfde8ab7ace5eee45fc54fba8f7d41a7c8b7",
        walletRegistry:
          "d2ea0ca62a6cd1f3a52bdb0dba444df3e47414504cb662c746b0ae759303af8e",
        dns: "af22a40e06787aa1765166476df3a1b91b2c45bc56a2fe4d55dc07bfe50406d0",
        lotto:
          "982459643483671140fe899bba97890a071f6a13303f2bd7a270e4af70b575b0",
      },
      mainnet: {
        assetRegistry:
          "ead31b12a6e5565cf24247ce8414e9e476c56d3b45358a5e4b7345053923c6da",
        walletRegistry:
          "9d189d114a5ef9c99ec46daa0f29aa44629d2d711f83c7cad92824cf7eadc6ea",
        dns: "842363cc33439116ad02d20d36ddb5200efb11a05a6c34377557bc03003cedf4",
        lotto:
          "8deea4bdf326c3735cc8c57ea89a4024dc97bceb6bd149cb1b6e9862b9034a9b",
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
