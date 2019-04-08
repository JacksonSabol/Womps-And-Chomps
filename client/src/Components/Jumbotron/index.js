import React from "react";

// This Jumbotron component allows us to use a bootstrap Jumbotron with less syntax
export function Jumbotron({ children }) {
  return (
    <div
      style={{ height: 300, clear: "both", paddingTop: 120, textAlign: "center" }}
      className="jumbotron"
    >
      {children}
    </div>
  );
}