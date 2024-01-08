import { useSendTransaction } from "./useSendTransaction";

export function useMintDeroID() {
  const [sendTransaction] = useSendTransaction();

  async function mintDeroID(data) {
    try {
      const response = await fetch("/deroID.bas");
      const scData = await response.text();
      const sc = btoa(scData);
      const result = await sendTransaction({
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
