import React, { useEffect } from "react";
import * as Tone from "tone";
import Identicon from "./Identicon";

const MusicPlayer = ({ inputString }) => {
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
  console.log("noteLengths", noteLengths);

  const playChords = async () => {
    playMelody();
    const crusher = new Tone.BitCrusher(
      1 + parseInt(inputString[14], 16)
    ).toDestination();
    /*
    const chebyNum = parseInt(inputString[13] + inputString[14], 16);
    console.log("chebNum", chebyNum);
    const cheby = new Tone.Chebyshev(chebyNum).toDestination();*/

    const reverb = new Tone.Reverb(parseInt(inputString[19], 16)).connect(
      crusher
    );
    const synth = new Tone.Sampler({
      urls: {
        C4: "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        A4: "A4.mp3",
      },
      release: 1,
      baseUrl: "https://tonejs.github.io/audio/salamander/",
    }).connect(reverb);

    // const synth = new Tone.PolySynth(Tone.AMSynth).connect(reverb);

    // Play the chords
    Tone.Transport.bpm.value = 120;
    Tone.Transport.timeSignature = [4, 4];
    Tone.Transport.loop = false;

    const chordDuration = "4n"; // Adjust as needed
    const modifiedScale = selectedScale.map((note) => note.slice(0, -1) + "2");

    Tone.loaded().then(() => {
      selectedChords.forEach((chord, index) => {
        // Map the chord indices to note names in the selected scale
        const chordNotes = chord.map(
          (noteIndex) => modifiedScale[noteIndex % selectedScale.length]
        );
        console.log("playing chord", chord, chordNotes, selectedScale);

        // Trigger the chord
        synth.triggerAttackRelease(
          chordNotes,
          chordDuration,
          `${Tone.now() + index}`
        );
      });
    });

    // Stop Tone.js transport after the chords are played
    Tone.Transport.stop();
    Tone.Transport.cancel();
  };
  const playMelody = async () => {
    const reverb = new Tone.Reverb(
      parseInt(inputString[20], 16)
    ).toDestination();
    /*  const synth = new Tone.Sampler({
      urls: {
        C4: "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        A4: "A4.mp3",
      },
      release: 1,
      baseUrl: "https://tonejs.github.io/audio/salamander/",
    }).connect(reverb); */
    const synth = new Tone.Synth().connect(reverb);

    // Log melodyNotes to console for debugging
    console.log("Melody Notes:", melodyNotes);
    console.log("melody lengths", noteLengths);

    // Tone.Transport.stop();
    //Tone.Transport.cancel();

    // Play the melody
    Tone.Transport.bpm.value = 360;
    Tone.Transport.timeSignature = [4, 4];
    Tone.Transport.loop = false;
    Tone.loaded().then(() => {
      melodyNotes.forEach((note, index) => {
        console.log(note, "note", Tone.now());
        synth.triggerAttackRelease(
          note,
          noteLengths[index],
          `${Tone.now() + index * 0.25}`
        );
        /* if (index % 7 == 0) {
        console.log("play chord", selectedChords[index % 4]);
        synth.triggerAttackRelease(
          selectedChords[index % 4][0],
          "1n",
          Tone.now() + index * 0.25
        ); //0,3,2,1,0
        synth.triggerAttackRelease(
          selectedChords[index % 4][1],
          "1n",
          Tone.now() + index * 0.25
        );
        synth.triggerAttackRelease(
          selectedChords[index % 4][2],
          "1n",
          Tone.now() + index * 0.25
        );
      } */
      });
    });

    //Tone.Transport.start();

    // Stop Tone.js transport after the melody is played
    /*  Tone.Transport.stop();
    Tone.Transport.cancel(); */
  };

  /*   useEffect(() => {
    // Parse inputString and extract musical parameters
   
    const melodyVoiceIndex = parseInt(inputString[1], 16) % 16;
    const chordVoiceIndex = parseInt(inputString[2], 16) % 16;
    const chordProgression = inputString
      .slice(3, 7)
      .split("")
      .map((c) => parseInt(c, 16) % 16);
    const melodyNotes = inputString
      .slice(7, 35)
      .split("")
      .map((c) => selectedScale[parseInt(c, 16) % selectedScale.length]);
    console.log("melody", selectedScale, melodyNotes);
    const drumLoopIndex = parseInt(inputString[35], 16) % 16;

    // Setup Tone.js within a user-triggered event (e.g., button click)
    const handleButtonClick = () => {
      // Create a synthesizer for melodic instruments
      const melodicInstrument = new Tone.Synth().toDestination();
      melodicInstrument.set({ oscillator: { type: "sine" } }); // Adjust as needed

      // Create a synthesizer for drum sounds
      const drumKit = new Tone.MembraneSynth().toDestination();
      drumKit.volume.value = -10; // Adjust as needed

      // Play chords
      const chords = new Tone.PolySynth().toDestination();
      chords.set({ voice: "someVoicesArray[chordVoiceIndex]" }); // Adjust as needed
      chords.triggerAttackRelease(chordProgression, "1m"); // Adjust as needed

      // Play melody
      melodyNotes.forEach((note) => {
        melodicInstrument.triggerAttackRelease(
          `${selectedScale[parseInt(note, 16) % selectedScale.length]}4`,
          "8n"
        );
        // Adjust as needed
      });

      // Play drum loop
      const drumLoop = new Tone.Pattern(
        (time, note) => {
          drumKit.triggerAttackRelease(note, "16n", time);
        },
        ["someDrumLoopArray[drumLoopIndex]"], // Adjust as needed
        "up"
      ).start(0);

      // Set up scale for the entire piece
      Tone.Transport.schedule((time) => {
        Tone.Transport.bpm.value = 120; // Adjust as needed
        Tone.Transport.timeSignature = [4, 4]; // Adjust as needed
        Tone.Transport.loop = true;
        Tone.Transport.loopEnd = "1m";
      }, 0);

      // Start Tone.js transport

      // Tone.Transport.start();
    };

    // Add an event listener for button click
    document
      .getElementById("startAudioButton")
      .addEventListener("click", handleButtonClick);

    // Cleanup: Remove the event listener when the component unmounts
    return () => {
      document
        .getElementById("startAudioButton")
        .removeEventListener("click", handleButtonClick);
      Tone.Transport.stop();
      Tone.Transport.cancel();
    };
  }, [inputString]); */

  return (
    <div onClick={playChords}>
      <Identicon inputString={inputString} />
    </div>
  ); // You can replace this with your UI
};

export default MusicPlayer;
