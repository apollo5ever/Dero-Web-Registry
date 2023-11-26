import { useGetSC } from "./hooks/useGetSC";
import React, { useEffect, useState, useContext } from "react";
import { LoginContext } from "./LoginContext";
import hex2a from "./hex2a";
import { Tab, Tabs } from "react-bootstrap";
import AddCategory from "./components/addCategory";
import NameRegistrar from "./components/nameRegistrar";
import Lotto from "./components/lotto";
import Mint from "./components/mint";
import Browse from "./components/browse";
import UserAssets from "./components/userAssets";
import DnsRegistrar from "./components/dnsRegistrar";

export default function ParseRegistry() {
  let registry = {};
  const [getSC] = useGetSC();
  const [data, setData] = useState({});
  const [state, setState] = useContext(LoginContext);
  const [key, setKey] = useState("register");

  useEffect(() => {
    const getData = async () => {
      const data = await getSC(state.scid, false, true);
      setData(data);
      let collections = Object.keys(data.stringkeys).filter((key) =>
        key.endsWith("RegFee")
      );
      console.log("collections", collections);
    };
    getData();
  }, [state]);

  return (
    <>
      {/* <div className="container mt-5">
        <h4>Building a Network of Trust</h4>
  </div>*/}
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
      >
        <Tab eventKey="dns" title=".dero Name Registration">
          <div style={{ marginTop: "20px" }}>
            <DnsRegistrar setKey={setKey} />
          </div>
        </Tab>
        <Tab eventKey="register" title=".dns Name Registration">
          <div style={{ marginTop: "20px" }}>
            <NameRegistrar setKey={setKey} />
          </div>
        </Tab>

        <Tab eventKey="mint" title="Mint Asset">
          <div style={{ marginTop: "20px" }}>
            <Mint />
          </div>
        </Tab>
        <Tab eventKey="lotto" title="DNS Lottery">
          <div style={{ marginTop: "20px" }}>
            <Lotto />
          </div>
        </Tab>
        {/* <Tab eventKey="categories" title="Categories">
          <div style={{ marginTop: "20px" }}>
            <Browse />
          </div>
        </Tab>
        <Tab eventKey="userAssets" title="Manage Your Assets">
          <div style={{ marginTop: "20px" }}></div>
        </Tab> */}
      </Tabs>
    </>
  );
}
