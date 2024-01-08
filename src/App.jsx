import { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import WebSocketService from "./webSocketService";
import { LoginContext } from "./LoginContext";
import { useGetSC } from "./hooks/useGetSC";
import ParseRegistry from "./parseRegistry";
import { useInitXSWD } from "./useInitXSWD";
import RpcToggle from "./components/rpcToggle";
import DaemonToggle from "./components/daemonToggle";
import { Row } from "react-bootstrap";
import "./App.css";
import Home from "./components/home";
import { Outlet, NavLink } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function App() {
  const [state, setState] = useContext(LoginContext);
  const [getSC] = useGetSC();
  const [initXSWD] = useInitXSWD();

  useEffect(() => {
    const initializeWS = async () => {
      try {
        const init = await initXSWD();
      } catch (error) {
        console.error("Error sending payload:", error);

        setTimeout(() => {
          initializeWS();
        }, 1000);
      }
    };
    initializeWS();
  }, [state.ws]);

  return (
    <>
      <header>
        <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
          <Container>
            <Navbar.Brand href="#/home">Dero Web</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="#/home">Home</Nav.Link>

                <NavDropdown title="Wallets" id="navbarScrollingDropdown">
                  <NavDropdown.Item href="#/wallets/register">
                    New Name
                  </NavDropdown.Item>
                  <NavDropdown.Item href="#/wallets/manage">
                    Manage Name
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="Assets" id="navbarScrollingDropdown">
                  <NavDropdown.Item href="#/assets/mint">
                    Mint Asset
                  </NavDropdown.Item>
                  <NavDropdown.Item href="#/assets/register">
                    New Name
                  </NavDropdown.Item>
                  <NavDropdown.Item href="#/assets/manage">
                    Manage Name
                  </NavDropdown.Item>
                </NavDropdown>
                <Nav.Link href="#/dns">DNS Holders</Nav.Link>
              </Nav>
              <Form className="d-flex">
                <Form.Control
                  type="search"
                  placeholder="Lookup Name"
                  className="me-2"
                  aria-label="Lookup"
                />
                <Button variant="outline-success">Lookup</Button>
              </Form>
            </Navbar.Collapse>
          </Container>
          <div className="d-flex flex-column">
            <RpcToggle />
            <DaemonToggle />
          </div>
        </Navbar>
      </header>
      <main>
        <Outlet />
      </main>
      <footer></footer>
    </>
  );
}

export default App;
