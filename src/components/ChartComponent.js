import React from "react";
import LineChart from "../components/LineChart/LineChart";
import DotPlot from "../components/DotPlot/DotPlot"
import { Line } from "react-chartjs-2";
import EnergyTimePlot from "./EnergyTimePlot"


function ChartComponent(input) {
        return (
            <div>
                <EnergyTimePlot data={input.data} sets={input.sets} />
            </div>
        );
    };
export default ChartComponent;