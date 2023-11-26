import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useSendTransaction } from "../hooks/useSendTransaction";
import { useMintAsset } from "../hooks/useMintAsset";
import { useGetBalance } from "../hooks/useGetBalance";
import { useGetAddress } from "../hooks/useGetAddress";

export default function Mint() {
  const [sendTransaction] = useSendTransaction();
  const [mintAsset] = useMintAsset();
  const [getBalance] = useGetBalance();
  const [getAddress] = useGetAddress();
  const assetTypes = [
    "Basic Name Token",
    "OAO",
    "G45-NFT",
    "Artificer NFA",
    "Private Island",
    "Role Token",
  ];
  const [mintType, setMintType] = useState("Basic Name Token");
  const [assetType, setAssetType] = useState("");
  const [encodedData, setEncodedData] = useState("");
  const [mintStatus, setMintStatus] = useState("initial");
  const [scid, setScid] = useState("");
  const [assetInfo, setAssetInfo] = useState([]);

  const [roleCount, setRoleCount] = useState(1);
  const [formData, setFormData] = useState({
    ceo: "",
    trusteeSCIDs: [""], // Initialize with one empty SCID field
    trusteeAddresses: [""], // Initialize with one empty address field
    trusteeList: [""],
    quorum: null,
    name: "",
    url: "",
    image: "",
    tagline: "",
    bio: "",
    collection: "",
    metadata: "",
    metadataFormat: "",
    nameHdr: "",
    descrHdr: "",
    typeHdr: "",
    iconURLHdr: "",
    tagsHdr: "",
    fileCheckC: "",
    fileCheckS: "",
    fileURL: "",
    fileSignURL: "",
    coverURL: "",
  });

  const handleMintRole = async (type, index) => {
    if (type === "CEO") {
      const address = await getAddress();
      const scid = await mintAsset("Role Token", { address: address });
      setFormData({ ...formData, ceo: scid });
    } else if (type === "Trustee") {
      if (!formData.trusteeAddresses[index]?.startsWith("dero")) {
        let warning = formData.trusteeAddresses;
        warning[index] = "MUST FIRST SPECIFY ADDRESS!!";
        setFormData({ ...formData, trusteeAddresses: warning });
        return;
      }
      const scid = await mintAsset("Role Token", {
        address: formData.trusteeAddresses[index],
      });
      handleTrusteeChange(index, "trusteeSCIDs", { target: { value: scid } });
      console.log("mint trustee token ", index, {
        address: formData.trusteeAddresses[index],
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddRole = () => {
    setRoleCount((prevCount) => prevCount + 1);
  };

  const handleRemoveRole = () => {
    if (roleCount > 1) {
      setRoleCount((prevCount) => prevCount - 1);
    }
  };

  const handleTrusteeChange = (index, type, e) => {
    const updatedTrustees = [...formData[type]];
    updatedTrustees[index] = e.target.value;
    setFormData({
      ...formData,
      [type]: updatedTrustees,
    });
  };

  const handleAddTrustee = (type) => {
    setFormData({
      ...formData,
      [type]: [...formData[type], ""],
    });
  };

  const handleRemoveTrustee = (type) => {
    if (formData[type].length > 1) {
      const updatedTrustees = [...formData[type]];
      updatedTrustees.pop();
      setFormData({
        ...formData,
        [type]: updatedTrustees,
      });
    }
  };

  useEffect(() => {
    let intervalId;

    const checkBalance = async () => {
      console.log("Checking balance for ", scid);
      const balance = await getBalance(scid); // Assuming getBalance is your hook

      if (balance >= 1) {
        console.log("Balance is sufficient, stopping loop.");
        setMintStatus("complete");
        setAssetInfo((assetInfo) => [
          ...assetInfo,
          { scid: scid, type: assetType },
        ]);

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

  const mint = async () => {
    const scid = await mintAsset(mintType, formData);
    setScid(scid);
    setAssetType(mintType);
    setMintStatus("waiting");

    /*  if (mintType === "OAO") {
      fetch("/oao.bas") // Assuming oao.bas is in the public folder
        .then((response) => response.text())
        .then((data) => {
          // Encode the contents to Base64
          return btoa(data);
          setEncodedData(encodedData);
        })
        .catch((error) => {
          console.error("Error reading the file:", error);
        })
        .then((sc) => {
          let data = {
            ringsize: 2,
            sc_rpc: [
              {
                name: "entrypoint",
                datatype: "S",
                value: "Initialize",
              },
              {
                name: "name",
                datatype: "S",
                value: "name",
              },
              {
                name: "ceo",
                datatype: "S",
                value: "ceo",
              },
              {
                name: "http",
                datatype: "S",
                value: "https://wild-poetry-8784.on.fleek.co/",
              },
            ],
            sc: sc,
          };
          sendTransaction(data);
        });
    } */
  };

  useEffect(() => {
    // Read the contents of the file
    fetch("/oao.bas") // Assuming oao.bas is in the public folder
      .then((response) => response.text())
      .then((data) => {
        // Encode the contents to Base64
        const encodedData = btoa(data);
        setEncodedData(encodedData);
      })
      .catch((error) => {
        console.error("Error reading the file:", error);
      });
  }, []);

  const handleChangeType = (e) => {
    console.log(e.target.value);
    setMintType(e.target.value);
  };

  return (
    <div className="container mt-5">
      <h1>Mint Your Domain Name Asset</h1>
      <p>
        Any Dero asset can be registered with a Dero Web .dns domain name.
        Furthermore, you can transfer a .dns domain name from one asset to
        another, as long as you own both the old and new asset. In order for
        your asset to be compatible with the Dero Web browser extension, it
        needs to contain properly formatted data.
      </p>
      {assetInfo.map((x) => (
        <p>
          Successfully minted {x.type}! Don't lose this: {x.scid}
        </p>
      ))}
      <p>{mintStatus === "waiting" ? "Waiting for Blocks..." : ""}</p>

      <div className="mb-3">
        <select className="form-select" onChange={handleChangeType}>
          {assetTypes.map((x, index) => (
            <option key={index} value={x}>
              {x}
            </option>
          ))}
        </select>
      </div>
      {mintType === "Basic Name Token" && (
        <div className="mb-4">
          <h3>Basic Name Token</h3>
          <p>
            This token standard is a bare-bones asset designed to point domain
            names to URLs.
          </p>
          <h4>Choose URL for Browser</h4>
          <p>More URL types can be added down the line</p>
          <div className="mb-3">
            <input
              className="form-control"
              placeholder="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
            />
          </div>
        </div>
      )}
      {mintType === "OAO" && (
        <div className="mb-4">
          <h3>OAO .dns control</h3>
          <p>
            The most complicated and powerful option. This allows an
            organization instead of an individual to control a .dns domain name.
            If you don't already have role tokens you can mint them on this
            page.
          </p>

          <h4>Add Roles</h4>
          <div className="mb-3">
            <input
              className="form-control"
              placeholder="CEO Token SCID"
              id="ceo"
              name="ceo"
              value={formData.ceo}
              onChange={handleChange}
            />
            <button
              className="btn btn-success me-2"
              onClick={() => handleMintRole("CEO")}
            >
              No CEO Token? Mint
            </button>
          </div>

          <div className="mb-3">
            {formData.trusteeList.map((_, index) => (
              <div key={index} className="mb-3">
                <input
                  className="form-control"
                  placeholder={`Trustee #${index + 1} - Dero Address`}
                  value={formData.trusteeAddresses[index]}
                  onChange={(e) =>
                    handleTrusteeChange(index, "trusteeAddresses", e)
                  }
                />
                <input
                  className="form-control"
                  placeholder={`Trustee #${index + 1} - Token SCID`}
                  value={formData.trusteeSCIDs[index]}
                  onChange={(e) =>
                    handleTrusteeChange(index, "trusteeSCIDs", e)
                  }
                />
                <button
                  className="btn btn-success me-2"
                  onClick={() => handleMintRole("Trustee", index)}
                >
                  No Trustee Token? Mint & Send
                </button>
              </div>
            ))}
            <button
              className="btn btn-success me-2"
              onClick={() => handleAddTrustee("trusteeList")}
            >
              Add Trustee
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleRemoveTrustee("trusteeList")}
            >
              Remove Trustee
            </button>
            <div className="mb-3">
              <input
                className="form-control"
                placeholder="Quorum"
                id="quorum"
                name="quorum"
                value={formData.quorum}
                onChange={handleChange}
                type="number"
                min="0"
                max={formData.trusteeList.length}
              />
            </div>
          </div>

          <div className="mb-3">
            <h4>Add Metadata</h4>
            <div className="mb-3">
              <input
                className="form-control"
                placeholder="OAO Name"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label>URL for .dns content</label>
              <input
                className="form-control"
                placeholder="http://"
                id="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* ... Other fields ... */}
        </div>
      )}

      {mintType === "Private Island" && (
        <div className="mb-4">
          <h3>Private Island</h3>
          <p>
            With this asset you can host bounties, fundraisers, and
            subscriptions on{" "}
            <a
              href="https://privateislands.fund/#/tiles"
              target="_blank"
              rel="noreferrer"
            >
              Private Islands
            </a>
          </p>
          <p>
            This involves two registrations. First a Private Islands
            Registration which costs 0.1 Dero. Then a .dns registration which
            costs 1 DNS. Your .dns domain name will link to your island page on
            Private Islands.
          </p>
          <div className="mb-3">
            <input
              className="form-control"
              placeholder="Private Island Name"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              className="form-control"
              placeholder="Island Image URL"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
            />
            <input
              className="form-control"
              placeholder="Island Tagline"
              id="tagline"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
            />
            <input
              className="form-control"
              placeholder="Island Description"
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
            />
          </div>
        </div>
      )}
      {mintType === "G45-NFT" && (
        <div className="mb-4">
          <h3>G45-NFT</h3>
          <p>
            These assets are compatible with{" "}
            <a href="https://deronfts.com" target="_blank" rel="noreferrer">
              DeroNFTs
            </a>{" "}
            and can be listed and traded there. G45-NFT metadata is immutable
            which means that once you set the URL it cannot be changed. Remember
            though it is possible to transfer the .dns name from one asset to
            another so don't sweat it.
          </p>
          <div className="mb-3">
            <input
              className="form-control"
              placeholder="collection"
              id="collection"
              name="collection"
              value={formData.collection}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <input
              className="form-control"
              placeholder="metadata"
              id="metadata"
              name="metadata"
              value={formData.metadata}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <input
              className="form-control"
              placeholder="metadataFormat"
              id="metadataFormat"
              name="metadataFormat"
              value={formData.metadataFormat}
              onChange={handleChange}
            />
          </div>
        </div>
      )}
      {mintType === "Artificer NFA" && (
        <div className="mb-4">
          <h3>Artificer NFA</h3>
          <p>
            <a
              href="https://github.com/civilware/artificer-nfa-standard"
              target="_blank"
            >
              The Artificer NFA standard
            </a>{" "}
            has two address-based roles, "creator" and "owner". Metadata can
            always be updated by the creator and sometimes it can be updated by
            the owner as well. This standard uses a built-in market place in
            each contract. For use as a .dns domain name, use the fileURL
            variable.
          </p>
          <div className="mb-3">
            <input className="form-control" placeholder="nameHdr" />
          </div>
          <div className="mb-3">
            <input className="form-control" placeholder="descrHdr" />
          </div>
          <div className="mb-3">
            <input className="form-control" placeholder="typeHdr" />
          </div>
          <div className="mb-3">
            <input className="form-control" placeholder="iconURLHdr" />
          </div>
          <div className="mb-3">
            <input className="form-control" placeholder="tagsHdr" />
          </div>
          <div className="mb-3">
            <input className="form-control" placeholder="fileCheckC" />
          </div>
          <div className="mb-3">
            <input className="form-control" placeholder="fileCheckS" />
          </div>
          <div className="mb-3">
            <input className="form-control" placeholder="fileURL" />
          </div>
          <div className="mb-3">
            <input className="form-control" placeholder="fileSignURL" />
          </div>
          <div className="mb-3">
            <input className="form-control" placeholder="coverURL" />
          </div>
          <div className="mb-3">
            <input className="form-control" placeholder="collection" />
          </div>
        </div>
      )}
      <Button onClick={mint}>Mint</Button>
    </div>
  );
}
