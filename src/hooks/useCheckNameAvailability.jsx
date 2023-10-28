import { useGetSC } from "./useGetSC";
import hex2a from "../hex2a";
export function useCheckNameAvailability() {
  const [getSC] = useGetSC();
  // const logger = useContext(LoggerContext);

  async function checkNameAvailability(scid, name) {
    let registryData = await getSC(scid, false, true, null, null, [
      `a.dero${name}`,
    ]);
    console.log(registryData.valuesstring);
    if (registryData.valuesstring[0].startsWith("NOT")) {
      console.log("available!");
      return { scid: null };
    } else {
      console.log(hex2a(registryData.valuesstring[0]));
      return { scid: hex2a(registryData.valuesstring[0]) };
    }
  }

  return [checkNameAvailability];
}
