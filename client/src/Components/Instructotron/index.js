import React from "react";
import './index.css';

// This Instructotron component allows us to use a custom bootstrap-style Jumbotron with less syntax
export function Instructotron(props) {
  return (
    <div className="instructotron" style={{ height: props.height}}>
      {props.children}
    </div>
  );
}