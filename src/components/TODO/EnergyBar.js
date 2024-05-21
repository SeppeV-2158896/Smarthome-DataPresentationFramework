import React, { Component } from 'react';
import DataRepository from '../DataRepository'
import Chart, {
  Series,
  ValueErrorBar,
  Title,
  TickInterval,
  ArgumentAxis
} from 'devextreme-react/chart';

class EnergyBar extends Component {
  constructor(props) {
    super(props);

    console.log(props.title)

    this.state = {
      props: props,
      options: {
        legend: {
          visible: false,
        },
        data: [],
        series: [],
      },
    };

    this.updateData = this.updateData.bind(this);
  }

  updateData(newData) {
      
    let all_data = DataRepository.getBarSeriesFromData(newData, this.state.props.sets[0])
      
      this.setState({
        options: {
          data: all_data.data,
          series: [all_data.options],
          
        }
      })
      

      this.render()
  }

  componentDidMount() {
    
  }

  render() {
    console.log(this.state.options)
    return (
      <div className="chart-wrapper" style={{ height: '100%' }}>
        <Chart id="chart" dataSource={this.state.options.data}>
          <Series valueField="y"
            argumentField="x"
            type="bar"
            color="#ffaa66" >
              <ValueErrorBar
                  highValueField="upper"
                  lowValueField="lower"
              />
          </Series>
          <Title text={this.state.props.title ? this.state.props.title : 'Energy Production vs. Consumption'} />
          <ArgumentAxis>
            <TickInterval days={1} />
          </ArgumentAxis>
        </Chart>
      </div>
    ) 
  }
}

export default EnergyBar;
