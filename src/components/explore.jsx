import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { useGetSC } from "../hooks/useGetSC";
import { LoginContext } from "../LoginContext";
import hex2a from "../hex2a";
import { useGetDeroIDCard } from "../hooks/useGetDeroIDCard";
import { useGetOAOCard } from "../hooks/useGetOAOCard";
import { Button, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNameToAddress } from "../hooks/useNameToAddress";

export default function Explore() {
  const [getDeroIDCard] = useGetDeroIDCard();
  const [getOAOCard] = useGetOAOCard();
  const [state, setState] = useContext(LoginContext);
  const [getSC] = useGetSC();
  const [dataToken, setDataToken] = useState("");
  const [datatype, setDatatype] = useState("");
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const q = searchParams.get("q");
  const [deroID, setDeroID] = useState(null);
  const [oao, setOAO] = useState(null);
  const [nameToAddress] = useNameToAddress();
  const [wallet, setWallet] = useState("");

  const getSCID = async () => {
    let name = q.toLowerCase();
    let result = await getSC(state.scids.mainnet.assetRegistry, false, true);
    const dataToken = hex2a(result.stringkeys[`data:${name}`]);
    const dataType = hex2a(result.stringkeys[`datatype:${name}`]);
    setDataToken(dataToken);
    setDatatype(dataType);
    switch (dataType) {
      case "DeroID":
        console.log("datatype is ", dataType);
        const deroID = await getDeroIDCard(dataToken, name);
        setDeroID(deroID);
      case "OAO":
        console.log("datatype is ", dataType);
        const oao = await getOAOCard(dataToken, name);
        setOAO(oao);
      case "BNT":
        console.log("datatype is", dataType);
      default:
        console.log("datatype is ", dataType);
    }
  };

  const getWallet = async () => {
    let wallet = await nameToAddress(q);
    setWallet(wallet);
    getWalletData(wallet);
  };

  const getWalletData = async (wallet) => {
    //get url and other data from contract
  };

  useEffect(() => {
    //look for asset
    getSCID();

    //look for wallet
    getWallet();
  }, [q]);

  return (
    <Container className="mt-5">
      <Row>
        <h1>Explore</h1>
        <Col md={6}>
          <h3>Assets (.dns)</h3>

          <strong>
            {dataToken ? dataToken : "No asset registered with this name."}
          </strong>
          <div>
            {datatype == "DeroID"
              ? deroID
              : datatype == "OAO"
              ? oao
              : datatype == ""
              ? ""
              : "Unknown datatype: " + datatype}
          </div>
        </Col>
        <Col md={6}>
          <h3>Wallets (.dero)</h3>
          <strong>
            {wallet ? wallet : "No wallet registered with this name."}
          </strong>
        </Col>
      </Row>
    </Container>
  );
}
