import { useGetSC } from "./useGetSC";
import hex2a from "../hex2a";
export function useAssetLookup() {
  const [getSC] = useGetSC();
  // const logger = useContext(LoggerContext);

  async function assetLookup(scid, asset) {
    let names = [];
    let registryData = await getSC(scid, false, true);
    let regexPattern = new RegExp(`^n\\.dero${asset}\\d*$`);
    for (let key of Object.keys(registryData.stringkeys)) {
      if (regexPattern.test(key)) {
        names.push(hex2a(registryData.stringkeys[key]));
      }
    }
    return names;
  }

  return [assetLookup];
}
