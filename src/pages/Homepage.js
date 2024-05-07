import React, { Component } from "react";
import Papa from 'papaparse';
import { parse } from 'date-fns';
import ProduceConsumePlot from "../components/TODO/ProduceConsumePlot";
import ProduceConsumePlotLines from "../components/TODO/ProduceConsumePlotLines"
import EnergyTimePlot from "../components/TODO/EnergyTimePlot"
import DotPlot from "../components/TODO/DotPlot";
import EnergyBar from "../components/TODO/EnergyBar";
import Chart from 'react-apexcharts';
import ApexCharts from "apexcharts";
import ChartBox from "../components/ChartBox"

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            currentDate: null,
        };
        this.loadData = this.loadData.bind(this);
        this.loadNextData = this.loadNextData.bind(this);
        this.loadPreviousData = this.loadPreviousData.bind(this);
        this.chartRef = React.createRef();
        this.checkBox = React.createRef();

    }

    componentDidMount() {
        this.loadData();

        let inputs = document.querySelectorAll('.check');
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].checked = true;
        }
    }

    loadData() {
        let dataset = [];
        let loaded = false;
        console.log("start")
        Papa.parse('./power.csv', {
            download: true,
            header: true,
            dynamicTyping: true,
            delimiter: ',',
            preview: 44640,
            step: (result) => {
                let item = result.data;
                const formattedData = {
                    time: parse(`${item['date_time']}`, "yyyy-MM-dd HH:mm:ssxxxxx", new Date()),
                    power: item['electric heating element'],
                    power_2: item['fridge'],
                    '66p_up': item['fridge'] + item['fridge'] * Math.random() * 0.1,
                    '66p_down': item['fridge'] - item['fridge'] * Math.random() * 0.1
                };

                dataset.push(formattedData);

                if (dataset.length > 1440 && !loaded){
                    loaded = true;
                    console.log(dataset)
                    this.chartRef.current.updateData(dataset.filter((data) => data.time.getDate() === dataset[0].time.getDate()));
                    this.setState({ 
                        data: dataset,
                        currentDate : dataset[0].time
                     });
                }
                
                if (dataset.length % 1000 === 0 ){
                    console.log("read")
                }
                
                }
            });
            // complete: (results, file) => {
            //     results.data.forEach((item) => {
            //         const formattedData = {
            //             time: parse(`${item['Date']} ${item['Time']}`, "d/M/yyyy HH:mm:ss", new Date()),
            //             power: item['Global_active_power'],
            //             power_2: item['Sub_metering_2'],
            //             '66p_up': item['Sub_metering_2'] + item['Sub_metering_2'] * Math.random() * 0.5,
            //             '66p_down': item['Sub_metering_2'] - item['Sub_metering_2'] * Math.random() * 0.5
            //         };
            //         dataset.push(formattedData);
            //     });
            //     
            // }

            // this.chartRef.current.updateData(dataset)
            this.render()
    }

    loadNextData(){
        console.log(this.state.data.map((item) => item['time']))
        console.log(this.state.currentDate)
        this.setState({ 
            currentDate : new Date(this.state.currentDate.setDate(this.state.currentDate.getDate() + 1))
        });
        console.log(this.state.currentDate)
        console.log((this.state.data.filter((data) => data.time === this.state.currentDate)).length)

        this.chartRef.current.updateData(this.state.data.filter((data) => data.time.toDateString() === this.state.currentDate.toDateString()));
        console.log("done")
    }

    loadPreviousData(){
        console.log(this.state.data.map((item) => item['time']))
        console.log(this.state.currentDate)
        this.setState({ 
            currentDate : new Date(this.state.currentDate.setDate(this.state.currentDate.getDate() - 1))
        });
        console.log(this.state.currentDate)

        this.chartRef.current.updateData(this.state.data.filter((data) => data.time.toDateString() === this.state.currentDate.toDateString()));
        console.log("done")
    }

    getSeriesNamesFromChartRef = () => {

        if (this.chartRef && this.chartRef.current) {
          return this.chartRef.current.getSeriesNames();
        }
        return [];      
    }

    toggleSeries = (index) => {
        console.log(index)
        ApexCharts.exec("chart", "toggleSeries", this.getSeriesNamesFromChartRef()[index])
    }

    render() {
        // const seriesNames = this.getSeriesNamesFromChartRef();
        return (
            <div id='canvas'>
                <ChartBox style={{ width: 1500}} ref={this.chartRef} data={this.state.data} sets={[
                    {
                        x: 'time',
                        y: 'power',
                        title: 'Power Consumption over Time',
                        colour: 'rgba(0,0,255,1)',
                        background: 'rgba(0,0,255,0.2)',
                        legend_pos: 'top',
                        consumption: false,
                        radius: 2,
                        uncertainty: '[{"value": "0.2", "title": "99p", "colour": "rgba(65,105,225, 0.3)"}, {"value": "0.1", "title": "66p", "colour": "rgba(65,105,225, 0.7)"}]'
                    // },
                    // {
                    //     x: 'time',
                    //     y: 'power_2',
                    //     title: 'Power Consumption over Time',
                    //     colour: 'rgba(95,158,160,1)',
                    //     legend_pos: 'top',
                    //     consumption: true,
                    //     uncertainty: '[{"title_up": "66p_up", "title_down": "66p_down", "colour": "rgba(95,158,160, 0.7)"}]'
                    }
                ]}/>
                {/* <ul style={{width: 1300}}>
                    {seriesNames.map((name, index) => (
                    <li key={index}>
                        <input defaultChecked type="checkbox" id={`series-${name}`} name="series" onClick={() => this.toggleSeries(index)}/>
                        <label htmlFor={` series-${name}`}> {name}</label>
                    </li>
                    ))}
                </ul> */}
                <button type="button" onClick={this.loadPreviousData} style={{ width: 100}}>Previous Period</button>
                <button type="button" onClick={this.loadNextData} style={{ width: 100}}>Next Period</button>
            </div>
        );
    }
}

export default Home;
