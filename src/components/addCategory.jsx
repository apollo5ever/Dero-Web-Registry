import React from "react";
import { useSendTransaction } from "../hooks/useSendTransaction";

export default function AddCategory() {
  const [sendTransaction] = useSendTransaction();

  const handleSubmit = (e) => {
    e.preventDefault();
    let data = {
      scid: "f60bc50eee50c7d85111087cdb326655a4c107ae3112b0ff23db0d37d2843384",
      ringsize: 2,
      transfers: [],
      sc_rpc: [
        {
          name: "entrypoint",
          value: "NewCollection",
          datatype: "S",
        },
        {
          name: "name",
          value: e.target.name.value,
          datatype: "S",
        },
        {
          name: "fee",
          value: 0,
          datatype: "U",
        },
        {
          name: "accessToken",
          value: "",
          datatype: "S",
        },
        {
          name: "ownerToken",
          value: "",
          datatype: "S",
        },
      ],
    };
    sendTransaction(data);
    /*
     const rpcData = {
        scid: data.scid,
        ringsize: data.ringsize,
        transfers: data.transfers,
        sc_rpc: data.sc_rpc,
        sc: data.sc,
        fees: data.fees,
      };
      name String, fee Uint64, accessToken String, ownerToken String
    */
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="categoryName">Category Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Enter category name"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </>
  );
}
