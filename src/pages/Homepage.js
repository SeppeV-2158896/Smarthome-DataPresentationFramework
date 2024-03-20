import React, { useState, useEffect } from "react";
import LineChart from "../components/LineChart/LineChart";
import Papa from 'papaparse';

function Home() {
    const [chartData, setChartData] = useState([])

    useEffect(() => {
        Papa.parse('./power.csv', {
            download: true,
            header: true,
            dynamicTyping: true,
            delimiter: ',',
            preview: 100,
            complete: ((result) => {
                const formattedData = result.data.map(item => ({ time: new Date(item['time']*1000).toISOString(), power: item['use [kW]'] }))
                setChartData(formattedData)
            })
        })

        
    }, [])

    return (
        <div>
            <LineChart data={chartData} option={({
                x: 'time', 
                y: 'power',
                title: 'Power Consumption over Time',
                colour: 'red',
                legend_pos: 'bottom'
            })} />
        </div>
    );
}

export default Home;
