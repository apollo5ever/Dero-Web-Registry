import React, { useState, useEffect } from "react";
import Identicon from "./Identicon";
import MusicPlayer from "./MusicPlayer";
import { Button } from "react-bootstrap";
import { useMintAsset } from "../hooks/useMintAsset";
import { useGetBalance } from "../hooks/useGetBalance";
import Loop from "./loop";
import IDCard from "./IDCard";
import RichTextEditor from "./richTextEditor";
import { useSendTransaction } from "../hooks/useSendTransaction";
import { useGetGasEstimate } from "../hooks/useGetGasEstimate";
import { useGetAddress } from "../hooks/useGetAddress";

export default function DeroID() {
  const [mintAsset] = useMintAsset();
  const [getAddress] = useGetAddress();
  const [sendTransaction] = useSendTransaction();
  const [getGasEstimate] = useGetGasEstimate();
  const [scid, setScid] = useState("");
  const [address, setAddress] = useState("");
  const [mintStatus, setMintStatus] = useState("initial");
  const [getBalance] = useGetBalance();
  const [plaintext, setPlaintext] = useState(false);
  const [editorHtml, setEditorHtml] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    image: "",
    tagline: "",
    bio: "",
  });

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
    setFormData({
      ...formData,
      [name]: value,
    });
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
      <h1>DeroID</h1>
      <p>
        DeroID is your cross-dAPP pseudonymous identity. You can add metadata
        such as image, description, website, or anything else. Use it as an
        authentication key for dAPPS. Use it to store and prove ownership of
        other Dero assets. All fields are optional.
      </p>
      <div className="mb-3">
        <label htmlFor="image" className="form-label">
          Image:
        </label>
        <input
          className="form-control"
          placeholder="image"
          id="image"
          name="image"
          type="text"
          value={formData.image}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="bio" className="form-label">
          Bio:
        </label>
        {plaintext ? (
          <>
            <textarea
              className="form-control"
              placeholder="Enter your bio"
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
            />
            <p
              className="text-muted"
              onClick={togglePlaintext}
              style={{ cursor: "pointer" }}
            >
              Switch to Rich Text Editor
            </p>
          </>
        ) : (
          <>
            <RichTextEditor
              setEditorHtml={setEditorHtml}
              editorHtml={editorHtml}
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
            />
            <p
              className="text-muted"
              onClick={togglePlaintext}
              style={{ cursor: "pointer" }}
            >
              Switch to Plain Text Editor
            </p>
          </>
        )}
      </div>

      <Button onClick={mint}>Mint</Button>
      <br />
      <br />
      <br />
      <IDCard
        scid={scid}
        bio={formData.bio}
        richBio={editorHtml}
        image={formData.image}
        plaintext={plaintext}
        address={address}
      />
    </div>
  );
}
