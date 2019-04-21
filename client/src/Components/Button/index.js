import React from "react";
import "./index.css";

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
// This Authentication Button component allows us to use a consistently styled button for all authentication processes with less syntax
export function AuthBtn(props) {
    return (
        <button className="auth-btn" {...props}>
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