import React from 'react';
import { Router, Route } from 'react-router-dom';
import history from './history/history';
import Splash from './pages/Splash';
import UserSignup from './pages/UserSignup';
import UserLogin from './pages/UserLogin';
import Main from './pages/Main';
import AdminMain from './pages/AdminMain';
import './index.css';

function App() {
  return (
    <Router history={history}>
      <div>
        <Route exact path="/" component={Splash} />
        <Route exact path="/user/signup" component={UserSignup} />
        <Route exact path="/user/signin" component={UserLogin} />
        <Route exact path="/user/profile/:username" component={Main} />
        <Route exact path="/wc-admin/profile/:username" component={AdminMain} />
      </div>
    </Router>
  );
}

export default App;