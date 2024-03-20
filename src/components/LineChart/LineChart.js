import React, { useEffect } from 'react';
import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function LineChart(input) {
    const [chartData, setChartData] = useState({
        datasets: []
    });
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
		setChartOptions({
			responsive: true,
			plugins: {
			  legend: {
				position: input.option.legend_pos
			  },
			  title: {
				display: false,
			  }
			}
		  })

		  setChartData({
			labels: input.data.map((item, index) => item[String(input.option.x)]),
			datasets: [
			  {
				label: input.option.title,
				data: input.data.map((item, index) => item[String(input.option.y)]),
				borderColor: input.option.colour,
			  }
			]
		  })
		}, [input.data, input.option])


    return (
    <>
      	<div>
            <Line options={chartOptions} data={chartData} />
		</div> 
    </>);
}

export default LineChart;
