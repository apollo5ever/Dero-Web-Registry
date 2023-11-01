import { useSendTransaction } from "./useSendTransaction";

export function useMintSeat() {
  const [sendTransaction] = useSendTransaction();

  async function mintSeat() {
    try {
      const response = await fetch("/seat.bas");
      const data = await response.text();
      const sc = btoa(data);
      const result = await sendTransaction({ ringsize: 2, sc });
      return result;
    } catch (error) {
      console.error("Error reading or sending transaction:", error);
      return null; // You might want to handle errors appropriately
    }
  }

  return [mintSeat];
}
