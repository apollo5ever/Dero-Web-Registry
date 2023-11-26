import React, { useContext } from "react";
import { useSendTransaction } from "./useSendTransaction";
import { useGetRandomAddress } from "./useGetRandomAddress";
import { LoginContext } from "../LoginContext";

export function useRegisterName() {
  const [sendTransaction] = useSendTransaction();
  const [getRandomAddress] = useGetRandomAddress();
  const [state, setState] = useContext(LoginContext);
  // const logger = useContext(LoggerContext);

  async function registerName(scid, name, asset, token, index, collection) {
    let address = await getRandomAddress();

    //removed asset burn, I think that was unnecessary

    let data = {
      scid: scid,
      ringsize: 2,
      /*transfers: [
        {
          scid: state.dns,
          burn: 1,
          destination: address,
      },
      ],*/
      sc_rpc: [
        {
          name: "entrypoint",
          datatype: "S",
          value: "RegisterAsset",
        },
        {
          name: "collection",
          datatype: "S",
          value: collection,
        },
        {
          name: "name",
          datatype: "S",
          value: name,
        },
        {
          name: "scid",
          datatype: "S",
          value: asset,
        },
        {
          name: "index",
          datatype: "U",
          value: parseInt(index),
        },
      ],
    };
    sendTransaction(data);
  }

  return [registerName];
}
