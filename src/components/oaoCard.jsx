import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "react-bootstrap";

const OAOCard = (props) => {
  const { scid, name, url } = props;

  return (
    <div
      className="fixed-size-card card rounded shadow"
      style={{ width: "36rem" }}
    >
      <div className="card-body">
        <h5 className="card-title">{name ? name : "Unregistered OAO"}</h5>
        <strong>Reputation:</strong>

        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <strong>SCID:</strong> {scid}
          </li>
          <li className="list-group-item">
            <strong>url:</strong> {url}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default OAOCard;
