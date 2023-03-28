import React from 'react';

function NoteRangeSelector({ handleNoteRangeChange }) {
  return (
    <select onChange={handleNoteRangeChange}>
      <option value="c3,f5">C3 - F5</option>
      <option value="c2,c5">C2 - C5</option>
      <option value="c3,c6">C3 - C6</option>
      <option value="c4,c7">C4 - C7</option>
    </select>
  );
}

export default NoteRangeSelector;
