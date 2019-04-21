import React from 'react';
import { Router, Route } from 'react-router-dom';
import history from './history/history';
import Background from "./components/Background";
import Splash from './pages/Splash';
// import Home from './pages/Home';
import UserSignup from './pages/UserSignup';
import UserLogin from './pages/UserLogin';
import Main from './pages/main';
import './index.css';

function App() {
  return (
    <Router history={history}>
      <div>
        <Background />
        <Route exact path="/" component={Splash} />
        <Route exact path="/user/signup" component={UserSignup} />
        <Route exact path="/user/signin" component={UserLogin} />
        <Route exact path="/user/profile/:username" component={Main} />
      </div>
    </Router>
  );
}

export default App;