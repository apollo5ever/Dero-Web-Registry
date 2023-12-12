import React, { useState, useEffect } from "react";
import Identicon from "./Identicon";
import MusicPlayer from "./MusicPlayer";
import { Button } from "react-bootstrap";
import { useMintAsset } from "../hooks/useMintAsset";
import { useGetBalance } from "../hooks/useGetBalance";
import Loop from "./loop";

export default function DeroID() {
  const [mintAsset] = useMintAsset();
  const [scid, setScid] = useState("");
  const [mintStatus, setMintStatus] = useState("initial");
  const [getBalance] = useGetBalance();

  const mint = async () => {
    const scid = await mintAsset("DeroID");
    setScid(scid);
    setMintStatus("waiting");
  };

  useEffect(() => {
    let intervalId;

    const checkBalance = async () => {
      console.log("Checking balance for ", scid);
      const balance = await getBalance(scid); // Assuming getBalance is your hook

      if (balance >= 1) {
        console.log("Balance is sufficient, stopping loop.");
        setMintStatus("complete");

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
        DeroID is your cross-dAPP pseudonymous identity asset. It is a
        generalization of the Private Island. You can add metadata such as
        image, description, website, or anything else. Use it as an
        authentication key for dAPPS. Use it to store and prove ownership of
        other Dero assets.{" "}
      </p>
      <Button onClick={mint}>Mint</Button>
      {scid && <Loop inputString={scid} />}
      {/*  <div>
        <h1>Identicon Generator</h1>
        <Identicon
          inputString={
            "a1bff74a9d4d9078d5352f3057cdcabc03f07208c4e5471faf9595729ccaddd8"
          }
        />
        <br />
        <br />
        <Identicon
          inputString={
            "8a800fbb3af82fc4aab441c9482eba633f78d16f2b455c85c1dd8dc0280636dc"
          }
        />
        <br />
        <br />
        <Identicon
          inputString={
            "d5c9df874b67a976ff4e40f4f675fbcad6e11a71cae6299946e01e95744f3bbe"
          }
        />
      </div>
      <br />
      <br />
      <Identicon
        inputString={
          "c6c65f51c3a9a8be40584151c91f6453801dd72c3eb3c61e49d444310dc1598c"
        }
      />
      <br />
      <br />
      <Identicon
        inputString={
          "fb4f6bd54b0db33b670f61718399d9ee75c76fe9806498b9b3ff95e46f41e594"
        }
      />
      <br />
      <br />
      <Identicon
        inputString={
          "ff520e9175971222fbdd176084cbcfd1b5150ce0c18c8cd9e696312c16867da0"
        }
      />
      <br />
      <br />
      <Identicon
        inputString={
          "9d189d114a5ef9c99ec46daa0f29aa44629d2d711f83c7cad92824cf7eadc6ea"
        }
      /> */}
    </div>
  );
}
