import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { LoginProvider } from "./LoginContext.jsx";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import Mint from "./components/mint.jsx";
import NameRegistrar from "./components/nameRegistrar.jsx";
import Wallets from "./components/wallets.jsx";
import Lotto from "./components/lotto.jsx";
import Home from "./components/home.jsx";
import WalletNameRegistrar from "./components/walletNameRegistration.jsx";
import ManageAsset from "./components/manageAsset.jsx";
import Explore from "./components/explore.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LoginProvider>
      <HashRouter>
        <App />

        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/assets/mint" element={<Mint />} />
          <Route path="/assets/manage" element={<ManageAsset />} />
          <Route path="/assets/register" element={<NameRegistrar />} />
          <Route path="/wallets/register" element={<WalletNameRegistrar />} />
          <Route path="/wallets/manage" element={<Wallets />} />
          <Route path="/dns" element={<Lotto />} />
        </Routes>
      </HashRouter>
    </LoginProvider>
  </React.StrictMode>
);
