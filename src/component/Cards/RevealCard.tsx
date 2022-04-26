import React, { useState, useEffect } from "react";
import ReactCardFlip from "react-card-flip";
import CommonBtn from "../Buttons/CommonBtn";
import "./card.css";

const RevealCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = (status: any) => {
    setIsFlipped(status);
  };

  return (
    <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
      <div className="revealCard" onClick={() => handleFlip(true)}>
        <img
          src="/assets/images/characters/jpg/beasts/Phoenix.jpg"
          className="backImg"
          alt=""
        />
        <div className="blow"></div>
        <img src="/assets/images/loading.gif" alt="" className="logo" />
      </div>
      <div className="revealCard">
        <img
          src="/assets/images/characters/jpg/beasts/Phoenix.jpg"
          className="backImg"
          alt=""
        />
        <div
          className="blow"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => handleFlip(false)}
        >
          {/* <div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <img
                src="/assets/images/loading.gif"
                style={{ width: "30%" }}
                alt=""
              />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CommonBtn onClick={() => handleFlip(true)}>
                Reveal Items
              </CommonBtn>
            </div>
          </div> */}
        </div>
        <div className="revealBtn">
          <CommonBtn onClick={() => handleFlip(true)}>Reveal Items</CommonBtn>
        </div>
      </div>
    </ReactCardFlip>
  );
};

export default RevealCard;
