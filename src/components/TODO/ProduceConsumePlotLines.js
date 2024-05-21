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
            sets: [],
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
                },
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
      let stops = []
      let types = []

      this.state.props.sets.forEach((set) => {
        if(set.x == null || set.y == null){
          input = []
        }

        let uncertainties = DataRepository.getLineSeriesFromUncertainty(input, set)

        if (uncertainties.sets.length > 0){
          uncertainties.dataset.forEach((series) => all_data.push(series))
          uncertainties.colours.forEach((colour) => colours.push(colour))
          uncertainties.widths.forEach((width) => widths.push(width))
          uncertainties.types.forEach((type) => types.push(type))
          uncertainties.sets.forEach((set) => this.state.sets.push(set))
        }

        let dataseries = DataRepository.getSeriesFromData(input, set, 0, null, uncertainties.dataset[-1])

        if ((dataseries.colours && dataseries.colours.length > 0) || (dataseries.stops && dataseries.stops.length > 0)){
          all_data.push(dataseries.dataset)
          colours.push(dataseries.colours)
          widths.push(dataseries.widths)
          stops = dataseries.stops
          types.push(dataseries.type)
          this.state.sets.push(dataseries.sets)
        }
        
      })
          
      this.setState({
        series: all_data,
        options: {
          colors: colours,
          fill:{
            type: types,
            gradient: {
              type: 'vertical',
              shadeIntensity: 1,
              opacityFrom: 1,
              opacityTo: 1,
              colorStops: stops
            },
          },
          stroke: {
            width: widths
          } 
        }
      })

      this.render()
      
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