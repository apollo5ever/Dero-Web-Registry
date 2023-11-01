import { useSendTransaction } from "./useSendTransaction";
import { useGetAddress } from "./useGetAddress";
import { useGetGasEstimate } from "./useGetGasEstimate";

export function useMintOAO() {
  const [sendTransaction] = useSendTransaction();
  const [getAddress] = useGetAddress();
  const [getGasEstimate] = useGetGasEstimate();

  async function mintOAO({ data }) {
    try {
      const response = await fetch("/oao.bas");
      const data = await response.text();
      const sc = btoa(data);
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
            value: "test",
            datatype: "S",
          },
          {
            name: "ceo",
            value:
              "8860c63dd8a0ee66c2cbe304b4a1d4991da7dfe0443674cda06082565a5a74cc",
            datatype: "S",
          },
          {
            name: "http",
            value: data.url,
            datatype: "S",
          },
          {
            name: "seats",
            value:
              "c623dc933273fa64b1d33991171e1d56ecdb5ee59b767dc8dc16a106ea15aac6",
            datatype: "S",
          },
          {
            name: "trustees",
            value:
              "deto1qyvyeyzrcm2fzf6kyq7egkes2ufgny5xn77y6typhfx9s7w3mvyd5qqynr5hx",
            datatype: "S",
          },
          {
            name: "board",
            value: 1,
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
