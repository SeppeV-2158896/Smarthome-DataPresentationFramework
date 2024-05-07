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
import BrushChart from "./TODO/BrushChart";
import TotalPlot from "./TODO/TotalPlot"

class Home extends Component {
    constructor(props) {
        super(props);

        console.log(props)

        this.state = {
            type: props.type,
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

        if (!input_data || this.chartRef.current === null){
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
        if (this.state.type){
            console.log(this.state.type)
            switch(this.state.type){
                case("ProduceConsumePlot"):
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
                case("ProduceConsumePlotLines"):
                    return (
                        <div>
                            <div style={{height: "100%", width: "75%", float: "left", display: "inline-block"}}>
                                <ProduceConsumePlotLines ref={this.chartRef} data={this.state.data} sets={this.state.sets}/>
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
                case("BrushChart"):
                    return (
                        <div height="400px">
                            <div style={{height: "100%", width: "75%", float: "left", display: "inline-block"}}>
                                <BrushChart ref={this.chartRef} data={this.state.data} sets={this.state.sets}/>
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
                case("TotalPlot"):
                    return (
                        <div height="400px">
                            <div style={{height: "100%", width: "75%", float: "left", display: "inline-block"}}>
                                <TotalPlot ref={this.chartRef} data={this.state.data} sets={this.state.sets}/>
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
                default :
                    return (
                        <div>Invalid graph type specified</div>
                    )
            }
        }
        return (
            <div>No graph type specified</div>
        )
    }
}

export default Home;
