import { useGetSC } from "./useGetSC";
import hex2a from "../hex2a";
export function useGetReputation() {
  const [getSC] = useGetSC();
  // const logger = useContext(LoggerContext);

  async function getReputation(scid, object) {
    let registryData = await getSC(scid, false, true, null, null);
    let repPattern = new RegExp(`rating:${object}`);
    let keys = Object.keys(registryData.stringkeys);
    for (let i = 0; i < keys.length; i++) {
      if (repPattern.test(keys[i])) {
        console.log(
          "found rating: ",
          keys[i],
          registryData.stringkeys[keys[i]]
        );
      }
    }
  }

  return [getReputation];
}
