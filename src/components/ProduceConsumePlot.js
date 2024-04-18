import React, {Component} from 'react';
import Chart from 'react-apexcharts';

class ProduceConsumePlot extends Component{

    constructor(props) {
        super(props);

        this.state = {
            series: [],
            options: {
                chart: {
                  type: 'rangeArea',
                  animations: {
                    speed: 500
                  }
                },
                zoom: {
                  type: 'xy',
                  enabled: true,
                  autoScaleYaxis: true
                },
                colors: colors,
                stroke: {
                  curve: 'smooth',
                  colors: colors,
                  width: [0,0,2,0,2]
                },
                dataLabels: {
                  enabled: false,
                },
                legend: {
                  show: false,
                  inverseOrder: true
                },
                title: {
                  text: 'Range Area with Forecast Line (Combo)'
                },
                xaxis: {
                  type: 'datetime',
                  range: 1000 * 3600,
                },
                yaxis: {
                  decimalsInFloat: 0
                }
              },
            }

    }

    render() {
        return (
          <div className="app">
            <div className="row">
              <div className="mixed-chart">
                <Chart
                  options={this.state.options}
                  series={this.state.series}
                  type="area"
                  width="500"
                />
              </div>
            </div>
          </div>
        );
      }

}