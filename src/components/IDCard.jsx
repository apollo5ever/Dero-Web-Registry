import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const IDCard = (props) => {
  const { image, date, tagline, bio, scid, address, name, plaintext, richBio } =
    props;

  return (
    <div className="card rounded shadow" style={{ width: "36rem" }}>
      <img src={image} className="card-img-top rounded-top" alt="User" />
      <div className="card-body">
        <h5 className="card-title">{name ? name : "Unregistered DeroID"}</h5>
        {plaintext ? (
          <p className="card-text">{bio}</p>
        ) : (
          <p
            className="card-text"
            dangerouslySetInnerHTML={{ __html: richBio }}
          />
        )}
        <ul className="list-group list-group-flush">
          {tagline && (
            <li className="list-group-item">
              <strong>Tagline:</strong> {tagline}
            </li>
          )}
          <li className="list-group-item">
            <strong>SCID:</strong> {scid}
          </li>
          <li className="list-group-item">
            <strong>Address:</strong> {address}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default IDCard;
