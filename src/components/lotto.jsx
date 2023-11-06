import React, { useState, useContext, useEffect } from "react";
import { LoginContext } from "../LoginContext";
import { useSendTransaction } from "../hooks/useSendTransaction";
import { useGetGasEstimate } from "../hooks/useGetGasEstimate";
import { useGetAddress } from "../hooks/useGetAddress";
import { useGetSC } from "../hooks/useGetSC";

export default function Lotto() {
  const [state, setState] = useContext(LoginContext);
  const [amount, setAmount] = useState(1);
  const [sendTransaction] = useSendTransaction();
  const [getGasEstimate] = useGetGasEstimate();
  const [getAddress] = useGetAddress();
  const [getSC] = useGetSC();
  const [lottos, setLottos] = useState([]);

  const scid = state.lotto;
  const dns = state.dns;

  useEffect(() => {
    const getLotto = async () => {
      let lottos = [];
      const lottoSC = await getSC(scid, false, true);
      const treasuryPattern = /treasury/;
      let assets = Object.keys(lottoSC.stringkeys).filter((x) =>
        treasuryPattern.test(x)
      );
      for (let i = 0; i < assets.length; i++) {
        let scid = assets[i].slice(8);
        let nextDraw = lottoSC.stringkeys[`nextDraw${scid}`];
        let prize;
        if (
          scid ===
          "0000000000000000000000000000000000000000000000000000000000000000"
        ) {
          prize = "DERO";
        }
        let asset = {
          nextDraw: nextDraw,
          prize: lottoSC.stringkeys[assets[i]],
          asset: prize,
        };
        console.log("asset object", asset);
        lottos.push(asset);
      }
      setLottos(lottos);
      console.log("assets: ", assets);
    };
    getLotto();
  }, [state.daemonMode]);

  const handleAmountChange = (e) => {
    const value = parseInt(e.target.value, 10);

    // If the value is valid (a positive integer or zero), update the state.
    // Otherwise, set it to 1 (minimum value).
    setAmount(isNaN(value) || value <= 0 ? 1 : value);
  };

  const handlePurchase = async () => {
    const address = await getAddress();
    console.log("user is purchasing ", amount, " tickets");
    const fees = await getGasEstimate({
      scid: scid,
      ringsize: 2,
      signer: address,
      transfers: [
        {
          burn: parseInt(amount * 1000),
          scid: dns,
        },
      ],
      gas_rpc: [
        {
          name: "SC_ACTION",
          datatype: "U",
          value: 0,
        },
        {
          name: "SC_ID",
          datatype: "H",
          value: scid,
        },
        {
          name: "entrypoint",
          datatype: "S",
          value: "BuyTickets",
        },
      ],
    });
    sendTransaction({
      scid: scid,
      ringsize: 2,
      fees: fees,
      transfers: [
        {
          burn: parseInt(amount * 1000),
          scid: dns,
        },
      ],
      sc_rpc: [
        {
          name: "entrypoint",
          datatype: "S",
          value: "BuyTickets",
        },
      ],
    });
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <h1>Welcome to the DNS Lottery</h1>
          <p>
            Each month the Dero Web OAO will transfer 25% of that month's sales
            into the DNS Lottery Pool. Each month a winner will be drawn and he
            will win the entire pool. Winnings are sent out automatically, no
            need to withdraw.
          </p>
          <p>
            There are only 50 tickets available. That means each ticket has a
            minimum 2% chance of winning each month. Each ticket costs 1000 DNS.
            Tickets never expire and can be redeemed for the original 1000 DNS
            at any time.
          </p>
          <input
            type="number"
            className="form-control mb-3"
            placeholder="# tickets"
            onChange={handleAmountChange}
            min="1"
            max="50"
          />
          <button onClick={handlePurchase} className="btn btn-primary">
            Purchase {amount > 0 && `(${amount * 1000} DNS)`}
          </button>
        </div>
        <div className="col-md-6">
          <div className="prizes">
            <h1>Current Prize Pool</h1>
            {lottos.map((x, i) => (
              <p key={i}>
                Prize # {i + 1}: {x.prize / 100000} {x.asset}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
