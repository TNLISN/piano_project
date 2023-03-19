import React, { useState, useEffect } from "react";
import { Piano, KeyboardShortcuts, MidiNumbers } from "react-piano";
import Soundfont from "soundfont-player";
import "react-piano/dist/styles.css";

function App() {
  const firstNote = MidiNumbers.fromNote("c3");
  const lastNote = MidiNumbers.fromNote("f5");
  const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote: firstNote,
    lastNote: lastNote,
    keyboardConfig: KeyboardShortcuts.HOME_ROW,
  });

  const [audioContext, setAudioContext] = useState(null);
  const [instrument, setInstrument] = useState(null);

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
  
  return (
    <Piano
      noteRange={{ first: firstNote, last: lastNote }}
      playNote={(midiNumber) => {
        if (instrument) {
          instrument.play(midiNumber);
        }
      }}
      stopNote={(midiNumber) => {
          if (instrument) {
            instrument.stop(midiNumber);
          }
      }}
        width={700}
        keyboardShortcuts={keyboardShortcuts}
      />
    );
  }

  export default App;