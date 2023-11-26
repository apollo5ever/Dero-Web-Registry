import React, { useContext } from "react";
import { useSendTransaction } from "./useSendTransaction";
import { useGetRandomAddress } from "./useGetRandomAddress";
import { LoginContext } from "../LoginContext";
import { useGetAddress } from "./useGetAddress";
import { useGetGasEstimate } from "./useGetGasEstimate";

export function useUpdateAddress() {
  const [sendTransaction] = useSendTransaction();
  const [getRandomAddress] = useGetRandomAddress();
  const [state, setState] = useContext(LoginContext);
  const [getAddress] = useGetAddress();
  const [getGasEstimate] = useGetGasEstimate();
  // const logger = useContext(LoggerContext);

  async function updateAddress(scid, key, value, collection) {
    let address = await getAddress();

    let data = {
      scid: scid,
      ringsize: 2,
      signer: address,
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
          value: "UpdateAddress",
        },
        {
          name: "c",
          datatype: "S",
          value: collection,
        },
        {
          name: "k",
          datatype: "S",
          value: key,
        },
        {
          name: "v",
          datatype: "S",
          value: value,
        },
      ],
      sc_rpc: [
        {
          name: "entrypoint",
          datatype: "S",
          value: "UpdateAddress",
        },
        {
          name: "c",
          datatype: "S",
          value: collection,
        },
        {
          name: "k",
          datatype: "S",
          value: key,
        },
        {
          name: "v",
          datatype: "S",
          value: value,
        },
      ],
    };
    const fees = await getGasEstimate(data);
    data.fees = fees;
    sendTransaction(data);
  }

  return [updateAddress];
}
