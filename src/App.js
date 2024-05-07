import './App.scss'
import React, { Component, createRef } from 'react'
import NavBar from './components/NavBar/NavBar'
import Home from './pages/Homepage'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 'Home'
    };

    this.pageRef = React.createRef()
  }

  handleMenuItemClick = (page) => {
    this.state.currentPage = page;
    this.renderPage()
  };

  componentDidMount = () => {
    this.renderPage()
  }

  renderPage = () => {
    switch (String(this.state.currentPage)) {
      case 'Home':
        this.pageRef.current.update("ProduceConsumePlot")
        break;
      case 'Household':
        this.pageRef.current.update("ProduceConsumePlotLines")
        break;
      case 'Technical':
        this.pageRef.current.update("BrushChart")
        break;
      case 'Financial':
        this.pageRef.current.update("ProduceConsumePlot")
        break;
      default:
        return <Home width="1000px" />;
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
          <Home ref={this.pageRef}/>
        </section>
      </div>
    );
  }
}

export default App;
