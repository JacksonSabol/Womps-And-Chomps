import React from "react";
import "./index.css";

// This Auth Input component allows us to use a styled text input with less syntax
export function AuthInput(props) {
    return (
        <div>
            <input className="auth-input" {...props} />
        </div>
    );
}
// This Text Area component allows us to use a styled text-area with less syntax
export function TextArea(props) {
    return (
        <div>
            <textarea className="" rows="20" {...props} />
        </div>
    );
}