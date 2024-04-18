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
import { Line } from 'react-chartjs-2';

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
  TimeScale
);

function LineChart(input) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [chartoptions, setChartoptions] = useState({
    maintainAspectRatio: false,
    responsive: true,
    tension: 0.4,
    elements: {
      point: {
        radius: 0,
        hitRadius: 10,
      }
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'x'
        },
        zoom: {
          wheel: {
            enabled: true,
            
          },
          mode: 'x'
        }
      },
      legend: {
        position: input.sets.legend_pos,
      },
      title: {
        display: false,
      },
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
      },
      y: {
        afterFit: (c) => {
          c.width = 40;
        },
      },
    },
  });

  useEffect(() => {
    const datasets = [];
    if (input.sets) {
      input.sets.forEach((set) => {

      datasets.push({
        label: set.title + 'data',
        data: input.data.map((item, index) => item[String(set.y)]),
        borderColor: set.colour,
        backgroundColor: 'rgba(0,0,0,0)',
        fill: false,
        cubicInterpolationMode: 'monotone',
      });
      
      if (JSON.parse(set.uncertainty)) { //source: Blackbox.ai 03/04/2024
        JSON.parse(set.uncertainty).forEach((uncertainty) => {
          const uncertaintyData = {
            label: uncertainty.title + '_up',
            data: input.data.map((item, index) => item[String(set.y)] * (1 + parseFloat(uncertainty.value))),
            backgroundColor: uncertainty.colour,
            borderColor: 'rgba(0,0,0,0)',
            fill: '+1',
            cubicInterpolationMode: 'monotone',
          };

          datasets.push(uncertaintyData);

          const uncertaintyDataDown = { 
            ...uncertaintyData,
            label: uncertainty.title + '_down',
            data: input.data.map((item, index) => item[String(set.y)] * (1 - parseFloat(uncertainty.value))),
            borderColor: 'rgba(0,0,0,0)',
            fill: false
          };

          datasets.push(uncertaintyDataDown);
        });
      }
    })};
  
    console.log(datasets)
    

    setChartData({
      labels: input.data.map((item, index) => item[String(input.sets[0].x)]),
      datasets: datasets,
    });
  }, [input.data, input.sets]);

  return (
    <>
      <div style={{height: 600, width: 1000}}>
        <Line options={chartoptions} data={chartData} />
      </div>
    </>
  );
}

export default LineChart;