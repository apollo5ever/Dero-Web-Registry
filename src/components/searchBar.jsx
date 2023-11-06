import React, { useState, useContext } from "react";
import { useGetSC } from "../hooks/useGetSC";
import { LoginContext } from "../LoginContext";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [getSC] = useGetSC();
  const [state, setState] = useContext(LoginContext);

  const handleSearch = async () => {
    // Use the searchQuery state for your search logic
    console.log("Searching for:", searchQuery);
    const escapedSearch = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const scData = await getSC(state.scid, false, true);
    let collectionPattern = new RegExp(`c.*Owner$`);
    let matches = Object.keys(scData.stringkeys).filter((x) =>
      collectionPattern.test(x)
    );
    let collections = matches.map(
      (x) =>
        new Object({
          name: x.slice(1, -5),
        })
    );
    for (let i = 0; i < collections.length; i++) {
      let namePattern = new RegExp(
        `^(a|d)${collections[i].name}.*${escapedSearch}`
      );
      let nameMatches = Object.keys(scData.stringkeys).filter((x) =>
        namePattern.test(x)
      );
      console.log("name Matches: ", nameMatches);
    }
    console.log("collections", collections);
  };

  return (
    <div className="input-group mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="Search Assets, Addresses, Names, or Collections..."
        aria-label="Search"
        aria-describedby="basic-addon2"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button
        className="btn btn-outline-secondary"
        type="button"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
