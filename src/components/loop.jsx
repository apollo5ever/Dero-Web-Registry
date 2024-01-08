import React, { useEffect, useState } from "react";
import * as Tone from "tone";
import Identicon from "./Identicon";

const Loop = ({ inputString }) => {
  const [playing, setPlaying] = useState(false);
  const scales = [
    ["C4", "D4", "E4", "F4", "G4", "A4", "B4"], // Major Scale
    ["C4", "D4", "Eb4", "F4", "G4", "Ab4", "Bb4"], // Natural Minor Scale
    ["C4", "D4", "Eb4", "F4", "G4", "Ab4", "B4"], // Harmonic Minor Scale
    ["C4", "D4", "Eb4", "F4", "G4", "A4", "B4"], // Melodic Minor Scale
    ["D4", "E4", "F4", "G4", "A4", "B4", "C4"], // Dorian Mode
    ["E4", "F4", "G4", "A4", "B4", "C4", "D4"], // Phrygian Mode
    ["F4", "G4", "A4", "B4", "C4", "D4", "E4"], // Lydian Mode
    ["G4", "A4", "B4", "C4", "D4", "E4", "F4"], // Mixolydian Mode
    ["A4", "B4", "C4", "D4", "E4", "F4", "G4"], // Locrian Mode
    ["C4", "Eb4", "F4", "Gb4", "G4", "Bb4"], // Blues Scale
    ["C4", "D4", "E4", "G4", "A4"], // Pentatonic Major Scale
    ["A4", "C4", "D4", "E4", "G4"], // Pentatonic Minor Scale
    ["C4", "D4", "E4", "F#4", "G#4", "A#4"], // Whole Tone Scale
    ["C4", "D#4", "E4", "F#4", "A4", "B4"], // Augmented Scale
    ["C4", "D4", "Eb4", "F#4", "G#4", "A4", "B4"], // Diminished Scale
    ["C4", "D4", "E4", "F#4", "G4", "A4", "B4"], // Bebop Major Scale
  ];

  const getMelody = (scale) => {
    let melody = [];
    for (let i = 1; i < 16; i++) {
      const n = parseInt(inputString[i], 16);
      let octave = "2";
      if (n > scale.length) {
        if (n > scale.length * 2) {
          octave = "4";
        } else {
          octave = "3";
        }
      }
      const note = scale[n].slice(0 - 1) + octave;
    }
  };

  const chords = [
    [0, 2, 4], // I
    [1, 3, 5], // ii
    [2, 4, 6], // iii
    [3, 5, 7], // IV
    [4, 6, 8], // V
    [5, 7, 9], // vi
    [6, 8, 10], // vii
    [7, 9, 11], // VIII
    [8, 10, 0], // IX
    [9, 11, 1], // X
    [10, 0, 2], // XI
    [11, 1, 3], // XII
    [0, 2, 4, 6], // I7
    [2, 4, 6, 8], // iii7
    [4, 6, 8, 10], // V7
    [6, 8, 10, 0], // vii7
  ];

  const scaleIndex = parseInt(inputString[0], 16) % 16;
  const selectedScale = scales[scaleIndex];
  let selectedChords = [];
  for (let i = 1; i < 5; i++) {
    selectedChords.push(chords[parseInt(inputString[i], 16) % 16]);
  }

  console.log("selectedChords:", selectedChords);
  const melodyNotes = inputString
    .slice(7, 23)
    .split("")
    .map((c) => selectedScale[parseInt(c, 16) % selectedScale.length]);

  const noteLengths = inputString
    .slice(35, 64)
    .split("")
    .map((c) => Tone.Time(parseInt(c, 16) / 16).toNotation());

  const play = () => {
    if (playing) {
      setPlaying(false);
      Tone.Transport.stop();
      Tone.Transport.cancel();
      return;
    } else {
      setPlaying(true);

      const synth = new Tone.Synth().toDestination();
      const seq = new Tone.Sequence(
        (time, note) => {
          synth.triggerAttackRelease(note, 0.1, time);
          // subdivisions are given as subarrays
        },
        [["C2", "Cs2", "Cs1", "C1"], "E4", "G4", ["A4", "G4"]]
      ).start(0);
      Tone.Transport.start();
    }
  };

  return (
    <div>
      <Identicon playChords={play} inputString={inputString} />
    </div>
  ); // You can replace this with your UI
};

export default Loop;
