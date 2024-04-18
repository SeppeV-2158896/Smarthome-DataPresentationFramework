import { setQuarter } from "date-fns";
import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

function EnergyTimePlot(props) {
  const [datasets, setDatasets] = useState([]);
  const [colors, setColors] = useState([])
  const [strokeWidth, setStrokeWidth] = useState([])

  useEffect(() => {
    let all_data = [];
    let colours = [];
    let widths = [];    

    props.sets.forEach((set) => {
      
      if (set.uncertainty && JSON.parse(set.uncertainty)) {
        const uncertainties = JSON.parse(set.uncertainty);
      
        uncertainties.forEach((uncertainty) => {
          if (uncertainty.title && uncertainty.value) {
            let series = {
              type: 'rangeArea',
              name: set.title? `${set.title}-uncertainty` : `series-${all_data.length + 1}-uncertainty`,
              data: [],
            };

      
            props.data.forEach((element) => {
              series.data.push({
                x: element[String(set.x)],
                y: [
                  element[String(set.y)] - (parseFloat(uncertainty.value) * element[String(set.y)]),
                  element[String(set.y)] + (parseFloat(uncertainty.value) * element[String(set.y)])
                ]
              });
            });

            console.log(series)
            all_data.push(series)
            colours.push(uncertainty.colour)


          }

          if (uncertainty.title_up && uncertainty.title_down){
            let series = {
              type: 'rangeArea',
              name: set.title? `${set.title}-uncertainty` : `series-${all_data.length + 1}-uncertainty`,
              data: [],
            };

      
            props.data.forEach((element) => {
              series.data.push({
                x: element[String(set.x)],
                y: [element[String(uncertainty.title_down)], element[uncertainty.title_up]]
              });
            });

            console.log(series)
            all_data.push(series)
            colours.push(uncertainty.colour)

          }

        });
      }

      let series = {
        type: 'line',
        name: set.title || `series-${all_data.length + 1}`,
        data: props.data.map(element => ({
          x: element[String(set.x)],
          y: element[String(set.y)],
        })),
      };

      all_data.push(series)
      colours.push(set.colour)
  });
    setDatasets(all_data);
    setColors(colours);
  }, [props.data, props.sets]);

  const options = {
    chart: {
      type: 'rangeArea',
      animations: {
        speed: 500
      }
    },
    zoom: {
      type: 'xy',
      enabled: true,
      autoScaleYaxis: true
    },
    colors: colors,
    stroke: {
      curve: 'smooth',
      colors: colors,
      width: [0,0,2,0,2]
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
      inverseOrder: true
    },
    title: {
      text: 'Range Area with Forecast Line (Combo)'
    },
    xaxis: {
      type: 'datetime',
      range: 1000 * 3600,
    },
    yaxis: {
      decimalsInFloat: 0
    }
  }


  return (
    <div className="app">
      <div className="row">
        <div className="mixed-chart">
          <Chart
            options={options}
            series={datasets}
            type="rangeArea"
            width="1000"
          />
        </div>
      </div>
    </div>
  );
}

export default EnergyTimePlot;