import { useSendTransaction } from "./useSendTransaction";
import { useSendTransactionWithGas } from "./useSendTransactionWithGas";

export function useMintDeroID() {
  const [sendTransaction] = useSendTransaction();
  const [sendTransactionWithGas] = useSendTransactionWithGas();

  async function mintDeroID(data) {
    try {
      // const address = await getAddress();
      const response = await fetch("/deroID.bas");
      const scData = await response.text();
      const sc = btoa(scData);
      /*  const fees = await getGasEstimate({
        ringsize: 2,
        sc,
        gas_rpc: [{ name: "entrypoint", datatype: "S", value: "Initialize" }],
        signer: address,
      }); */
      const result = await sendTransactionWithGas({
        ringsize: 2,
        sc,
        sc_rpc: [{ name: "entrypoint", datatype: "S", value: "Initialize" }],
      });
      console.log("mintderoid txid", result);
      return result;
    } catch (error) {
      console.error("Error reading or sending transaction:", error);
      return null; // You might want to handle errors appropriately
    }
  }

  return [mintDeroID];
}
