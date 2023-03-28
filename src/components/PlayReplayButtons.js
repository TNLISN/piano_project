import React from 'react';

function PlayReplayButtons({ handlePlayClick, handleReplayClick }) {
  return (
    <div>
      <button onClick={handlePlayClick}>Play</button>
      <button onClick={handleReplayClick}>Replay</button>
    </div>
  );
}

export default PlayReplayButtons;
