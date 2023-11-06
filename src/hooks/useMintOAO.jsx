import { useSendTransaction } from "./useSendTransaction";
import { useGetAddress } from "./useGetAddress";
import { useGetGasEstimate } from "./useGetGasEstimate";

export function useMintOAO() {
  const [sendTransaction] = useSendTransaction();
  const [getAddress] = useGetAddress();
  const [getGasEstimate] = useGetGasEstimate();

  async function mintOAO(data) {
    let trustees = "";
    let seats = "";
    let transfers = [];
    for (let i = 0; i < data.trusteeAddresses.length; i++) {
      seats = seats.concat(data.trusteeSCIDs[i]);
      trustees = trustees.concat(data.trusteeAddresses[i]);
      transfers.push({
        burn: 1,
        scid: data.trusteeSCIDs[i],
      });
    }
    try {
      console.log(data);
      const response = await fetch("/oao.bas");
      const scdata = await response.text();
      const sc = btoa(scdata);
      const result = await sendTransaction({
        ringsize: 2,
        sc,
        sc_rpc: [
          {
            name: "entrypoint",
            value: "Initialize",
            datatype: "S",
          },
          {
            name: "name",
            value: data.name,
            datatype: "S",
          },
          {
            name: "ceo",
            value: data.ceo,
            datatype: "S",
          },
          {
            name: "http",
            value: data.url,
            datatype: "S",
          },
          {
            name: "seats",
            value: seats,
            datatype: "S",
          },
          {
            name: "trustees",
            value: trustees,
            datatype: "S",
          },
          {
            name: "board",
            value: data.trusteeAddresses.length,
            datatype: "U",
          },
          {
            name: "quorum",
            value: parseInt(data.quorum),
            datatype: "U",
          },
        ],
      });
      return result;
    } catch (error) {
      console.error("Error reading or sending transaction:", error);
      return null; // You might want to handle errors appropriately
    }
  }

  return [mintOAO];
}
