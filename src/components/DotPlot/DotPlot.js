import React, { useEffect } from 'react';
import { useState } from 'react';
import zoomPlugin from 'chartjs-plugin-zoom'
import 'chartjs-adapter-spacetime'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin,
  TimeScale,
);

function DotPlot(input) {

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [chartoptions, setChartoptions] = useState({
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      zoom: {
        zoom: {
        wheel: {
          enabled: true,
          },
          mode: 'x'
        },
      },

      scroll: {
        mode: 'x',
        speed: 20,
        drag: true,
        stop: true,
        right: 15,
        maintainVisible: false,
      },

      scrollBar: {enable: true, scrollType: 'Horizontal'},

    },

    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'hour',
          displayFormats: {
            hour: 'HH:mm'
          }
        },

        ticks: {
          maxRotation: 0,
          minRotation: 0
        },

        grid: {
          display: true
        },

        title: {
          display: true,
          text: 'Time'
        }

      },
      y: {
        afterFit: (c) => {
          c.width = 40;
        },
        ticks: {
          min: 0 // Set the minimum value of the y-axis scale to 0
        },
        beginAtZero: true,
      },
    },
  });

  useEffect(() => {
    const datasets = [];
    let dots = []

    input.data.map((item, index) => {
      for (let i = input.sets.radius; i <= Math.floor(item[input.sets.y]/input.sets.radius); i++) {
        dots.push({x: item[String(input.sets.x)], y: i - input.sets.radius/2});
      }
    })

    datasets.push({
      label: input.sets.title + 'data',
      data: dots,
      borderColor: input.sets.colour,
      fill: false,
      pointRadius: input.sets.radius*40,

    });
    
    console.log(datasets)
    setChartData({
      datasets: datasets,
    });

  }, [input.data, input.sets]);

  return (
    <>
      <div style={{height: 600, width: 1000}}>
        <Scatter setss={chartoptions} data={chartData} />
      </div>
    </>
  );
}

export default DotPlot;