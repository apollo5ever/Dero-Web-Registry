import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Lotto from "./lotto";
import { useGetBalance } from "../hooks/useGetBalance";
import { useEffect, useContext, useState } from "react";
import { LoginContext } from "../LoginContext";

function Hodler() {
  const [getBalance] = useGetBalance();
  const [state, setState] = useContext(LoginContext);
  const [DNSBalance, setDNSBalance] = useState(0);

  const getDNSBalance = async () => {
    const balance = await getBalance(state.scids.mainnet.dns);
    setDNSBalance(balance / 1000);
  };

  useEffect(() => {
    getDNSBalance();
  }, [state.xswd]);
  return (
    <div className="container mt-5">
      <h3>Your DNS Balance:{DNSBalance}</h3>
      <Lotto />
    </div>
  );
}

export default Hodler;
