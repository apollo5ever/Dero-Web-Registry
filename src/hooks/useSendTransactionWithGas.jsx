import { useSendTransaction } from "./useSendTransaction";
import { useGetGasEstimate } from "./useGetGasEstimate";
import { useGetAddress } from "./useGetAddress";

export function useSendTransactionWithGas() {
  const [sendTransaction] = useSendTransaction();
  const [getGasEstimate] = useGetGasEstimate();
  const [getAddress] = useGetAddress();

  async function sendTransactionWithGas(data) {
    console.log(data);

    data.gas_rpc = data.sc_rpc.concat([
      { name: "SC_ACTION", datatype: "U", value: 0 },
      { name: "SC_ID", datatype: "H", value: data.scid },
    ]);
    let signer = await getAddress();
    data.signer = signer;

    let fees = await getGasEstimate(data);
    data.fees = 1000;
    let txid = await sendTransaction(data);

    return txid;
  }

  return [sendTransactionWithGas];
}
