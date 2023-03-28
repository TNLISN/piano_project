import React from 'react';

function DifficultyButtons({ handleDifficultyClick }) {
  return (
    <div>
      <button onClick={() => handleDifficultyClick("easy")}>Easy</button>
      <button onClick={() => handleDifficultyClick("medium")}>Medium</button>
      <button onClick={() => handleDifficultyClick("hard")}>Hard</button>
      <button onClick={() => handleDifficultyClick("impossible")}>Impossible</button>
    </div>
  );
}

export default DifficultyButtons;
