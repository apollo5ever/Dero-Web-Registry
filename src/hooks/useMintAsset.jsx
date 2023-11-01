import { useMintSeat } from "./useMintSeat";
import { useMintOAO } from "./useMintOAO";

export function useMintAsset() {
  const [mintSeat] = useMintSeat();
  const [mintOAO] = useMintOAO();

  async function mintAsset(type, data) {
    console.log("Mint asset type: ", type);
    console.log("Mint data: ", data);

    if (type === "Role Token") {
      try {
        let txid = await mintSeat();
        console.log("seat scid ", txid);
        return txid;
      } catch (error) {
        console.error("Error minting seat:", error);
      }
    } else if (type === "OAO") {
      try {
        console.log(data);
        let txid = await mintOAO(data);
        console.log("seat scid ", txid);
        return txid;
      } catch (error) {
        console.error("Error minting seat:", error);
      }
    }
  }

  return [mintAsset];
}
