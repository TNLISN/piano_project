import React from "react";

function SuccessMessage({ message }) {
  return (
    <div>
      {message && (
        <p style={{ color: "green" }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default SuccessMessage;
