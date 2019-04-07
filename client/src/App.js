import React from "react";
import { Router, Route } from "react-router-dom";
import history from "./history/history";
import Test from "./pages/test";
import "./index.css";

function App() {
  return (
    <Router history={history}>
      <div>
        <Route exact path="/" component={Test} />
      </div>
    </Router>
  );
}

export default App;