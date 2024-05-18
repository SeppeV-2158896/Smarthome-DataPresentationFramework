import React, { Component } from 'react';
import DataRepository from '../DataRepository'
import Chart, {
  Series,
  ValueErrorBar
} from 'devextreme-react/chart';

class EnergyBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      props: props,
      options: {
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
            name="My oranges"
            type="bar"
            color="#ffaa66" >
                    <ValueErrorBar
                        highValueField="upper"
                        lowValueField="lower"
                        type="fixed"
                    />
          </Series>
        </Chart>
      </div>
    ) 
  }
}

export default EnergyBar;
