import React, { Component } from "react";
import Papa from 'papaparse';
import { parse } from 'date-fns';
import ProduceConsumePlot from "../components/ProduceConsumePlot";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
        };
        this.loadData = this.loadData.bind(this);
        this.chartRef = React.createRef();
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        let dataset = [];
        Papa.parse('./power.csv', {
            download: true,
            header: true,
            dynamicTyping: true,
            delimiter: ';',
            preview: 1440,
            complete: (results, file) => {
                results.data.forEach((item) => {
                    const formattedData = {
                        time: parse(`${item['Date']} ${item['Time']}`, "d/M/yyyy HH:mm:ss", new Date()),
                        power: item['Global_active_power'],
                        power_2: item['Sub_metering_2'],
                        '66p_up': item['Sub_metering_2'] + item['Sub_metering_2'] * Math.random() * 0.5,
                        '66p_down': item['Sub_metering_2'] - item['Sub_metering_2'] * Math.random() * 0.5
                    };
                    dataset.push(formattedData);
                });
                this.chartRef.current.updateData(dataset);
                this.setState({ data: dataset });
            }
        });
    }

    render() {
        return (
            <div id='canvas' style={{ width: 800, height: 400 }}>
                <ProduceConsumePlot ref={this.chartRef} data={this.state.data} sets={[
                    {
                        x: 'time',
                        y: 'power',
                        title: 'Power Consumption over Time',
                        colour: 'rgba(0,0,255,1)',
                        legend_pos: 'top',
                        uncertainty: '[{"value": "0.03", "title": "66p", "colour": "rgba(65,105,225, 0.7)"}, {"value": "0.05", "title": "95p", "colour": "rgba(65,105,225, 0.3)"}]'
                    },
                    {
                        x: 'time',
                        y: 'power_2',
                        title: 'Power Consumption over Time',
                        colour: 'rgba(95,158,160,1)',
                        legend_pos: 'top',
                        uncertainty: '[{"title_up": "66p_up", "title_down": "66p_down", "colour": "rgba(95,158,160, 0.7)"}]'
                    }
                ]} />
                <button type="button" onClick={this.loadData}>Click Me!</button>
            </div>
        );
    }
}

export default Home;
