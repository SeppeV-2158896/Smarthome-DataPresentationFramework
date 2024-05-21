import React, {Component, createRef} from 'react';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import DataRepository from '../DataRepository';
import ReactApexChart from 'react-apexcharts';

class ProduceConsumePlot extends Component{

    constructor(props) {
        super(props);

        this.chartRef = React.createRef()

        this.state = {
            series: [],
            props: props,
            sets: [],
            options: {
                zoom: {
                  mode: 'xy',
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
                legend: {
                  show: false
                },
                yaxis: {
                  decimalsInFloat: 2,
                  forceNiceScale: true
                },
                noData: {
                  text: 'Loading...'
                },
                dataLabels: {
                    enabled: false
                },
                chart: {
                  id: 'chart',
                  
                }
              },
            }

            this.updateData=this.updateData.bind(this);
            this.appendData=this.appendData.bind(this)

    }

    componentDidMount(){
      this.setState({
        options: {
          chart: {
            animations: {
              enabled: true,
              easing: "linear",
              dynamicAnimation: {
                speed: 2000
              },
            },
          }
        }
      })
    }

    // Function to append data to the series
    appendData(series, data) {
      let index = this.state.sets.indexOf(series)
      // console.log(this.state.series.length > 0 && this.state.series[this.state.sets.indexOf(series)])
      if (this.state.series[index]){
        // console.log(this.state.sets)
        this.state.series[index].data.push(data)
        
        // ApexCharts.exec('chart', 'updateSeries', [this.state.series, true])

        let name = this.state.series[index].name
        this.render()
        window.dispatchEvent(new Event('resize'))
        // ApexCharts.exec('chart','toggleSeries',name)
        // ApexCharts.exec('chart','toggleSeries',name)

      }
      
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
        
        let uncertainties = DataRepository.getRangeSeriesFromUncertainty(input, set)

        if (uncertainties.colours.length > 0){
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
                <ReactApexChart
                  options={this.state.options}
                  series={this.state.series}
                  ref={this.chartRef}
                  type= 'rangeArea'
                />
              </div>
            </div>
          </div>
        );
      }

}

export default ProduceConsumePlot