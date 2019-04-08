import React from "react";
import "./DeleteBtn.css";
import "./FormBtn.css";

// This Delete Button component allows us to use a bootstrap styled delete button with less syntax
export function DeleteBtn(props) {
    return (
        <span className="delete-btn" {...props} role="button" tabIndex="0">
            ✗
    </span>
    );
}
// This Form Button component allows us to use a bootstrap styled submit button with less syntax
export function FormBtn(props) {
    return (
        <button className="btn btn-success form-btn" {...props}>
            {props.children}
        </button>
    );
}
// This Logout Button component allows us to use a bootstrap styled logout button with less syntax
export function LogoutBtn(props) {
    return (
        <button className="btn btn-info btn-sm" {...props}>
            {props.children}
        </button>
    );
}