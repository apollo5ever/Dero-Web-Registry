import { useSendTransaction } from "./useSendTransaction";
import { useGetRandomAddress } from "./useGetRandomAddress";

export function useRegisterName() {
  const [sendTransaction] = useSendTransaction();
  const [getRandomAddress] = useGetRandomAddress();
  // const logger = useContext(LoggerContext);

  async function registerName(scid, name, asset, token, index) {
    let address = await getRandomAddress();

    //removed asset burn, I think that was unnecessary

    let data = {
      scid: scid,
      ringsize: 2,
      transfers: [
        {
          scid: "8fe3b53bcbbf0dff7898dc9a660b28a687c4f44d22e8b6d07b44d2e9063b6e9e",
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
