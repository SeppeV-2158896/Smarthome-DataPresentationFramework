import React from 'react';
import DataRepository from '../DataRepository'
import Chart, {
  Series,
  ValueErrorBar,
  Title,
  TickInterval,
  ArgumentAxis
} from 'devextreme-react/chart';
import ChartComponent from './ChartComponent';

class BarPlot extends ChartComponent {
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

    this.chartRef = React.createRef()
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
    return
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

  getSeries = () => {
    return {
        sets: this.state.sets,
        colours: this.state.options.colors
    }
  }

  toggleSeries = (name) => {
    const series = this.chartRef.getSeriesByName(name);
    if (series.isVisible()) {
        series.hide();
    } else {
        series.show();
    }
  }

  render() {
    console.log(this.state.options)
    return (
      <div className="chart-wrapper" style={{ height: '100%' }}>
        <Chart id="chart" dataSource={this.state.options.data} ref={this.chartRef}>
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

export default BarPlot;
