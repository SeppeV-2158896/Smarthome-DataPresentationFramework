import React, {Component} from 'react';
import ReactApexChart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import DataRepository from '../DataRepository';

class TotalPlot extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        props: props,
        series: [],
        options: {
          chart: {
            type: 'area',
            height: 350,
            stacked: true,
            events: {
              selection: function (chart, e) {
                console.log(new Date(e.xaxis.min))
              }
            },
          },
          colors: [],
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'monotoneCubic'
          },
          fill: {
            type: 'gradient',
            gradient: {
              opacityFrom: 0.6,
              opacityTo: 0.8,
            }
          },
          legend: {
            position: 'top',
            horizontalAlign: 'left'
          },
          xaxis: {
            type: 'datetime'
          },
        },
      
      
      };
    }

    updateData(input){
        let all_data = []
        let colours = []
        let widths = []
  
        this.state.props.sets.forEach((set) => {
          let uncertainties = DataRepository.getLineSeriesFromUncertainty(input, set)
          let dataseries = DataRepository.getSeriesFromData(input, set)
  
          console.log(dataseries)
  
        //   if (uncertainties.dataset.length > 0){
        //     uncertainties.dataset.forEach((series) => all_data.push(series))
        //     uncertainties.colours.forEach((colour) => colours.push(colour))
        //     uncertainties.widths.forEach((width) => widths.push(width))
        //   }
  
          if (dataseries.dataset.data.length > 0){
            all_data.push(dataseries.dataset)
            colours.push(dataseries.colours)
            widths.push(dataseries.widths)
          }
          
        })
            
        this.setState({
          series: all_data,
          options: {
            colors: colours,
            stroke: {
              width: widths
            } 
          }
        })
  
        this.render()
        
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

  export default TotalPlot