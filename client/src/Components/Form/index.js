import React from "react";

// This Input component allows us to use a bootstrap styled text input with less syntax
export function Input(props) {
    return (
        <div className="form-group">
            <input className="form-control" {...props} />
        </div>
    );
}
// This Text Area component allows us to use a bootstrap styled text-area with less syntax
export function TextArea(props) {
    return (
        <div className="form-group">
            <textarea className="form-control" rows="20" {...props} />
        </div>
    );
}