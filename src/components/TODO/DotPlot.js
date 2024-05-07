import React, { Component } from 'react';
import Chart from 'react-apexcharts';

class DotPlot extends Component {
  constructor(props) {
    super(props);

    this.state = {
      props: props,
      datasets: [],
      colors: [],
    };
  }

  componentDidMount() {
  }

  updateData(input) {
    console.log(input)
    let allData = [];
    let colors = [];

    this.state.props.sets.forEach((set) => {
      let dots = [];

      input.forEach((element) => {
        console.log("iets")
        for (let i = 1; i <= Math.floor(element[set.y] / (set.radius ? set.radius : 1)); i++) {
          dots.push([element[String(set.x)], i*(set.radius ? set.radius : 1) - (set.radius ? set.radius : 1) / 2 ]);
          
        }
      });

      console.log(dots)

      allData.push({
        name: set.title || `series-${allData.length + 1}`,
        data: dots,
      });

      colors.push(set.colour || `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.7)`);
    });

    this.setState({ datasets: allData, colors: colors });

    this.render()
  }

  render() {
    const { datasets, colors } = this.state;

    const options = {
      chart: {
        type: 'scatter',
      },
      markers: {
        size: 20
      },
      colors: colors,
      xaxis: {
        type: 'datetime',
      },
      yaxis: {
        decimalsInFloat: 1,
      },
      legend: {
        show: false,
      },
      title: {
        text: 'Dot Plot',
      },
      tooltip: {
        enabled: false,
      },
    };

    return (
      <div className="app">
        <div className="row">
          <div className="mixed-chart">
            <Chart options={options} series={datasets} type="scatter" width="1000" />
          </div>
        </div>
      </div>
    );
  }
}

export default DotPlot;
