import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';
import DataRepository from '../DataRepository';
import ApexCharts from 'apexcharts';

class TotalPlot extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [],
      sets: [],
      options: {
        chart: {
          type: 'area',
          id: 'chart',
          height: 350,
          stacked: true,
          events: {
            selection: function (chart, e) {
              console.log(new Date(e.xaxis.min));
            }
          },
        },
        title: {
          enabled: props.enable_title ? false : true,
          text: props.title ? props.title : 'Energy Production vs. Consumption',
          align: 'left'
        },
        colors: [],
        dataLabels: {
          enabled: false
        },
        legend: {
          show: false,
        },
        stroke: {
          curve: 'monotoneCubic'
        },
        fill: {
          type: 'solid',
          
        },
        xaxis: {
          type: 'datetime'
        },
        yaxis: {
          forceNiceScale: true,
          decimalsInFloat: 1
        }
      },
    };
  }

  getSeries = () => {
    return {
      sets: this.state.sets,
      colours: this.state.options.colors
    }
  }

  toggleSeries = (name) => {
    ApexCharts.exec('chart', 'toggleSeries', name)
  }

  updateData = (input) => {
    let all_data = [];
    let colours = [];
    let widths = [];

    this.props.sets.forEach((set) => {
      let uncertainties = DataRepository.getLineSeriesFromUncertainty(input, set);
      let dataseries = DataRepository.getSeriesFromData(input, set);

      if (dataseries.dataset.data.length > 0) {
        all_data.push(dataseries.dataset);
        colours.push(dataseries.colours);
        widths.push(dataseries.widths);
        this.state.sets.push(dataseries.sets)
      }
    });

    this.setState((prevState) => ({
      series: all_data,
      options: {
        ...prevState.options,
        colors: colours,
        stroke: {
          ...prevState.options.stroke,
          width: widths
        }
      }
    }));
  }

  render() {
    return (
      <div>
        <div id="chart">
          <ReactApexChart options={this.state.options} series={this.state.series} type="area" height={350} />
        </div>
        <div id="html-dist"></div>
      </div>
    );
  }
}

export default TotalPlot;
