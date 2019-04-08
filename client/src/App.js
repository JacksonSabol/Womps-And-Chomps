import React from 'react';
import { Router, Route } from 'react-router-dom';
import history from './history/history';
import Home from './pages/Home';
import UserSignup from './pages/UserSignup';
import UserLogin from './pages/UserLogin';
import Test from './pages/test';
import './index.css';

function App() {
  return (
    <Router history={history}>
      <div>
        <Route exact path="/" component={Home} />
        <Route exact path="/user/signup" component={UserSignup} />
        <Route exact path="/user/signin" component={UserLogin} />
        <Route exact path="/user/profile/:username" component={Test} />
      </div>
    </Router>
  );
}

export default App;