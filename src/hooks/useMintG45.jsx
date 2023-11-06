import { useSendTransaction } from "./useSendTransaction";

export function useMintG45() {
  const [sendTransaction] = useSendTransaction();

  async function mintG45(data) {
    try {
      const response = await fetch("/g45.bas");
      const scData = await response.text();
      const sc = btoa(scData);
      const result = await sendTransaction({
        ringsize: 2,
        sc,
        sc_rpc: [
          { name: "entrypoint", datatype: "S", value: "InitializePrivate" },
          { name: "collection", datatype: "S", value: data.collection },
          { name: "metadataFormat", datatype: "S", value: data.metadataFormat },
          { name: "metadata", datatype: "S", value: data.metadata },
        ],
      });
      return result;
    } catch (error) {
      console.error("Error reading or sending transaction:", error);
      return null; // You might want to handle errors appropriately
    }
  }

  return [mintG45];
}
