import { useSendTransaction } from "./useSendTransaction";

export function useMintBNT() {
  const [sendTransaction] = useSendTransaction();

  async function mintBNT(data) {
    try {
      const response = await fetch("/name.bas");
      const scData = await response.text();
      const sc = btoa(scData);
      const result = await sendTransaction({
        ringsize: 2,
        sc,
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
