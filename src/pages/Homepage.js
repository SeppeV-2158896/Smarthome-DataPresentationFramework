import React, { useState, useEffect, Component } from "react";
import Papa from 'papaparse';
import { parse } from 'date-fns';
import EnergyTimePlot from "../components/EnergyTimePlot";
import { saveAs } from 'file-saver'
// import dataset from './power.json'


class Home extends Component{
    
    constructor(props){

        let dataset = []

        super(props);

        Papa.parse('./power.csv', {
            download: true,
            header: true,
            dynamicTyping: true,
            delimiter: ';',
            preview: 1000,
            step: function(result, parser)  {
                let item = result.data
                const formattedData = {
                    time: parse(String(item['Date'] + " " + item['Time']), "d/M/yyyy HH:mm:ss", new Date()),
                    power: item['Global_active_power'],
                    power_2: item['Sub_metering_2'],
                    '66p_up': item['Sub_metering_2'] + item['Sub_metering_2'] * Math.random() * 0.5,
                    '66p_down': item['Sub_metering_2'] - item['Sub_metering_2'] * Math.random() * 0.5
                };
                dataset.push(formattedData);
                console.log('read'); 
            }
        });

            this.state = {
                data: dataset,
            }

    }

    render(){

        return (
            <div style={{ width: 800, height: 400 }}>
                {/* Display other content if needed */}
                {/* <EnergyTimePlot data={this.state.data} sets={[{
                    x: 'time', 
                    y: 'power',
                    title: 'Power Consumption over Time',
                    colour: 'rgba(0,0,255,1)',
                    legend_pos: 'top',
                    // radius: 1,
                    uncertainty:'[{"value": "0.03", "title": "66p", "colour": "rgba(65,105,225, 0.7)"}, {"value": "0.05", "title": "95p", "colour": "rgba(65,105,225, 0.3)"}]'
                }, {
                    x: 'time', 
                    y: 'power_2',
                    title: 'Power Consumption over Time',
                    colour: 'rgba(95,158,160,1)',
                    legend_pos: 'top',
                    // radius: 10,
                    uncertainty:'[{"title_up": "66p_up", "title_down": "66p_down", "colour": "rgba(95,158,160, 0.7)"}]'
                }]} /> */}
                <button type="button" onclick="moreData()" >Click Me!</button> 
            </div>
        );
    }
}

export default Home;
