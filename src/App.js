import React from 'react';
import logo from './logo.svg';
import { Router, Route, Switch } from 'react-router-dom'
import './App.css';
import Home from './Screens/Home';
import Meeting from './Screens/Meeting';
import history from './history';

function App() {
  return (

    <div style={{ background: "#F5F7FB", width: '100vw', minHeight: "100vh" }}>
      <Switch>
        <Route path="/" exact><Home /></Route>
        <Route path="/meeting" ><Meeting /></Route>
      </Switch>
    </div>

  );
}

export default App;
