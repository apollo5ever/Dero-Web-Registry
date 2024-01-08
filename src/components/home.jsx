import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function Home() {
  return (
    <div className="container mt-5">
      <h1>Welcome to Dero Web</h1>
      <p>
        We are building an unstoppable network of wallets, assets, and
        organizations on Dero. Claim your name and attach it to your wallet,
        your DeroID, or your organization. The Dero Web browser extension let's
        you navigate the Dero Web.
      </p>
      <h3>Wallet Names (.DERO)</h3>
      <p>
        Leveraging Dero's native wallet name system, here you can assign
        additional data to your name.
      </p>
      <h3>Asset Names (.DNS)</h3>
      <p>
        We are introducing a second name system to Dero in addition to the
        native naming system. This one is for assets instead of wallets. The two
        compliment one another. Assets can be easily bought and sold in
        contracts, and can be owned by organizations as well as individuals.
      </p>
      <h3>DeroID</h3>
      <p>
        DeroID is your pseudonymous identity that can function as a cross-dAPP
        authentication token, profile page, store of assets, store of
        reputation, and more.
      </p>
      <h3>Social Coconut Score</h3>
      <p>
        Through Dero Web we can build trust while maintaining privacy. Each
        asset, contract, organization, and wallet, can have a trust score. There
        are 3 types of ratings. Public, anonymous, and verified interactions.
      </p>
      <h3>Optimal Autonomous Organizations</h3>
      <p>
        OAOs are a special kind of DAO. Monarchical instead of oligarchic. On
        this website you can easily create your own OAO and give it its own
        name.
      </p>
    </div>
  );
}

export default Home;
