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
      let widths = []

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
                  y: set.consumption ? [
                    -1 * (element[String(set.y)] - (parseFloat(uncertainty.value) * element[String(set.y)])),
                    -1 * (element[String(set.y)] + (parseFloat(uncertainty.value) * element[String(set.y)]))
                  ] : [
                    element[String(set.y)] - (parseFloat(uncertainty.value) * element[String(set.y)]),
                    element[String(set.y)] + (parseFloat(uncertainty.value) * element[String(set.y)])
                  ]
                });
              });
  
              all_data.push(series);
              colours.push(uncertainty.colour ? uncertainty.colour : `rgba(${Math.random()*255}, ${Math.random()*255}. ${Math.random()*255}, 0.7`);
              widths.push(0);
  
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
                  y: set.consumption ? [-1 *element[String(uncertainty.title_down)], -1 * element[uncertainty.title_up]] : [element[String(uncertainty.title_down)], element[String(uncertainty.title_up)]]
                });
              });
  
              // console.log(series)
              all_data.push(series);
              colours.push(uncertainty.colour ? uncertainty.colour : `rgba(${Math.random()*255}, ${Math.random()*255}. ${Math.random()*255}, 0.7`);
              widths.push(0);
  
            }
  
          });
        };
  
        let series = {
          type: 'area',
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
                  type= 'rangeArea'
                />
              </div>
            </div>
          </div>
        );
      }

}

export default ProduceConsumePlot