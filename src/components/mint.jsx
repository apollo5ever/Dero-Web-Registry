import React, { useState } from "react";

export default function Mint() {
  const assetTypes = ["OAO", "G45-NFT", "Artificer NFA", "Private Island"];
  const [mintType, setMintType] = useState("OAO");

  const handleChangeType = (e) => {
    console.log(e.target.value);
    setMintType(e.target.value);
  };

  return (
    <div className="container mt-5">
      <h1>Mint Your Domain Name Asset</h1>
      <p>
        Any Dero asset can be registered with a Dero Web .dero domain name.
        Furthermore, you can transfer a .dero domain name from one asset to
        another, as long as you own both the old and new asset. In order for
        your asset to be compatible with the Dero Web browser extension, it
        needs to contain properly formatted data.
      </p>
      <div className="mb-3">
        <select className="form-select" onChange={handleChangeType}>
          {assetTypes.map((x, index) => (
            <option key={index} value={x}>
              {x}
            </option>
          ))}
        </select>
      </div>
      {mintType === "OAO" && (
        <div className="mb-4">
          <h3>OAO .dero control</h3>
          <p>The most complicated and powerful option.</p>
          <div className="mb-3">
            <input className="form-control" placeholder="ceo" />
          </div>
          <div className="mb-3">
            <input className="form-control" placeholder="Trustee #1" />
          </div>
          <button className="btn btn-primary">Add Trustee</button>
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
            Registration which costs 0.1 Dero. Then a .dero registration which
            costs 1 DNS. Your .dero domain name will link to your island page on
            Private Islands.
          </p>
          <div className="mb-3">
            <input className="form-control" placeholder="Private Island Name" />
            <input className="form-control" placeholder="Island Image URL" />
            <input className="form-control" placeholder="Island Tagline" />
            <input className="form-control" placeholder="Island Description" />
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
            though it is possible to transfer the .dero name from one asset to
            another so don't sweat it.
          </p>
          <div className="mb-3">
            <input className="form-control" placeholder="collection" />
          </div>
          <div className="mb-3">
            <input className="form-control" placeholder="metadata" />
          </div>
          <div className="mb-3">
            <input className="form-control" placeholder="metadataFormat" />
          </div>
        </div>
      )}
      {mintType === "Artificer NFA" && (
        <div className="mb-4">
          <h3>Artificer NFA</h3>
          <p>
            <a href="" target="_blank">
              The Artificer NFA standard
            </a>{" "}
            has two address-based roles, "creator" and "owner". Metadata can
            always be updated by the creator and sometimes it can be updated by
            the owner as well. This standard uses a built-in market place in
            each contract. For use as a .dero domain name, use the fileURL
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
    </div>
  );
}
