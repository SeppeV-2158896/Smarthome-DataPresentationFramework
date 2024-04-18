import React, { Component } from 'react';
import * as ReactDOM from 'react-dom/client';
import Chart from 'react-apexcharts';

class EnergyBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
          props: props,
          series: [],
          options: {
            chart: {
              type: 'bar',
              height: 350,
              stacked: true,
              toolbar: {
                show: true
              },
              zoom: {
                enabled: true,
                autoScaleYaxis: true
              }
            },
            responsive: [{
              breakpoint: 480,
              options: {
                legend: {
                  position: 'bottom',
                  offsetX: -10,
                  offsetY: 0
                }
              }
            }],
            plotOptions: {
              bar: {
                horizontal: false,
                borderRadius: 10,
              },
            },
            xaxis: {
              type: 'datetime',
              categories: [],
              range: 1000*60*60
            },
            yaxis: {
                forceNiceScale: true,
                decimalsInFloat: 1,
            },
            legend: {
              position: 'right',
              offsetY: 40,
            },
            fill: {
              opacity: 1
            },
            dataLabels: {
                enabled: false,
            },
          },
        
        
        };

        this.updateData = this.updateData.bind(this);
      }

    

    render() {
        return (
          <div>
            <div id="chart">
            </div>
            <div id="html-dist"></div>
          </div>
        );
      }


    componentDidMount() {
    }

    updateData(input) {
        console.log(input)
        let uncertain_down = [];
        let uncertain_up = [];
        let data = [];
        let allData = [];
        let colours = [];
        let labels = input.map((element) => element[this.state.props.sets[0].x].toString());

        this.state.props.sets.forEach((set) => {

            if (set.uncertainty && JSON.parse(set.uncertainty)) {
                const uncertainties = JSON.parse(set.uncertainty);
            
                uncertainties.forEach((uncertainty) => {
                  if (uncertainty.title && uncertainty.value) {
                      let series_up = {
                          name: set.title? `${set.title}-uncertainty-up` : `series-${uncertain_down.length + 1}-uncertainty-up`,
                          data: [],
                          color: uncertainty.colour ? uncertainty.colour : `rgba(${Math.floor(Math.random()*75 + 180)}, ${Math.floor(Math.random()*75 + 180)}, ${Math.floor(Math.random()*75 + 180)}, 0.7)`

                        };
                      let series_down = {
                          name: set.title? `${set.title}-uncertainty-down` : `series-${uncertain_down.length + 1}-uncertainty-down`,
                          data: [],
                          color: uncertainty.colour ? uncertainty.colour : `rgba(${Math.floor(Math.random()*75 + 180)}, ${Math.floor(Math.random()*75 + 180)}, ${Math.floor(Math.random()*75 + 180)}, 0.7)`
                        };
        
            
                    input.forEach((element) => {
                      series_up.data.push(
                            element[String(set.y)] + (parseFloat(uncertainty.value) * element[String(set.y)])
                      );
    
                      series_down.data.push(
                            element[String(set.y)] - (parseFloat(uncertainty.value) * element[String(set.y)])
                        );
                    });
        
                    uncertain_up.unshift(series_up);
                    uncertain_down.push(series_down);
                    
        
                  }
        
                  if (uncertainty.title_up && uncertainty.title_down){
                      let series_up = {
                          name: set.title? `${set.title}-uncertainty-up` : `series-${uncertain_down.length + 1}-uncertainty-up`,
                          data: [],
                          color: uncertainty.colour ? uncertainty.colour : `rgba(${Math.floor(Math.random()*75 + 180)}, ${Math.floor(Math.random()*75 + 180)}, ${Math.floor(Math.random()*75 + 180)}, 0.7)`
                          };
                      let series_down = {
                          name: set.title? `${set.title}-uncertainty-down` : `series-${uncertain_down.length + 1}-uncertainty-down`,
                          data: [],
                          color: uncertainty.colour ? uncertainty.colour : `rgba(${Math.floor(Math.random()*75 + 180)}, ${Math.floor(Math.random()*75 + 180)}, ${Math.floor(Math.random()*75 + 180)}, 0.7)`
                          };
        
            
                      input.forEach((element) => {
                          series_up.data.push(element[String(uncertainty.title_up)]
                          );
    
                          series_down.data.push(element[String(uncertainty.title_down)]
                          );
                      });
        
                      uncertain_up.unshift(series_up);
                      uncertain_down.push(series_down);
        
                  }
        
                });
              };

        let series = {
            name: set.title || `series-${allData.length + 1}`,
            data: input.map(element => (element[String(set.y)])),
            color: set.colour ? set.colour : `rgba(${Math.floor(Math.random()*75 + 180)}, ${Math.floor(Math.random()*75 + 180)}, ${Math.floor(Math.random()*75 + 180)}, 0.7)`
        };

        data.push(series);
        });

        uncertain_down.forEach((set) => allData.push(set))
        data.forEach((set) => allData.push(set))
        uncertain_up.forEach((set) => allData.push(set))

        this.state.series = allData;
        this.state.options.xaxis.categories = labels;

        const absDifference = (arr1, arr2) => {
            const res = [];
            for(let i = 0; i < arr1.length; i++){
               const el = arr1[i] - arr2[i];
               res[i] = el;
            };
            return res;
        };

        console.log(allData)
        for (let i = 0; i < allData.length; i++){
            for (let j = 0 ; j < i; j++){
                allData[i].data = absDifference(allData[i].data, allData[j].data)
                console.log([allData[i].data[0],i,j])
            }
        }

        console.log(allData)

        
        if (allData[0].data.length > 0 && labels.length === allData[0].data.length){
            const root = ReactDOM.createRoot(
                document.getElementById('chart')
            );
            const element = <Chart options={this.state.options} series={this.state.series} type="bar"/>
            root.render(element);
        }
    }

}

export default EnergyBar;
