import React, { useEffect } from 'react';
import { useState } from 'react';
import zoomPlugin from 'chartjs-plugin-zoom'
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
);

function LineChart(input) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [chartOptions, setChartOptions] = useState({
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
        zoom: {
          wheel: {
            enabled: true,
            
          },
          mode: 'x'
        }
      },
      legend: {
        position: input.option.legend_pos,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          callback: function (val, index) {
            return index % Math.floor((input.data.length - 1) / 8) === 0 ? this.getLabelForValue(val) : '';
          },
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

    datasets.push({
      label: input.option.title + 'data',
      data: input.data.map((item, index) => item[String(input.option.y)]),
      borderColor: input.option.colour,
      backgroundColor: input.option.colour,
      fill: false,
      cubicInterpolationMode: 'monotone',
    });

    if (JSON.parse(input.option.uncertainty)) { //source: Blackbox.ai 03/04/2024
      JSON.parse(input.option.uncertainty).forEach((uncertainty) => {
        const uncertaintyData = {
          label: uncertainty.title + '_up',
          data: input.data.map((item, index) => item[String(input.option.y)] * (1 + parseFloat(uncertainty.value))),
          backgroundColor: uncertainty.colour,
          fill: '-1',
          cubicInterpolationMode: 'monotone',
        };

        datasets.push(uncertaintyData);

        const uncertaintyDataDown = { 
          ...uncertaintyData,
          label: uncertainty.title + '_down',
          data: input.data.map((item, index) => item[String(input.option.y)] * (1 - parseFloat(uncertainty.value))),
        };

        datasets.push(uncertaintyDataDown);
      });
    }

    

    setChartData({
      labels: input.data.map((item, index) => item[String(input.option.x)]),
      datasets: datasets,
    });
  }, [input.data, input.option]);

  return (
    <>
      <div style={{height: 600, width: 1000}}>
        <Line options={chartOptions} data={chartData} />
      </div>
    </>
  );
}

export default LineChart;