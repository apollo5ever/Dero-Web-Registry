import { useMintSeat } from "./useMintSeat";
import { useMintOAO } from "./useMintOAO";
import { useMintBNT } from "./useMintBNT";
import { useMintIsland } from "./useMintIsland";
import { useMintG45 } from "./useMintG45";

export function useMintAsset() {
  const [mintSeat] = useMintSeat();
  const [mintOAO] = useMintOAO();
  const [mintBNT] = useMintBNT();
  const [mintIsland] = useMintIsland();
  const [mintG45] = useMintG45();

  async function mintAsset(type, data) {
    console.log("Mint asset type: ", type);
    console.log("Mint data: ", data);

    if (type === "Role Token") {
      try {
        let txid = await mintSeat(data);
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
    } else if (type === "Basic Name Token") {
      try {
        console.log(data);
        let txid = await mintBNT(data);
        console.log("bnt scid ", txid);
        return txid;
      } catch (error) {
        console.error("Error minting bnt:", error);
      }
    } else if (type === "Private Island") {
      try {
        console.log(data);
        let txid = await mintIsland(data);
        console.log("island scid ", txid);
        return txid;
      } catch (error) {
        console.error("Error minting island:", error);
      }
    } else if (type === "G45-NFT") {
      try {
        console.log(data);
        let txid = await mintG45(data);
        console.log("g45 scid ", txid);
        return txid;
      } catch (error) {
        console.error("Error minting g45:", error);
      }
    }
  }

  return [mintAsset];
}
