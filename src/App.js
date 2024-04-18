import './App.scss'
import React, {Component} from 'react'
import NavBar from './components/NavBar/NavBar'
import Home from './pages/Homepage'
import * as ReactDOM from 'react-dom/client'

class App extends Component {
  
  componentDidMount(){
    const rootElement = document.getElementById("main-content")
    const root = ReactDOM.createRoot(rootElement);

    root.render(<Home id='home' width="1000px"/>);
  }
 
  render(){
    return (
      <div id='main' className="app-container">
        <NavBar 
          li={[
            ["Home", "img/home.svg"],
            ["Household", "img/household.svg"],
            ["Technical", "img/technical.svg"],
            ["Financial", "img/financial.svg"]
          ]}
        />
        <section id='main-content' className="main-content" ></section>
      </div>
    );
  }
}

export default App;
