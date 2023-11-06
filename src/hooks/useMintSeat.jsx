import { useSendTransaction } from "./useSendTransaction";

export function useMintSeat() {
  const [sendTransaction] = useSendTransaction();

  async function mintSeat(data) {
    try {
      const response = await fetch("/seat.bas");
      const scdata = await response.text();
      const sc = btoa(scdata);
      const result = await sendTransaction({
        ringsize: 2,
        sc,
        sc_rpc: [
          {
            name: "entrypoint",
            datatype: "S",
            value: "Initialize",
          },
          {
            name: "address",
            datatype: "S",
            value: data.address,
          },
        ],
      });
      return result;
    } catch (error) {
      console.error("Error reading or sending transaction:", error);
      return null; // You might want to handle errors appropriately
    }
  }

  return [mintSeat];
}
