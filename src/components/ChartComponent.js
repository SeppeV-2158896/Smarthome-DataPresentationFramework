import React from "react";
import LineChart from "../components/LineChart/LineChart";


function ChartComponent(input) {
        return (
            <div>
                <LineChart data={input.data} option={input.option} />
            </div>
        );
    };
export default ChartComponent;