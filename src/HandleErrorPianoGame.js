import React from "react";

function HandleErrorPianoGame({ errors }) {
  return (
    <div>
      {errors.map((error, index) => (
        <p key={index} style={{ color: "red" }}>
          {error}
        </p>
      ))}
    </div>
  );
}

export default HandleErrorPianoGame;
