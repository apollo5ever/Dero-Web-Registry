import React, { useEffect, useRef } from "react";
import MusicPlayer from "./MusicPlayer";

const Identicon = ({ inputString, size = 200 }) => {
  const canvasRef = useRef(null);

  const syllables = [
    "BAN",
    "PUP",
    "MUK",
    "DER",
    "SUP",
    "CAN",
    "DID",
    "GON",
    "TOK",
    "GIM",
    "NAP",
    "ZOP",
    "FEP",
    "KIL",
    "TUN",
    "WIM",
    "SOP",
    "ZIG",
    "VUN",
    "LOP",
    "LEP",
    "NIN",
    "ROR",
    "QIP",
    "MOD",
    "HED",
    "TAZ",
    "VIZ",
    "GUB",
    "RAP",
    "TAD",
    "SOM",
    "LUR",
    "FIP",
    "XAC",
    "HUF",
    "ZET",
    "NEB",
    "QAP",
    "XEM",
    "VIT",
    "JUP",
    "PED",
    "LAF",
    "BOB",
    "CAP",
    "RAK",
    "ZUD",
    "VEC",
    "QOL",
    "FOK",
    "MOG",
    "SEK",
    "WAD",
    "JEL",
    "HIK",
    "ZAT",
    "VIP",
    "PAF",
    "QID",
    "TUB",
    "ZOS",
    "RUL",
    "FAM",
    "WOB",
    "KEK",
    "ZOL",
    "TED",
  ];

  const drawKeyhole = (context, x, y, size, rotation) => {
    const hexagonSize = size;

    // Draw hexagon
    context.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const hexagonX = x + hexagonSize * Math.cos(angle);
      const hexagonY = y + hexagonSize * Math.sin(angle);
      context.lineTo(hexagonX, hexagonY);
    }
    context.closePath();
    context.fillStyle = "black";
    context.fill();

    // Draw rotated triangles
    context.save();
    context.translate(x, y);
    context.rotate(rotation);
    context.translate(-x, -y);

    const triangleHeight = size * 0.75;
    const triangleWidth = size * 1;

    // Draw the first triangle
    context.beginPath();
    context.moveTo(x - triangleWidth / 3, y - size / 2);
    context.lineTo(x + triangleWidth / 3, y - size / 2);
    context.lineTo(x + triangleWidth / 2, y + size + triangleHeight);
    context.lineTo(x - triangleWidth / 2, y + size + triangleHeight);
    context.closePath();
    context.fillStyle = "black";
    context.fill();

    // Draw the second triangle below the first one (forming a diamond)
    context.beginPath();
    context.moveTo(x + triangleWidth / 2, y + size + triangleHeight);
    context.lineTo(x - triangleWidth / 2, y + size + triangleHeight);
    context.lineTo(x, y + size + triangleHeight + 6);
    context.closePath();
    context.fillStyle = "black";
    context.fill();

    context.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const pattern = inputString.match(/.{1,2}/g);

    // Draw a hexagon with alternating triangles containing text and others with filled-in circles
    const hexagonRadius = size / 2;
    const hexagonX = size / 2;
    const hexagonY = size / 2;

    // Rotate the hexagon by π/6
    context.translate(hexagonX, hexagonY);
    context.rotate(Math.PI / 6);
    context.translate(-hexagonX, -hexagonY);

    for (let i = 0; i < 6; i++) {
      const startAngle = (Math.PI / 3) * i;
      const endAngle = (Math.PI / 3) * (i + 1);

      // Choose a colorful background
      const color = parseInt(pattern[i % pattern.length], 16);
      const r = color % 256;
      const g = (color + 50) % 256;
      const b = (color + 100) % 256;
      context.fillStyle = `rgb(${r}, ${g}, ${b})`;

      const triangleCenterX =
        hexagonX +
        (hexagonRadius / 2) * Math.round(Math.cos(startAngle + Math.PI / 6));
      const triangleCenterY =
        hexagonY + (hexagonRadius / 2) * Math.sin(startAngle + Math.PI / 6);

      context.beginPath();
      context.moveTo(hexagonX, hexagonY);
      context.lineTo(
        hexagonX + hexagonRadius * Math.cos(startAngle),
        hexagonY + hexagonRadius * Math.sin(startAngle)
      );
      context.lineTo(
        hexagonX + hexagonRadius * Math.cos(endAngle),
        hexagonY + hexagonRadius * Math.sin(endAngle)
      );
      context.closePath();
      context.fill();

      // Set text color to the opposite of the background color
      context.fillStyle = "white";
      context.font = "30px 'Roboto', sans-serif"; // You can change the font here
      context.textAlign = "center";
      context.textBaseline = "middle";

      if (i === 3 || i === 5 || i === 1) {
        // Display text in specified triangles
        context.fillText(
          syllables[
            parseInt(pattern[i % pattern.length], 16) % syllables.length
          ],
          triangleCenterX,
          triangleCenterY + 7 + 10 * (i === 1)
        );
      } else {
        // Draw filled-in circles in other triangles
        const numberOfCircles = parseInt(pattern[i % pattern.length], 16) % 3; // Adjust the range as needed
        const circleRadius = 8;

        for (let j = 0; j < numberOfCircles; j++) {
          const circleX = triangleCenterX + j * 15;
          const circleY = triangleCenterY + j * 15;
          context.beginPath();
          context.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
          context.closePath();
          context.fill();
        }
      }
    }

    // Draw the keyhole in the center with opposite rotation (counter-clockwise)
    drawKeyhole(context, hexagonX, hexagonY, 15, -Math.PI / 6);

    // Reset the rotation transformation
    context.setTransform(1, 0, 0, 1, 0, 0);
  }, [inputString, size]);

  return (
    <div>
      <canvas ref={canvasRef} width={size} height={size} />
    </div>
  );
};

export default Identicon;
