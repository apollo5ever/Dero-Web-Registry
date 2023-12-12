import React, { useContext, useState, useEffect } from "react";
import { LoginContext } from "../LoginContext";
import { useUpdateAddress } from "../hooks/useUpdateAddress";
import { useGetSC } from "../hooks/useGetSC";
import { useNameToAddress } from "../hooks/useNameToAddress";
import { useGetAddress } from "../hooks/useGetAddress";
import RichTextEditor from "./richTextEditor";
import ensureHttps from "../ensureHttps";

export default function DnsRegistrar({ setKey }) {
  const [updateAddress] = useUpdateAddress();
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [available, setAvailable] = useState(true);
  const [names, setNames] = useState([]);
  const [state, setState] = useContext(LoginContext);
  const [getSC] = useGetSC();
  const [nameToAddress] = useNameToAddress();
  const [getAddress] = useGetAddress();
  const [editorHtml, setEditorHtml] = useState("");
  const mainnetscid =
    "9d189d114a5ef9c99ec46daa0f29aa44629d2d711f83c7cad92824cf7eadc6ea";

  useEffect(() => {
    // getNames();
  }, [state.deroBridgeApiRef, state.daemon]);

  const getNames = async () => {
    const userAddress = await getAddress();
    let pubKey = "";
    const namesSC = await getSC(
      "0000000000000000000000000000000000000000000000000000000000000001",
      false,
      true
    );
    console.log(namesSC.stringkeys);
    for (let name of Object.keys(namesSC.stringkeys)) {
      let address = await nameToAddress(name);
      if (address == userAddress) {
        pubKey = namesSC.stringkeys[name];
        break;
      }

      console.log(address);
      console.log(state);
    }
    for (let name of Object.keys(namesSC.stringkeys)) {
      if (namesSC.stringkeys[name] == pubKey) {
        console.log(name);
      }
    }
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handleRegister = async () => {
    await updateAddress(mainnetscid, name + "url", ensureHttps(url), "0");
  };

  const handleHTMLRegister = async () => {
    await updateAddress(mainnetscid, name + "html-0", editorHtml, "0");
  };

  const makeHTMLPriority = async () => {
    await handlePriorityUpdate("html");
  };
  const makeURLPriority = async () => {
    await handlePriorityUpdate("url");
  };

  const handlePriorityUpdate = async (priority) => {
    await updateAddress(mainnetscid, name + "webExtPriority", priority, "0");
  };

  return (
    <div className="container mt-5">
      <h1>Add Data to Your Dero Wallet Name</h1>
      <p>
        If you've already registered a name for you dero address then you
        already have your ".dero" domain. You can either register a URL or
        inscribe html directly to the dero blockchain.
      </p>
      <p>
        If your wallet has multiple names registered to it, you can assign
        different data to each name. Enter a specific name, or leave this field
        empty to add generic data which all unassigned names will point to.
      </p>
      <div className="mb-3">
        <input
          type="text"
          placeholder="name you control (optional)"
          value={name}
          onChange={handleNameChange}
        />
        <br />
        <br />
        <br />
        <h3>Assign a URL</h3>
        <input
          type="text"
          placeholder="example.com or ip address"
          value={url}
          onChange={handleUrlChange}
        />
      </div>
      <button onClick={handleRegister} className="btn btn-primary">
        Register URL
      </button>{" "}
      <button onClick={makeURLPriority} className="btn btn-primary">
        Make Default
      </button>
      <h2>OR</h2>
      <h3>Inscribe HTML directly to the Dero blockchain</h3>
      <p>
        This page will be built locally in user's browser by the extension after
        reading from the smart contract. No server required. This is an
        experimental work in progress.
      </p>
      <RichTextEditor setEditorHtml={setEditorHtml} editorHtml={editorHtml} />
      <button onClick={handleHTMLRegister} className="btn btn-primary">
        Register HTML
      </button>{" "}
      <button onClick={makeHTMLPriority} className="btn btn-primary">
        Make Default
      </button>
    </div>
  );
}
