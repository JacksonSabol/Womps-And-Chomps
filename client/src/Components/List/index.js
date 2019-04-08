import React from "react";
import "./List.css";

// This List component allows us to use an unordered list with less syntax
export function List({ children }) {
    return (
        <div className="list-overflow-container">
            <ul className="list-group">{children}</ul>
        </div>
    );
}
// This List Item component allows us to use a list item with less syntax
export function ListItem({ children }) {
    return <li className="list-group-item">{children}</li>;
}
