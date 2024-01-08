import React, { useContext } from "react";
import { useSendTransaction } from "./useSendTransaction";
import { useGetRandomAddress } from "./useGetRandomAddress";
import { LoginContext } from "../LoginContext";

export function useRegisterName() {
  const [sendTransaction] = useSendTransaction();
  const [getRandomAddress] = useGetRandomAddress();
  const [state, setState] = useContext(LoginContext);
  // const logger = useContext(LoggerContext);

  async function registerName(
    scid,
    name,
    key,
    dataToken,
    owner,
    datatype,
    transferCost
  ) {
    let address = await getRandomAddress();

    //removed asset burn, I think that was unnecessary

    let data = {
      scid: scid,
      ringsize: 2,
      transfers: [
        {
          burn: 10000,
          destination: address,
        },
      ],
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
          value: "Register",
        },
        {
          name: "name",
          datatype: "S",
          value: name,
        },
        {
          name: "key",
          datatype: "S",
          value: key,
        },
        {
          name: "owner",
          datatype: "S",
          value: owner,
        },
        {
          name: "data",
          datatype: "S",
          value: dataToken,
        },
        {
          name: "datatype",
          datatype: "S",
          value: datatype,
        },
        {
          name: "transferCost",
          datatype: "U",
          value: transferCost,
        },
      ],
    };
    sendTransaction(data);
  }

  return [registerName];
}
