import React, { useState, useEffect } from "react";
import Identicon from "./Identicon";
import MusicPlayer from "./MusicPlayer";
import { Button, Tabs, Tab } from "react-bootstrap";
import { useMintAsset } from "../hooks/useMintAsset";
import { useGetBalance } from "../hooks/useGetBalance";
import Loop from "./loop";
import IDCard from "./IDCard";
import RichTextEditor from "./richTextEditor";
import { useSendTransaction } from "../hooks/useSendTransaction";
import { useGetGasEstimate } from "../hooks/useGetGasEstimate";
import { useGetAddress } from "../hooks/useGetAddress";
import { useGetSC } from "../hooks/useGetSC";
import hex2a from "../hex2a";

export default function WalletTab() {
  const dnsRegistrarSCIDMainnet = "";
  const dnsRegistrarSCIDSimulator =
    "9c641071a8dcca07dd4faaefbeb0cfd18512c649b773be8add9019ddd865c886";
  const dnsRegistrarSCID = dnsRegistrarSCIDSimulator;
  const [mintAsset] = useMintAsset();
  const [getAddress] = useGetAddress();
  const [getSC] = useGetSC();
  const [sendTransaction] = useSendTransaction();
  const [getGasEstimate] = useGetGasEstimate();
  const [scid, setScid] = useState("");
  const [address, setAddress] = useState("");
  const [mintStatus, setMintStatus] = useState("initial");
  const [getBalance] = useGetBalance();
  const [plaintext, setPlaintext] = useState(false);
  const [editorHtml, setEditorHtml] = useState("");
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    image: "",
    tagline: "",
    bio: "",
  });
  const [reputation, setReputation] = useState(null);
  const [key, setKey] = useState("dns");

  const [id, setID] = useState({
    scid: "",
    name: "",
    reputation: null,
    image: "",
    description: "",
    url: "",
  });

  const getID = async () => {
    console.log(search);
    let newID = new Object({
      scid: "",
      name: "",
      reputation: null,
      image: "",
      bio: "",
    });
    console.log(newID);
    if (search.length == 64) {
      console.log("scid probably entered");
      const sc = await getSC(
        search,
        false,
        true,
        -1,
        [],
        ["image", "bio", "OWNER"]
      );
      console.log("getID ", sc);
      if (sc.stringkeys) {
        newID.scid = search;
        newID.name = "";
        console.log("scid confirmed");
        if (!sc.valuesstring[0].startsWith("N")) {
          newID.image = hex2a(sc.valuesstring[0]);
        }

        if (!sc.valuesstring[1].startsWith("N")) {
          newID.bio = hex2a(sc.valuesstring[1]);
        }
        if (!sc.valuesstring[2].startsWith("N")) {
          newID.address = hex2a(sc.valuesstring[2]);
          console.log("don't start with N", newID);
        }

        setID(newID);
        return;
      }
    }
    const sc = await getSC(
      dnsRegistrarSCID,
      false,
      true,
      -1,
      [],
      [`datatype:${search}`, `data:${search}`]
    );
    console.log(sc);
    if (hex2a(sc.valuesstring[0]) == "DeroID") {
      const idSCID = hex2a(sc.valuesstring[1]);
      newID.scid = idSCID;
      newID.name = search;
      const idSC = await getSC(
        idSCID,
        false,
        true,
        -1,
        [],
        ["image", "bio", "OWNER"]
      );
      if (!idSC.valuesstring[0].startsWith("N")) {
        newID.image = hex2a(idSC.valuesstring[0]);
      }
      if (!idSC.valuesstring[1].startsWith("N")) {
        newID.bio = hex2a(idSC.valuesstring[1]);
        console.log("don't start with N", newID);
      }
      if (!idSC.valuesstring[2].startsWith("N")) {
        newID.address = hex2a(idSC.valuesstring[2]);
        console.log("don't start with N", newID);
      }
      console.log("setID ", newID);
      const repSC = await getSC(
        "fbfd3b52464a15954b39a4de0b925d2942e4fd85ea31377c95c3f9c5d7835ec7",
        false,
        true
      );
      let repVars = repSC.stringkeys;
      let repKeys = Object.keys(repVars).filter(
        (x) => x.startsWith(`rating:${newID.scid}`) && x.endsWith("trust")
      );
      let score = 0;
      for (let i = 0; i < repKeys.length; i++) {
        score = score + repVars[repKeys[i]];
      }
      newID.reputation = score;

      setID(newID);
    }
  };

  const mint = async () => {
    const scid = await mintAsset("DeroID");
    setScid(scid);
    setMintStatus("waiting");
  };

  const togglePlaintext = () => {
    setPlaintext(!plaintext);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearch(value);
  };

  const updateMetadata = async (key, value, type) => {
    const owner = await getAddress();
    setAddress(owner);
    let data = {
      scid: scid,
      ringsize: 2,
      signer: owner,
      sc_rpc: [
        {
          name: "entrypoint",
          datatype: "S",
          value: "UpdateVar",
        },
        {
          name: "key",
          datatype: "S",
          value: key,
        },
        {
          name: "value",
          datatype: "S",
          value: value,
        },
        {
          name: "t",
          datatype: "S",
          value: type,
        },
      ],
      gas_rpc: [
        {
          name: "SC_ACTION",
          datatype: "U",
          value: 0,
        },
        {
          name: "SC_ID",
          datatype: "H",
          value: scid,
        },
        {
          name: "entrypoint",
          datatype: "S",
          value: "UpdateVar",
        },
        {
          name: "key",
          datatype: "S",
          value: key,
        },
        {
          name: "value",
          datatype: "S",
          value: value,
        },
        {
          name: "t",
          datatype: "S",
          value: type,
        },
      ],
    };
    let fees = await getGasEstimate(data);
    data.fees = fees;
    sendTransaction(data);
  };

  useEffect(() => {
    let intervalId;

    const checkBalance = async () => {
      console.log("Checking balance for ", scid);
      const balance = await getBalance(scid); // Assuming getBalance is your hook

      if (balance >= 1) {
        console.log("Balance is sufficient, stopping loop.");
        setMintStatus("complete");
        if (formData.image) {
          await updateMetadata("image", formData.image, "S");
        }
        let bio;
        if (plaintext) {
          bio = formData.bio;
        } else {
          bio = editorHtml;
        }
        if (bio) {
          await updateMetadata("bio", bio, "S");
        }
        clearInterval(intervalId);
      }
    };

    if (mintStatus === "waiting") {
      // Start the loop on component mount
      intervalId = setInterval(checkBalance, 4000); // 10 seconds interval
    }

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [mintStatus, scid]);

  return (
    <div className="container mt-5">
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
      >
        {" "}
        <Tab eventKey="wallet" title="Register">
          <div style={{ marginTop: "20px" }}>
            copy shrill salad registration here
          </div>
        </Tab>
        <Tab eventKey="register" title="Manage">
          <div style={{ marginTop: "20px" }}>
            copy shrill salad transfer here. add data registration
          </div>
        </Tab>
        <Tab eventKey="lotto" title="Lookup">
          <div style={{ marginTop: "20px" }}>
            copy shrill salad lookup here. add data lookup
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
    </div>
  );
}
