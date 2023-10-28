import { useGetSC } from "./hooks/useGetSC";
import React, { useEffect, useState, useContext } from "react";
import { LoginContext } from "./LoginContext";
import hex2a from "./hex2a";
import { Tab, Tabs } from "react-bootstrap";
import AddCategory from "./components/addCategory";
import NameRegistrar from "./components/nameRegistrar";
import Lotto from "./components/lotto";
import Mint from "./components/mint";

export default function ParseRegistry() {
  let registry = {};
  const [getSC] = useGetSC();
  const [data, setData] = useState({});
  const [state, setState] = useContext(LoginContext);
  const [key, setKey] = useState("browse");

  useEffect(() => {
    const getData = async () => {
      const data = await getSC(
        "f60bc50eee50c7d85111087cdb326655a4c107ae3112b0ff23db0d37d2843384",
        false,
        true
      );
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
      <h1>Dero Web</h1>
      <h4>Building a Network of Trust</h4>

      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
      >
        <Tab eventKey="browse" title=".dero Name Registration">
          <div style={{ marginTop: "20px" }}>
            <NameRegistrar />
          </div>
        </Tab>
        <Tab eventKey="addcategory" title="Add Category">
          <div style={{ marginTop: "20px" }}>
            <AddCategory />
          </div>
        </Tab>
        <Tab eventKey="register" title="Mint Asset">
          <div style={{ marginTop: "20px" }}>
            <Mint />
          </div>
        </Tab>
        <Tab eventKey="lotto" title="DNS Lottery">
          <div style={{ marginTop: "20px" }}>
            <Lotto />
          </div>
        </Tab>
      </Tabs>
    </>
  );
}
