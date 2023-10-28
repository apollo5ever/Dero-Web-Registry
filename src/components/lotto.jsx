import React, { useState } from "react";
import { useCheckNameAvailability } from "../hooks/useCheckNameAvailability";
import { useAssetLookup } from "../hooks/useAssetLookup";
import { useRegisterName } from "../hooks/useRegisterName";

export default function Lotto() {
  const [checkNameAvailability] = useCheckNameAvailability();
  const [registerName] = useRegisterName();
  const [assetLookup] = useAssetLookup();
  const [amount, setAmount] = useState(0);

  const handleNameChange = async (e) => {
    const value = e.target.value;
    setName(value);

    if (value.endsWith(".dero")) {
      const availability = await checkNameAvailability(
        "ae0a1b2c1c8362278cc50333ad28c474537fee19ed771902066dfb4aae6cc9f4",
        value.slice(0, -5)
      );

      if (availability.scid) {
        setAvailable(false);
      } else {
        setAvailable(true);
      }
    } else {
      setAvailable(true);
    }
  };
  const handleAmountChage = (e) => {
    setAmount(e.target.value);
  };
  const handleRegister = async () => {
    // Add your registration logic here
    let names = await assetLookup(
      "ae0a1b2c1c8362278cc50333ad28c474537fee19ed771902066dfb4aae6cc9f4",
      asset
    );
    await registerName(
      "ae0a1b2c1c8362278cc50333ad28c474537fee19ed771902066dfb4aae6cc9f4",
      name.slice(0, -5),
      asset,
      "",
      names.length
    );
    console.log("index", names.length);

    console.log(`Registering name: ${name}`);
  };

  return (
    <>
      <div className="mb-3">
        <h1>Welcome to the DNS Lottery</h1>
        <p>
          Each month the Dero Web OAO will transfer 25% of that month's sales
          into the DNS Lottery Pool. Each month a winner will be drawn and he
          will win the entire pool. Winnings are sent out automatically, no need
          to withdraw.
        </p>
        <p>
          There are only 50 tickets available. That means each ticket has a
          minimum 2% chance of winning each month. Each ticket costs 1000 DNS.
          Tickets never expire and can be redeemed for the original 1000 DNS at
          any time.
        </p>
        <input
          type="number"
          placeholder="number of tickets"
          onChange={handleAmountChage}
        />
      </div>
      <button onClick={handleRegister} className="btn btn-primary">
        Purchase {amount > 0 && "(" + amount * 1000 + "DNS)"}
      </button>
    </>
  );
}
