import React, { Component } from "react";
import Papa from 'papaparse';
import { parse } from 'date-fns';
import ProduceConsumePlot from "./TODO/ProduceConsumePlot";
import ProduceConsumePlotLines from "./TODO/ProduceConsumePlotLines"
import EnergyTimePlot from "./TODO/EnergyTimePlot"
import DotPlot from "./TODO/DotPlot";
import EnergyBar from "./TODO/EnergyBar";
import Chart from 'react-apexcharts';
import ApexCharts from "apexcharts";

class Home extends Component {
    constructor(props) {
        super(props);

        console.log(props)

        this.state = {
            data: null,
            currentDate: null,
            sets: props.sets,
        };

        this.updateData = this.updateData.bind(this);
        
        this.chartRef = React.createRef();
        this.checkBox = React.createRef();
    }

    componentDidMount() {
        this.updateData();

        let inputs = document.querySelectorAll('.check');
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].checked = true;
        }
    }

    updateData(input_data) {

        if (!input_data){
            return
        }

        this.chartRef.current.updateData(input_data);
        this.render()
    }

    getSeriesNamesFromChartRef = () => {

        if (this.chartRef.current) {
          return this.chartRef.current.getSeriesNames();
        }
        return [];      
    }

    toggleSeries = (index) => {
        console.log(index)
        this.state.chart_ids.forEach((chart) => ApexCharts.exec(chart, "toggleSeries", this.getSeriesNamesFromChartRef()[index])) 
    }

    render() {
        return (
            <div>
                <div style={{height: "100%", width: "75%", float: "left", display: "inline-block"}}>
                    <ProduceConsumePlot ref={this.chartRef} data={this.state.data} sets={this.state.sets}/>
                </div>
                <div style={{foat: "right", display: "inline-block"}}>
                    <div style={{height:"50%", width:"25%"}}>
                        Legend
                    </div>
                    <div style={{height:"50%", width:"25%"}}>
                        Tools
                    </div>
                </div>
            </div>
        )
    }
}

export default Home;
