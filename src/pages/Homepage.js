import React, { useState, useEffect } from "react";
import Papa from 'papaparse';
import ChartComponent from "../components/ChartComponent";

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
                const formattedData = result.data.map(item => ({ time: new Date(item['time']*1000).toLocaleString(), power: item['Furnace 2 [kW]'] }))
                setChartData(formattedData)
            })
        })

        
    }, [])

    return (
        <div style={{width: 800, height: 400}}>
            <ChartComponent data={chartData} option={({
                x: 'time', 
                y: 'power',
                title: 'Power Consumption over Time',
                colour: 'rgba(0,0,0,255)',
                legend_pos: 'bottom',
                uncertainty:'[{"value": "0.03", "title": "66p", "colour": "rgba(255, 0, 0, 200)"}, {"value": "0.05", "title": "95p", "colour": "rgba(0, 255, 0, 100)"}]'
            })} />
        </div>
    );
}

export default Home;
