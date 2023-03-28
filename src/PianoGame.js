import React, { useState, useEffect } from "react";
import { Piano, KeyboardShortcuts, MidiNumbers } from "react-piano";
import Soundfont from "soundfont-player";
import "react-piano/dist/styles.css";
import HandleErrorPianoGame from "./HandleErrorPianoGame";
import SuccessMessage from "./SuccessMessage";
import styles from "./PianoGame.module.css";

function PianoGame() {
  const firstNote = MidiNumbers.fromNote("c3");
  const lastNote = MidiNumbers.fromNote("f5");
  const [keyboardShortcuts, setKeyboardShortcuts] = useState(
    KeyboardShortcuts.create({
      firstNote: firstNote,
      lastNote: lastNote,
      keyboardConfig: KeyboardShortcuts.HOME_ROW,
    })
  );

  const [audioContext, setAudioContext] = useState(null);
  const [instrument, setInstrument] = useState(null);
  const [noteSequence, setNoteSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [hint, setHint] = useState([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [difficulty, setDifficulty] = useState(null);
  const [instrumentName, setInstrumentName] = useState("acoustic_grand_piano");
  const [noteRange, setNoteRange] = useState({ first: firstNote, last: lastNote });

  useEffect(() => {
    const newAudioContext = new (window.AudioContext || window.webkitAudioContext)();
    setAudioContext(newAudioContext);

    return () => {
      if (newAudioContext) {
        newAudioContext.close();
      }
    };
  }, []);
  useEffect(() => {
    if (audioContext) {
      loadInstrument(instrumentName);
    }
  }, [audioContext]);
  function handleNoteRangeChange(event) {
    const range = event.target.value.split(",").map(MidiNumbers.fromNote);
    setNoteRange({ first: range[0], last: range[1] });
    setKeyboardShortcuts(
      KeyboardShortcuts.create({
        firstNote: range[0],
        lastNote: range[1],
        keyboardConfig: KeyboardShortcuts.HOME_ROW,
      }));
  }

  function loadInstrument(name) {
    if (audioContext) {
      Soundfont.instrument(audioContext, name).then((newInstrument) => {
        setInstrument(newInstrument);
        setInstrumentName(name);
      });
    }
  }
  function handleInstrumentChange(event) {
    const newInstrumentName = event.target.value;
    loadInstrument(newInstrumentName);
  }

  function generateRandomSequence(length) {
    const randomNotes = [];
    for (let i = 0; i < length; i++) {
      const randomMidiNumber = Math.floor(Math.random() * (lastNote - firstNote + 1)) + firstNote;
      randomNotes.push(randomMidiNumber);
    }
    return randomNotes;
  }

  function handlePlayClick() {
    if (difficulty) {
      const noteCounts = {
        easy: 2,
        medium: 6,
        hard: 12,
        impossible: 20,
      };
      const randomSequence = generateRandomSequence(noteCounts[difficulty]);
      setNoteSequence(randomSequence);
      setUserSequence([]);
      setHint([]);
      setHintsUsed(0);
      playNoteSequence(randomSequence);
    } else {
      alert("Please select a difficulty before playing.");
    }
  }

  function renderNoteLabel({ keyboardShortcut, midiNumber, isActive, isAccidental }) {
    const note = MidiNumbers.getAttributes(midiNumber).note;
    return (
      <div className="NoteLabel">
        <div className="NoteName">{note}</div>
        {keyboardShortcut && <div className="KeyboardShortcut">{keyboardShortcut}</div>}
      </div>
    );
  }
  function playNoteSequence(notes) {
    if (!instrument) return;

    let delay = 0;
    for (const note of notes) {
      setTimeout(() => instrument.play(note), delay);
      delay += 500;
    }
  }

  const [score, setScore] = useState(0);

  function handleNotePlay(midiNumber) {
    if (instrument) {
      instrument.play(midiNumber);
    }

    setUserSequence((prevUserSequence) => [...prevUserSequence, midiNumber]);

    const newUserSequence = [...userSequence, midiNumber];
    for (let i = 0; i < newUserSequence.length; i++) {
      if (newUserSequence[i] !== noteSequence[i]) {
        setSuccessMessage("");
        setErrorMessage("");
        setErrorMessage("Incorrect! Try again.");
        setUserSequence([]);
        setScore((prevScore) => prevScore - 1);
        return;
      }
    }
    setSuccessMessage("");
    setErrorMessage("");
    setScore((prevScore) => prevScore + 1);

    if (newUserSequence.length === noteSequence.length) {
      alert("Correct!");
      setScore((prevScore) => prevScore + 10);
    }
    for (let i = 0; i < newUserSequence.length; i++) {
      if (newUserSequence[i] !== noteSequence[i]) {
        return;
      }
    }
    setSuccessMessage("");
    setErrorMessage("");
    setSuccessMessage("Correct note!");

  }

  function handleReplayClick() {
    playNoteSequence(noteSequence);
  }
  function handleHintClick() {
    if (hintsUsed < noteSequence.length) {
      const nextNote = noteSequence[hintsUsed];
      const nextNoteName = MidiNumbers.getAttributes(nextNote).note;
      setHint((prevHint) => [...prevHint, nextNoteName]);
      setHintsUsed((prevHintsUsed) => prevHintsUsed + 1);
      setScore((prevScore) => prevScore - 5);
    }
  }
  function handleDifficultyClick(difficulty) {
    setDifficulty(difficulty);
  }

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <button onClick={() => handleDifficultyClick("easy")}>Easy</button>
        <button onClick={() => handleDifficultyClick("medium")}>Medium</button>
        <button onClick={() => handleDifficultyClick("hard")}>Hard</button>
        <button onClick={() => handleDifficultyClick("impossible")}>Impossible</button>
        <select value={instrumentName} onChange={handleInstrumentChange}>
          <option value="acoustic_grand_piano">Grand Piano</option>
          <option value="electric_guitar_clean">Electric Guitar</option>
          <option value="violin">Violin</option>
          <option value="flute">Flute</option>
          <option value="trumpet">Trumpet</option>
          <option value="xylophone">Xylophone</option>
          <option value="synth_drum">Synth Drum</option>
          <option value="marimba">Marimba</option>
          <option value="acoustic_bass">Acoustic Bass</option>
          <option value="harpsichord">Harpsichord</option>
        </select>
        <select onChange={handleNoteRangeChange}>
          <option value="c3,f5">C3 - F5</option>
          <option value="c2,c5">C2 - C5</option>
          <option value="c3,c6">C3 - C6</option>
          <option value="c4,c7">C4 - C7</option>
        </select>
      </div>
      <div>
        <button onClick={handlePlayClick}>Play</button>
        <button onClick={handleReplayClick}>Replay</button>
      </div>
      <Piano
        noteRange={noteRange}
        playNote={handleNotePlay}
        stopNote={(midiNumber) => {
          if (instrument) {
            instrument.stop(midiNumber);
          }
        }}
        width={window.innerWidth * 0.9}
        keyboardShortcuts={keyboardShortcuts}
        renderNoteLabel={renderNoteLabel}

      />
      <div className={styles.feedback}>
        <SuccessMessage message={successMessage} />
        <HandleErrorPianoGame errorMessage={errorMessage} />
      </div>
      <div>
        <button onClick={handleHintClick}>Hint</button>
        <span>{hint.join(", ")}</span>
      </div>
      <div>Score: {score}</div>
    </div>
  );
}

export default PianoGame;
