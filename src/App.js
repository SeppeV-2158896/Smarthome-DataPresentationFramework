import './App.scss'
import React, { Component } from 'react'
import NavBar from './components/NavBar/NavBar'
import Home from './pages/Homepage'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 'Home'
    };
  }

  handleMenuItemClick = (page) => {
    this.setState({ currentPage: page });
  };

  renderPage = () => {
    switch (this.state.currentPage) {
      case 'Home':
        return <Home id='home' width="1000px" />;
      case 'Household':
        return (<div>Yoo</div>);
      case 'Technical':
        // return <Technical />;
      case 'Financial':
        // return <Financial />;
      default:
        return <Home id='home' width="1000px" />;
    }
  };

  render() {
    return (
      <div id='main' className="app-container">
        <NavBar
          li={[
            ["Home", "img/home.svg"],
            ["Household", "img/household.svg"],
            ["Technical", "img/technical.svg"],
            ["Financial", "img/financial.svg"]
          ]}
          onItemClick={this.handleMenuItemClick}
        />
        <section id='main-content' className="main-content">
          {this.renderPage()}
        </section>
      </div>
    );
  }
}

export default App;
