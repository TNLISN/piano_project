import React from 'react';

function InstrumentSelector({ instrumentName, handleInstrumentChange }) {
  return (
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
  );
}

export default InstrumentSelector;
