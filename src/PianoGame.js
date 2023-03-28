import React, { useState, useEffect } from "react";
import { Piano, KeyboardShortcuts, MidiNumbers } from "react-piano";
import Soundfont from "soundfont-player";
import "react-piano/dist/styles.css";
import HandleErrorPianoGame from "./HandleErrorPianoGame";
import SuccessMessage from "./SuccessMessage";

function PianoGame() {
  const firstNote = MidiNumbers.fromNote("c3");
  const lastNote = MidiNumbers.fromNote("f5");
  const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote: firstNote,
    lastNote: lastNote,
    keyboardConfig: KeyboardShortcuts.HOME_ROW,
  });

  const [audioContext, setAudioContext] = useState(null);
  const [instrument, setInstrument] = useState(null);
  const [noteSequence, setNoteSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const newAudioContext = new (window.AudioContext || window.webkitAudioContext)();
    setAudioContext(newAudioContext);
    Soundfont.instrument(newAudioContext, "acoustic_grand_piano").then((piano) => {
      setInstrument(piano);
    });

    return () => {
      if (newAudioContext) {
        newAudioContext.close();
      }
    };
  }, []);

  function generateRandomSequence(length) {
    const randomNotes = [];
    for (let i = 0; i < length; i++) {
      const randomMidiNumber = Math.floor(Math.random() * (lastNote - firstNote + 1)) + firstNote;
      randomNotes.push(randomMidiNumber);
    }
    return randomNotes;
  }

  function handlePlayClick() {
    const randomSequence = generateRandomSequence(5);
    setNoteSequence(randomSequence);
    setUserSequence([]);
    playNoteSequence(randomSequence);
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
  return (
    <div>
      <button onClick={handlePlayClick}>Play</button>
      <button onClick={handleReplayClick}>Replay</button>
      <p>Score: {score}</p>
      <Piano
        noteRange={{ first: firstNote, last: lastNote }}
        playNote={handleNotePlay}
        stopNote={(midiNumber) => {
          if (instrument) {
            instrument.stop(midiNumber);
          }
        }}
        width={900}
        keyboardShortcuts={keyboardShortcuts}
        renderNoteLabel={renderNoteLabel}
      />
      <SuccessMessage message={successMessage} />
      <HandleErrorPianoGame errorMessage={errorMessage} />
    </div>
  );
}

export default PianoGame;
