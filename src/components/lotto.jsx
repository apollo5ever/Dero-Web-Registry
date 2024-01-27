import React, { useState, useContext, useEffect } from "react";
import { LoginContext } from "../LoginContext";
import { useSendTransaction } from "../hooks/useSendTransaction";
import { useGetGasEstimate } from "../hooks/useGetGasEstimate";
import { useGetAddress } from "../hooks/useGetAddress";
import { useGetSC } from "../hooks/useGetSC";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Button, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import hex2a from "../hex2a";
import dateString from "../dateString";

export default function Lotto() {
  const [state, setState] = useContext(LoginContext);
  const [amount, setAmount] = useState(1);
  const [sendTransaction] = useSendTransaction();
  const [getGasEstimate] = useGetGasEstimate();
  const [getAddress] = useGetAddress();
  const [getSC] = useGetSC();
  const [lottos, setLottos] = useState([]);
  const [userTickets, setUserTickets] = useState(0);
  const [ticketsSold, setTicketsSold] = useState(0);

  const scid = state.scids.mainnet.lotto; //state.lotto;
  const dns = state.scids.mainnet.dns; //state.dns;

  useEffect(() => {
    const getLotto = async () => {
      const userAddress = await getAddress();
      let lottos = [];
      const lottoSC = await getSC(scid, false, true);
      const treasuryPattern = /treasury/;

      let assets = Object.keys(lottoSC.stringkeys).filter((x) =>
        treasuryPattern.test(x)
      );

      const ticketPattern = /TICKET_/;
      let ticketCount = Object.keys(lottoSC.stringkeys).filter((x) =>
        ticketPattern.test(x)
      );
      let userTickets = ticketCount.filter(
        (x) => hex2a(lottoSC.stringkeys[x]) == userAddress
      );
      console.log("userTickets", userTickets);

      // let userTickets = lottoSC.stringkeys[`${userAddress}_TICKETS`];
      for (let i = 0; i < assets.length; i++) {
        let scid = assets[i].slice(8);
        let nextDraw = lottoSC.stringkeys[`nextDraw${scid}`];
        let prize;
        if (
          scid ===
          "0000000000000000000000000000000000000000000000000000000000000000"
        ) {
          prize = "DERO";
        } else {
          prize = scid;
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
      setTicketsSold(ticketCount.length - 1);
      setUserTickets(userTickets);
      console.log("assets: ", assets);
    };
    getLotto();
  }, [state.xswd]);

  const handleAmountChange = (e) => {
    const value = parseInt(e.target.value, 10);

    // If the value is valid (a positive integer or zero), update the state.
    // Otherwise, set it to 1 (minimum value).
    setAmount(isNaN(value) || value <= 0 ? 1 : value);
  };

  const handleRedeem = async () => {
    const address = await getAddress();
    let ticketString = "";
    for (let i = 0; i < amount; i++) {
      let ticketNumber = userTickets[i].split("_")[1];
      ticketString += "000000".slice(ticketNumber.length) + ticketNumber;
    }
    console.log("user is redeeming ", amount, " tickets");
    const fees = await getGasEstimate({
      scid: scid,
      ringsize: 2,
      signer: address,

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
          value: "RedeemDNS",
        },
        {
          name: "ticket",
          datatype: "S",
          value: ticketString,
        },
      ],
    });
    sendTransaction({
      scid: scid,
      ringsize: 2,
      fees: fees,

      sc_rpc: [
        {
          name: "entrypoint",
          datatype: "S",
          value: "RedeemDNS",
        },
        {
          name: "ticket",
          datatype: "S",
          value: ticketString,
        },
      ],
    });
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
          burn: parseInt(amount * 1000000),
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
          burn: parseInt(amount * 1000000),
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
    <Container className="mt-5">
      <Row>
        <Col md={6}>
          <h1>Welcome to the DNS Lottery</h1>
          <p>
            Each month the Dero Web OAO will transfer 25% of that month's sales
            into the DNS Lottery Pool. Each month a winner will be drawn, and
            they will win the entire pool. Winnings are sent out automatically,
            no need to withdraw.
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
          <Button onClick={handlePurchase} className="btn btn-primary">
            Purchase {amount > 0 && `(${amount * 1000} DNS)`}
          </Button>
          {"          "}
          <Button onClick={handleRedeem} className="btn btn-primary">
            Redeem {amount > 0 && `(${amount * 1000} DNS)`}
          </Button>
        </Col>
        <Col md={6}>
          <div className="prizes">
            <h1>Current Prize Pool</h1>
            {lottos
              .filter((x) => x.prize != 0)
              .map((lotto, i) => (
                <div key={i} className="prize-item">
                  <p>
                    Prize #{i + 1}: {lotto.prize / 100000} {lotto.asset}{" "}
                    {dateString(lotto.nextDraw).local}
                  </p>
                </div>
              ))}
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <div className="progress-container">
            <CircularProgressbar
              value={ticketsSold * 2}
              text={`${ticketsSold}/50 Sold`}
              styles={{
                path: { stroke: `#4CAF50` },
                text: { fill: "#4CAF50", fontSize: "8px" },
              }}
            />
          </div>
        </Col>

        <Col md={3}>
          <div className="progress-container">
            <CircularProgressbar
              value={(100 * userTickets.length) / ticketsSold}
              text={`${Math.round(
                (100 * userTickets.length) / ticketsSold
              )}% Chance to Win`}
              styles={{
                path: { stroke: `#4CAF50` },
                text: { fill: "#4CAF50", fontSize: "8px" },
              }}
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
}
