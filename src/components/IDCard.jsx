import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "react-bootstrap";

const IDCard = (props) => {
  const {
    image,
    date,
    tagline,
    bio,
    scid,
    address,
    name,
    plaintext,
    richBio,
    reputation,
  } = props;

  const [showModal, setShowModal] = useState(false);
  const [expandedBio, setExpandedBio] = useState(false);

  const handleModalClose = () => setShowModal(false);
  const handleImageClick = () => setShowModal(true);
  const handleExpandBio = () => setExpandedBio(true);
  const condensedBio =
    richBio && richBio.length > 200 ? richBio.substring(0, 200) + "..." : bio;

  return (
    <div
      className="fixed-size-card card rounded shadow"
      style={{ width: "36rem" }}
    >
      <img
        src={image}
        className="fixed-size-image card-img-top rounded-top"
        alt="User"
        onClick={handleImageClick}
        style={{ width: "125px", height: "125px", objectFit: "cover" }}
      />
      <div className="card-body">
        <h5 className="card-title">{name ? name : "Unregistered DeroID"}</h5>
        <strong>Reputation:</strong>
        {reputation ? reputation : "None"}
        {plaintext ? (
          <p className="card-text">
            {expandedBio ? bio : condensedBio}
            {!expandedBio && bio.length > 200 && (
              <button className="btn btn-link" onClick={handleExpandBio}>
                Expand
              </button>
            )}
          </p>
        ) : (
          <>
            {expandedBio ? (
              <p
                className="card-text"
                dangerouslySetInnerHTML={{ __html: richBio }}
              ></p>
            ) : (
              <p>
                {condensedBio}
                <button className="btn btn-link" onClick={handleExpandBio}>
                  Expand
                </button>
              </p>
            )}{" "}
          </>
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

      {/* Modal for Full-Size Image */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Full Size Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={image} className="img-fluid" alt="Full Size User" />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default IDCard;
