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
  const [available, setAvailable] = useState(true);
  const [names, setNames] = useState([]);
  const [state, setState] = useContext(LoginContext);
  const [getSC] = useGetSC();
  const [nameToAddress] = useNameToAddress();
  const [getAddress] = useGetAddress();
  const [editorHtml, setEditorHtml] = useState("");

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
  const handleRegister = async () => {
    await updateAddress(
      "9d189d114a5ef9c99ec46daa0f29aa44629d2d711f83c7cad92824cf7eadc6ea",
      "url",
      ensureHttps(url),
      "0"
    );
  };

  const handleHTMLRegister = async () => {
    await updateAddress(
      "9d189d114a5ef9c99ec46daa0f29aa44629d2d711f83c7cad92824cf7eadc6ea",
      "html-0",
      editorHtml,
      "0"
    );
  };

  return (
    <div className="container mt-5">
      <h1>Register Your .dero Domain Name</h1>

      <p>
        First register a name for you dero address. You can use this name to
        receive dero directly from the dero wallet. Next register a url or other
        data to your address.
      </p>
      <p>
        If you've already registered a name for you dero address then you
        already have your ".dero" domain. You can either register a URL or
        inscribe html directly to the dero blockchain.
      </p>

      <p>
        If you register both a url and raw html, the browser extension will
        choose the html. This is a proof of concept.
      </p>

      <div className="mb-3">
        <input
          type="text"
          placeholder="example.com or ip address"
          value={url}
          onChange={handleUrlChange}
        />
      </div>
      <button onClick={handleRegister} className="btn btn-primary">
        Register URL
      </button>
      <RichTextEditor setEditorHtml={setEditorHtml} editorHtml={editorHtml} />
      <button onClick={handleHTMLRegister} className="btn btn-primary">
        Register HTML
      </button>
    </div>
  );
}
