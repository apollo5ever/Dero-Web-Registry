import { useSendTransaction } from "./useSendTransaction";
import { useSendTransactionWithGas } from "./useSendTransactionWithGas";

export function useMintBNT() {
  const [sendTransaction] = useSendTransaction();
  const [sendTransactionWithGas] = useSendTransactionWithGas();

  async function mintBNT(data) {
    try {
      const response = await fetch("/name.bas");
      const scData = await response.text();
      const sc = btoa(scData);
      const result = await sendTransactionWithGas({
        ringsize: 2,
        sc,
        scid: null,
        sc_rpc: [
          { name: "entrypoint", datatype: "S", value: "Initialize" },
          { name: "url", datatype: "S", value: data.url },
        ],
      });
      return result;
    } catch (error) {
      console.error("Error reading or sending transaction:", error);
      return null; // You might want to handle errors appropriately
    }
  }

  return [mintBNT];
}
