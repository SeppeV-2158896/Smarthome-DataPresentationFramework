import './App.scss';
import React from 'react';
import NavBar from './components/NavBar/NavBar';
import Home from './pages/Homepage'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function App() {
  return (
    <div style={{display: 'flex'}}>
      <NavBar 
        li={[
          ["Home", "img/home.svg"],
          ["Household", "img/household.svg"],
          ["Technical", "img/technical.svg"],
          ["Financial", "img/financial.svg"]
        ]}
      />
      <Home />
    </div>
  );
}

export default App;
