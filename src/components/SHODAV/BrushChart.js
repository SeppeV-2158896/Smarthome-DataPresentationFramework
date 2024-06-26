import React from 'react';
import ReactApexChart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import DataRepository from '../DataRepository';
import ChartComponent from './ChartComponent';

class BrushChart extends ChartComponent {
    constructor(props) {
        super(props);

        this.state = {
            series: [],
            sets: props.sets,
            brushOptions: {
                series: [],
                chart: {
                    id: 'chart1',
                    type: 'area',
                    brush:{
                        target: 'chart2',
                        enabled: true
                    },
                    selection: {
                        enabled: true,
                    },
                },
                legend : {
                    show: false
                },
                stroke: {
                    width: [],
                    curve: 'smooth'
                },
                xaxis: {
                    type: 'datetime',
                    tooltip: {
                        enabled: false
                    }
                },
                yaxis: {
                    forceNiceScale: true,
                    decimalsInFloat: 0,
                }
            },
            chartOptions: {
                series: [],
                chart: {
                    id: 'chart2',
                    type: 'rangeArea',
                    toolbar: {
                        autoSelected: 'pan',
                        show: false
                    }
                },
                title: {
                    enabled: props.enable_title ? false : true,
                    text: props.title ? props.title : 'Energy Production vs. Consumption',
                    align: 'left'
                  },
                colors: [],
                stroke: {
                    width: [],
                    curve: 'smooth',
                },
                legend : {
                    show: false
                },
                dataLabels: {
                    enabled: false
                },
                markers: {
                    size: 0
                },
                yaxis: {
                    seriesName: 'Power',
                    forceNiceScale: true,
                    decimalsInFloat: 0,
                    axisTicks: {
                        show: true,
                    },
                    axisBorder: {
                        show: true,
                    },
                    title: {
                        text: "Power",
                    },
                },
                xaxis: {
                    type: 'datetime'
                }
            }

        }

        this.updateData=this.updateData.bind(this);
        this.toggleSeriesByName = this.toggleSeriesByName.bind(this);

    }

    componentDidMount(){
        return
    }

    getSeries = () => {
        return {
            sets: this.state.sets,
            colours: this.state.options.colors
        }
    }

    toggleSeries = (name) => {
        ApexCharts.exec('chart2', 'toggleSeries', name)
        ApexCharts.exec('chart1', 'toggleSeries', name)
    }

    updateData(input){
      let all_data = []
      let series_data = []
      let colours = []
      let series_colours = []
      let widths = []
      let series_widths = []

      this.state.sets.forEach((set) => {
        let uncertainties = DataRepository.getRangeSeriesFromUncertainty(input, set)
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
          series_data.push(dataseries.dataset)
          series_colours.push(dataseries.colours)
          series_widths.push(dataseries.widths)
        }
        
      })
      
      console.log()
      this.setState({
        chartOptions: {
            series: all_data,
            colors: colours,
            stroke: {
                width: widths
            },
        },
        brushOptions: {
            series: series_data,
            colors: series_colours,
            stroke: {
              width: series_widths
            },
            selection: {
                enabled: true,
                xaxis: {
                    min: new Date(all_data[0].data.at(-60).x).getTime(),
                    max: new Date(all_data[0].data.at(-1).x).getTime()
                }
            }
            
        }
      })

      this.render()
      
    }

    appendData = (series, data) => {
        let index = this.state.chartOptions.sets.indexOf(series)
  
        if (this.state.series[index]){
  
          this.state.brushOptions.series[index].data.push(data)
          this.state.chartOptions.series[index].data.push(data)
          
          this.render()
          window.dispatchEvent(new Event('resize'))
          
        }
    }

    render() {
        return (
          <div className="app" height="400px">
            <div className="row" height="100%">
              <div className="mixed-chart" height="100%">
                <div id="chart-line2">
                    <ReactApexChart options={this.state.chartOptions} series={this.state.chartOptions.series} type="rangeArea" height={230} />
                </div>
                <div id="chart-line">
                    <ReactApexChart options={this.state.brushOptions} series={this.state.brushOptions.series} type="line" height={130}/>
                </div>
              </div>
            </div>
          </div>
        );
    }
    

}

export default BrushChart
