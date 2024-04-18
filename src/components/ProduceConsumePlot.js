import React, {Component} from 'react';
import Chart from 'react-apexcharts';

class ProduceConsumePlot extends Component{

    constructor(props) {
        super(props);

        this.state = {
            series: [],
            props: props,
            options: {
                zoom: {
                  mode: 'xy',
                  autoScaleYaxis: true
                },
                stroke: {
                  curve: 'smooth',
                  width: [0,0,2,0,2]
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
                }
              },
            }

            this.updateData=this.updateData.bind(this);

    }

    componentDidMount(){
    }

    updateData(input){
      let all_data = []
      let colours = []

      this.state.props.sets.forEach((set) => {
     
        if (set.uncertainty && JSON.parse(set.uncertainty)) {
          const uncertainties = JSON.parse(set.uncertainty);
        
          uncertainties.forEach((uncertainty) => {
            if (uncertainty.title && uncertainty.value) {
              let series = {
                type: 'rangeArea',
                name: set.title? `${set.title}-uncertainty` : `series-${all_data.length + 1}-uncertainty`,
                data: [],
              };
  
        
              input.forEach((element) => {
                series.data.push({
                  x: element[String(set.x)],
                  y: [
                    element[String(set.y)] - (parseFloat(uncertainty.value) * element[String(set.y)]),
                    element[String(set.y)] + (parseFloat(uncertainty.value) * element[String(set.y)])
                  ]
                });
              });
  
              // console.log(series)
              all_data.push(series)
              colours.push(uncertainty.colour)
  
  
            }
  
            if (uncertainty.title_up && uncertainty.title_down){
              let series = {
                type: 'rangeArea',
                name: set.title? `${set.title}-uncertainty` : `series-${all_data.length + 1}-uncertainty`,
                data: [],
              };
  
        
              input.forEach((element) => {
                series.data.push({
                  x: element[String(set.x)],
                  y: [element[String(uncertainty.title_down)], element[uncertainty.title_up]]
                });
              });
  
              // console.log(series)
              all_data.push(series)
              colours.push(uncertainty.colour)
  
            }
  
          });
        }
  
        let series = {
          type: 'line',
          name: set.title || `series-${all_data.length + 1}`,
          data: input.map(element => ({
            x: element[String(set.x)],
            y: element[String(set.y)],
          })),
        };
  
        all_data.push(series)
        colours.push(set.colour)
    });
      
      this.setState({
        series: all_data,
        options: {
          colors: colours,
          stroke: {
            fill: {
              colors: colours,
            }
          }
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
                  type= 'rangeArea'
                />
              </div>
            </div>
          </div>
        );
      }

}

export default ProduceConsumePlot