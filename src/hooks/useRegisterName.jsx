import { useSendTransaction } from "./useSendTransaction";
import { useGetRandomAddress } from "./useGetRandomAddress";

export function useRegisterName() {
  const [sendTransaction] = useSendTransaction();
  const [getRandomAddress] = useGetRandomAddress();
  // const logger = useContext(LoggerContext);

  async function registerName(scid, name, asset, token, index) {
    let address = await getRandomAddress();

    let data = {
      scid: scid,
      ringsize: 2,
      transfers: [
        {
          scid: asset,
          burn: 1,
          destination: address,
        },
      ],
      sc_rpc: [
        {
          name: "entrypoint",
          datatype: "S",
          value: "RegisterAsset",
        },
        {
          name: "collection",
          datatype: "S",
          value: ".dero",
        },
        {
          name: "name",
          datatype: "S",
          value: name,
        },
        {
          name: "scid",
          datatype: "S",
          value: asset,
        },
        {
          name: "index",
          datatype: "U",
          value: parseInt(index),
        },
      ],
    };
    sendTransaction(data);
  }

  return [registerName];
}
