import './App.scss'
import React from 'react'
import NavBar from './components/NavBar/NavBar'
import Home from './pages/Homepage'

function App() {
  return (
    <div className="app-container">
      <NavBar 
        li={[
          ["Home", "img/home.svg"],
          ["Household", "img/household.svg"],
          ["Technical", "img/technical.svg"],
          ["Financial", "img/financial.svg"]
        ]}
      />
      <div className="main-content">
        <Home width="1000px"/>
      </div>
    </div>
  );
}

export default App;
