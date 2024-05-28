import React, { Component } from "react";
import Papa from 'papaparse';
import { parse } from 'date-fns';
import ChartBox from "../components/ChartBox"
import ApexCharts from "apexcharts";
import EnergyBar from "../components/TODO/EnergyBar";
import ProduceConsumePlot from "../components/TODO/ProduceConsumePlot";
import ProduceConsumePlotLines from "../components/TODO/ProduceConsumePlotLines";
import TotalPlot from "../components/TODO/TotalPlot";
import BrushChart from "../components/TODO/BrushChart";

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
        // this.chartRef.current.updateData(this.getEnergyData());
        // this.setupAppendDataInterval(); // Call the function to setup interval for appending data
    }

    getEnergyData = () => {
        return (
            [
              { "date_time": "2024-05-01 00:00:+02:00", "energy": 126.3, "uncertainty_lower": null, "uncertainty_upper": null },
              { "date_time": "2024-05-02 00:00:+02:00", "energy": 115.6, "uncertainty_lower": null, "uncertainty_upper": null },
              { "date_time": "2024-05-03 00:00:+02:00", "energy": 107.9, "uncertainty_lower": null, "uncertainty_upper": null },
              { "date_time": "2024-05-04 00:00:+02:00", "energy": 135.0, "uncertainty_lower": null, "uncertainty_upper": null },
              { "date_time": "2024-05-05 00:00:+02:00", "energy": 128.6, "uncertainty_lower": null, "uncertainty_upper": null },
              { "date_time": "2024-05-06 00:00:+02:00", "energy": 129.4, "uncertainty_lower": null, "uncertainty_upper": null },
              { "date_time": "2024-05-07 00:00:+02:00", "energy": 144.8, "uncertainty_lower": null, "uncertainty_upper": null },
              { "date_time": "2024-05-08 00:00:+02:00", "energy": 138.86, "uncertainty_lower": 133.6, "uncertainty_upper": 141.9 },
              { "date_time": "2024-05-09 00:00:+02:00", "energy": 138.7335, "uncertainty_lower": 130.6, "uncertainty_upper": 150.0 },
              { "date_time": "2024-05-10 00:00:+02:00", "energy": 138.31, "uncertainty_lower": 137.0, "uncertainty_upper": 140.0 }
            ]
        )        
    }

    // Function to setup interval for calling appendData
    setupAppendDataInterval() {
        let currentIndex = 0;
        setInterval(() => {
            if (this.state.data && currentIndex < this.state.data.length) {
                const timestamp = this.state.data[currentIndex].time;
                const y = Math.floor(Math.random() * 101); // Generate random value for y
                this.chartRef.current.appendData('Power Consumption Live over Time', { x: timestamp, y: y }); // Call appendData with random y value
                currentIndex++;
            }
        }, 500); // Call appendData every minute
    }

    

    loadData() {
        let dataset = [];
        let loaded = false;
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
                    '66p_down': item['fridge'] - item['fridge'] * Math.random() * 0.1,
                    washing_power: item['washing_machine'],
                    socket: item['sockets'],
                    heating: item['electric heating element'],
                    tv: item['television']
                };

                dataset.push(formattedData);

                if (dataset.length > 1440 && !loaded) {
                    loaded = true;
                    console.log(dataset)
                    // this.chartRef.current.updateData(dataset.filter((data) => data.time.getDate() === dataset[0].time.getDate()));
                    this.chartRef.current.updateData(dataset)
                    this.setState({
                        data: dataset,
                        currentDate: dataset[0].time
                    });
                }

                if (dataset.length % 1000 === 0) {
                    console.log("read")
                }
            }
        });

        this.render()
    }

    loadNextData() {
        console.log(this.state.data.map((item) => item['time']))
        console.log(this.state.currentDate)
        this.setState({
            currentDate: new Date(this.state.currentDate.setDate(this.state.currentDate.getDate() + 1))
        });
        console.log(this.state.currentDate)
        console.log((this.state.data.filter((data) => data.time === this.state.currentDate)).length)

        this.chartRef.current.updateData(this.state.data.filter((data) => data.time.toDateString() === this.state.currentDate.toDateString()));
        console.log("done")
    }

    loadPreviousData() {
        console.log(this.state.data.map((item) => item['time']))
        console.log(this.state.currentDate)
        this.setState({
            currentDate: new Date(this.state.currentDate.setDate(this.state.currentDate.getDate() - 1))
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
        ApexCharts.exec("chart", "toggleSeries", this.getSeriesNamesFromChartRef()[index])
    }

    update = (type) => {
        this.state.type = type
        this.render()
    }

    render() {
        return (
            <div>
                {/* <div id='canvas' style={{ width: "50%"}}>
                    <ChartBox ref={this.chartRef} type={"ProduceConsumePlot"} data={this.state.data} sets={[
                        {
                            x: 'time',
                            y: 'power',
                            title: 'Power Consumption Electric Heating over Time',
                            colour: 'rgba(0,0,255,1)',
                            legend_pos: 'top',
                            consumption: false,
                            radius: 2,
                            uncertainty: '[{"value": "0.2", "title": "99p", "colour": "rgba(65,105,225, 0.3)"}]'
                        },
                        {
                            title: 'Power Consumption Live over Time',
                            colour: 'rgba(0,255,0,1)',
                            legend_pos: 'top',
                            consumption: false,
                            radius: 2,
                            // uncertainty: '[{"value": "0.2", "title": "99p", "colour": "rgba(65,105,225, 0.3)"}]'
                        },

                    ]} />
                    <button type="button" onClick={this.loadPreviousData} style={{ width: 100 }}>Previous Period</button>
                    <button type="button" onClick={this.loadNextData} style={{ width: 100 }}>Next Period</button>
                </div> */}
                <div id='canvas' style={{ width: "50%"}}>
                <ProduceConsumePlot ref={this.chartRef} type={"BrushChart"} data={this.state.data} title={'Total power consumption'} sets={[
                    {
                        x: 'time',
                        y: 'tv',
                        title: 'Power Consumption TV over Time',
                        // title: 'Daily energy consumption',
                        // gradient: {
                        //     enable: true,
                        //     value: 40
                        // },
                        legend_pos: 'top',
                        colour: 'rgba(0,0,255,1)',
                        consumption: false,
                        radius: 2,
                        uncertainty: '[{"value": "0.2", "title": "99p", "colour": "rgba(65,105,225, 0.3)"},{"value": "0.01", "title": "67p", "colour": "rgba(65,105,225, 0.5)"},{"value": "0.05", "title": "50p", "colour": "rgba(65,105,225, 0.7)"} ]'
                     },{
                        x: 'time',
                        y: 'power_2',
                        title: 'Power Consumption Fridge over Time',
                        colour: 'rgba(95,158,160,1)',
                        legend_pos: 'top',
                        consumption: false,
                        uncertainty: '[{"title_up": "66p_up", "title_down": "66p_down", "colour": "rgba(95,158,160, 0.7)"}]'
                    },
                //     x: 'time',
                //     y: 'power_2',
                //     title: 'Power Consumption Fridge over Time',
                //     // colour: 'rgba(0,0,255,1)',
                //     legend_pos: 'top',
                //     consumption: false,
                //     radius: 2,
                //     // uncertainty: '[{"value": "0.2", "title": "99p", "colour": "rgba(65,105,225, 0.3)"}]'
                // },{
                //     x: 'time',
                //     y: 'washing_power',
                //     title: 'Power Consumption Washing over Time',
                //     // colour: 'rgba(0,0,255,1)',
                //     legend_pos: 'top',
                //     consumption: false,
                //     radius: 2,
                //     // uncertainty: '[{"value": "0.2", "title": "99p", "colour": "rgba(65,105,225, 0.3)"}]'
                // },

                ]} />
                <button type="button" onClick={this.loadPreviousData} style={{ width: 100 }}>Previous Period</button>
                <button type="button" onClick={this.loadNextData} style={{ width: 100 }}>Next Period</button>
            </div>
        </div>



        );
    }
}

export default Home;

//     {
//         x: 'time',
//         y: 'power_2',
//         title: 'Power Consumption Fridge over Time',
//         colour: 'rgba(95,158,160,1)',
//         legend_pos: 'top',
//         consumption: false,
//         uncertainty: '[{"title_up": "66p_up", "title_down": "66p_down", "colour": "rgba(95,158,160, 0.7)"}]'
//     },{
//         x: 'time',
//         y: 'power',
//         title: 'Power Consumption Electric Heating over Time',
//         colour: 'rgba(0,0,255,1)',
//         background: 'rgba(0,0,255,0.2)',
//         legend_pos: 'top',
//         consumption: false,
//         radius: 2,
//         uncertainty: '[{"value": "0.2", "title": "99p", "colour": "rgba(65,105,225, 0.3)"}, {"value": "0.1", "title": "66p", "colour": "rgba(65,105,225, 0.7)"}]'
//     },
//     {
//         x: 'time',
//         y: 'power',
//         title: 'Power Consumption Electric Heating over Time',
//         colour: 'rgba(0,0,255,1)',
//         background: 'rgba(0,0,255,0.2)',
//         legend_pos: 'top',
//         consumption: false,
        // gradient: {
        //     enable: true,
        //     value: 40
        // },
//         radius: 2,
//         uncertainty: '[{"value": "0.2", "title": "99p", "colour": "rgba(65,105,225, 0.3)"}]'
//     },
    
// ]}/>
// <ul style={{width: 1300}}>
//     {seriesNames.map((name, index) => (
//     <li key={index}>
//         <input defaultChecked type="checkbox" id={`series-${name}`} name="series" onClick={() => this.toggleSeries(index)}/>
//         <label htmlFor={` series-${name}`}> {name}</label>
//     </li>
//     ))}
// </ul>