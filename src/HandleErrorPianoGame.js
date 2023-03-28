import React from "react";

function HandleErrorPianoGame({ errorMessage }) {
  return (
    <div>
      {errorMessage && (
        <p style={{ color: "red" }}>
          {errorMessage}
        </p>
      )}
    </div>
  );
}


export default HandleErrorPianoGame;
