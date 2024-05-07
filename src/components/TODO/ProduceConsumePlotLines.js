import React, {Component} from 'react';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';

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
     
        if (set.uncertainty && JSON.parse(set.uncertainty)) {
          const uncertainties = JSON.parse(set.uncertainty);
        
          uncertainties.forEach((uncertainty) => {
            if (uncertainty.title && uncertainty.value) {
                let series_up = {
                    type: 'line',
                    name: set.title? `${set.title}-uncertainty-up-${uncertainty.title}` : `series-${all_data.length + 1}-uncertainty-up-${uncertainty.title}`,
                    data: [],
                  };
                let series_down = {
                    type: 'line',
                    name: set.title? `${set.title}-uncertainty-down-${uncertainty.title}` : `series-${all_data.length + 1}-uncertainty-down-${uncertainty.title}`,
                    data: [],
                  };
  
        
              input.forEach((element) => {
                series_up.data.push({
                  x: element[String(set.x)],
                  y: set.consumption ? 
                    -1 * (element[String(set.y)] + (parseFloat(uncertainty.value) * element[String(set.y)]))
                      : 
                    element[String(set.y)] + (parseFloat(uncertainty.value) * element[String(set.y)])
                  
                });

                series_down.data.push({
                    x: element[String(set.x)],
                    y: set.consumption ? 
                      -1 * (element[String(set.y)] - (parseFloat(uncertainty.value) * element[String(set.y)]))
                     : 
                      element[String(set.y)] - (parseFloat(uncertainty.value) * element[String(set.y)])
                    
                  });
              });
  
              all_data.push(series_up);
              all_data.push(series_down);
              colours.push(uncertainty.colour ? uncertainty.colour : `rgba(${Math.random()*255}, ${Math.random()*255}. ${Math.random()*255}, 0.7`);
              colours.push(uncertainty.colour ? uncertainty.colour : `rgba(${Math.random()*255}, ${Math.random()*255}. ${Math.random()*255}, 0.7`);
              widths.push(2);
              widths.push(2);
              this.state.serieNames.push(series_up.name);
              this.state.serieNames.push(series_down.name);
  
            }
  
            if (uncertainty.title_up && uncertainty.title_down){
                let series_up = {
                    type: 'line',
                    name: set.title? `${set.title}-uncertainty-up-${uncertainty.title}` : `series-${all_data.length + 1}-uncertainty-up-${uncertainty.title}`,
                    data: [],
                    };
                let series_down = {
                    type: 'line',
                    name: set.title? `${set.title}-uncertainty-down-${uncertainty.title}` : `series-${all_data.length + 1}-uncertainty-down-${uncertainty.title}`,
                    data: [],
                    };
  
        
                input.forEach((element) => {
                    series_up.data.push({
                        x: element[String(set.x)],
                        y: set.consumption ? -1 * element[uncertainty.title_up] : element[String(uncertainty.title_up)]
                    });

                    series_down.data.push({
                        x: element[String(set.x)],
                        y: set.consumption ? -1 *element[String(uncertainty.title_down)] : element[String(uncertainty.title_down)]
                    });
                });
  
                all_data.push(series_up);
                all_data.push(series_down);
                colours.push(uncertainty.colour ? uncertainty.colour : `rgba(${Math.random()*255}, ${Math.random()*255}. ${Math.random()*255}, 0.7`);
                colours.push(uncertainty.colour ? uncertainty.colour : `rgba(${Math.random()*255}, ${Math.random()*255}. ${Math.random()*255}, 0.7`);
                widths.push(2);
                widths.push(2);
                this.state.serieNames.push(series_up.name);
                this.state.serieNames.push(series_down.name);
  
            }
  
          });
        };
  
        let series = {
          type: 'line',
          name: set.title || `series-${all_data.length + 1}`,
          data: input.map(element => ({
            x: element[String(set.x)],
            y: set.consumption ? element[String(set.y)]*-1 : element[String(set.y)] ,
          })),
          color: set.background ? set.background : (set.consumption ? 'rgba(255,0,0,0.2)' : 'rgba(0,255,0,0.2)')
        };
  
        all_data.push(series);
        colours.push(set.colour ? set.colour : `rgba(${Math.random()*255}, ${Math.random()*255}. ${Math.random()*255}, 0.7`);
        widths.push(2);
        this.state.serieNames.push(series.name)
    });
      
      this.setState({
        series: all_data,
        options: {
          colors: colours,
        }
      });

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