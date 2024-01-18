import React from "react";
import IDCard from "../components/IDCard";
import { useGetSC } from "./useGetSC";
import hex2a from "../hex2a";

export function useGetDeroIDCard() {
  const [getSC] = useGetSC();
  const getDeroIDCard = async (scid, name) => {
    const result = await getSC(scid, false, true);
    const image = hex2a(result.stringkeys.image);
    const owner = hex2a(result.stringkeys.OWNER);
    const bio = hex2a(result.stringkeys.bio);
    return (
      <IDCard
        scid={scid}
        //bio={bio}
        richBio={bio}
        name={name}
        image={image}
        //plaintext={plaintext}
        address={owner}
        //reputation={reputation}
      />
    );
  };
  return [getDeroIDCard];
}
