import React, { Component } from "react";
import Papa from 'papaparse';
import { parse } from 'date-fns';
import ProduceConsumePlot from "../components/ProduceConsumePlot";
import ProduceConsumePlotLines from "../components/ProduceConsumePlotLines"
import EnergyTimePlot from "../components/EnergyTimePlot"
import DotPlot from "../components/DotPlot";
import EnergyBar from "../components/EnergyBar";

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
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        let dataset = [];
        let loaded = false;
        Papa.parse('./power.csv', {
            download: true,
            header: true,
            dynamicTyping: true,
            delimiter: ';',
            preview: 14400,
            step: (result) => {
                let item = result.data;
                const formattedData = {
                    time: parse(`${item['Date']} ${item['Time']}`, "d/M/yyyy HH:mm:ss", new Date()),
                    power: item['Global_active_power'],
                    power_2: item['Sub_metering_2'],
                    '66p_up': item['Sub_metering_2'] + item['Sub_metering_2'] * Math.random() * 0.5,
                    '66p_down': item['Sub_metering_2'] - item['Sub_metering_2'] * Math.random() * 0.5
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

    render() {
        return (
            <div id='canvas' style={{ width: 1500}}>
                <EnergyBar ref={this.chartRef} data={this.state.data} sets={[
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
                ]} />
                <button type="button" onClick={this.loadPreviousData} style={{ width: 100}}>Previous Period</button>
                <canvas style={{ width: 1300, height: 50}}></canvas>
                <button type="button" onClick={this.loadNextData} style={{ width: 100}}>Next Period</button>
            </div>
        );
    }
}

export default Home;
