import React, {Component} from 'react';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import DataRepository from '../DataRepository';

class ProduceConsumePlotLines extends Component{

    constructor(props) {
        super(props);

        this.state = {
            series: [],
            props: props,
            serieNames: [],
            options: {
              chart: {
                id: 'chart',
                type: 'line',
              },
                zoom: {
                    type: 'x',
                    enabled: true,
                    autoScaleYaxis: true
                },
                stroke: {
                  curve: 'smooth',
                  width: []
                },
                title: {
                  enabled: props.enable_title ? false : true,
                  text: props.title ? props.title : 'Energy Production vs. Consumption',
                  align: 'left'
                },
                xaxis: {
                  type: 'datetime',
                },
                
                yaxis: {
                  decimalsInFloat: 0
                },
                noData: {
                  text: 'Loading...'
                },
                dataLabels: {
                    enabled: false
                },
                legend: {
                    show: false
                },
                tooltip: {
                    enabled: false,
                }
              },
            }

            this.updateData=this.updateData.bind(this);
            this.getSeriesNames=this.getSeriesNames.bind(this);
            this.toggleSeriesByName = this.toggleSeriesByName.bind(this);

    }

    componentDidMount(){
    }

    getSeriesNames(){
      return this.state.serieNames
    }

    toggleSeriesByName(name) {
      ApexCharts.exec('energy-production-vs-consumption', 'toggleSeries', name)
      console.log("Doen")
    }

    updateData(input){
      let all_data = []
      let colours = []
      let widths = []

      this.state.props.sets.forEach((set) => {
        let uncertainties = DataRepository.getLineSeriesFromUncertainty(input, set)
        let dataseries = DataRepository.getSeriesFromData(input, set)

        console.log(dataseries)

        if (uncertainties.dataset.length > 0){
          uncertainties.dataset.forEach((series) => all_data.push(series))
          uncertainties.colours.forEach((colour) => colours.push(colour))
          uncertainties.widths.forEach((width) => widths.push(width))
        }

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
          <div className="app">
            <div className="row">
              <div className="mixed-chart">
                <Chart
                  options={this.state.options}
                  series={this.state.series}
                  type= 'line'
                />
              </div>
            </div>
          </div>
        );
      }

}

export default ProduceConsumePlotLines