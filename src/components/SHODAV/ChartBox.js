import React, { Component } from "react";
import LineAreaPlot from "../TODO/ProduceConsumePlot";
import LineBorderPlot from "./LineBorderPlot"
import BarPlot from "./BarPlot";
import BrushChart from "./BrushChart";
import StackedArea from "./StackedArea"

class ChartBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            props: props,
            type: props.type,
            data: null,
            currentDate: null,
            sets: props.sets,
            series: [],
            colours: []
        };

        this.updateData = this.updateData.bind(this);
        
        this.chartRef = React.createRef();
        this.checkBox = React.createRef();
    }

    componentDidMount() {
        this.updateData();
        this.render()
    }

    appendData(series, data) {
        this.chartRef.current.appendData(series, data)
    }

    updateData(input_data) {

        if (!input_data || this.chartRef.current === null){
            return
        }

        this.chartRef.current.updateData(input_data);

        this.render()
        
        this.fetchSeriesData()

    }

    fetchSeriesData = () => {
        if (this.chartRef.current) {
          try {
            const data = this.chartRef.current.getSeries();
            // console.log(data)
            if (data.sets){
                this.setState({
                    series: data.sets,
                    colours: data.colours
                });
            }
            
          } catch (error) {
            console.error("Failed to fetch series data:", error);
          }
        } else {
          console.error("chartRef or getSeries function is not available");
        }
    }

    rgbaToHex = (rgba) => {
        if (/^rgb/.test(rgba)) {
            const rgbaValues = rgba.replace(/^rgba?\\(|\\s+|\\)$/g, '').split(',');
            // Convert RGB to HEX
            // eslint-disable-next-line no-bitwise
            const hex = `#${((1 << 24) + (parseInt(rgbaValues[0], 10) << 16) + (parseInt(rgbaValues[1], 10) << 8) + parseInt(rgbaValues[2], 10)).toString(16).slice(1)}`;
            // Add alpha channel
            const alpha = Math.round(parseFloat(rgbaValues[3]) * 255).toString(16).padStart(2, '0');
            return `${hex}${alpha}`;
        }
        return null; // Invalid input
    }

    toggleSeries = (seriesName, index) => {
        this.fetchSeriesData()
        this.chartRef.current.toggleSeries(seriesName)
        // console.log(document.querySelectorAll('input[type="checkbox"]'))
        // document.querySelectorAll('input[type="checkbox"]')[index].checked = !document.querySelectorAll('input[type="checkbox"]')[index].checked 
    }

    getChannelsFromRGBA = (string) => {
        return string.substring(string.indexOf('(') + 1, string.lastIndexOf(')')).split(/,\s*/);
    }

    render() {
        if (this.state.type){
            switch(this.state.type){
                case("LineAreaPlot"):
                    return (
                        <div>
                            <div style={{height: "100%", width: "67%", float: "left", display: "inline-block"}}>
                                <LineAreaPlot ref={this.chartRef} data={this.state.data} sets={this.state.sets}/>
                            </div>
                            <div style={{foat: "right", display: "inline-block", height:"50%", width:"33%"}}>
                                    <h2>Legend</h2>
                                    <div>
                                    {this.state.series && this.state.series.length > 0 ? (
                                            this.state.series.map((seriesName, index) => (
                                                <div key={index}>
                                                    <label>
                                                        <input 
                                                            type="checkbox" 
                                                            style={{ accentColor: (this.state.colours && this.state.colours[index]) ? this.state.colours[index] : 'blue' }} 
                                                            onChange={() => this.toggleSeries(seriesName, index)}
                                                            defaultChecked={true}
                                                        />
                                                        {seriesName}
                                                    </label>
                                                </div>
                                            ))
                                        ) : (
                                            <div>No series data available.</div>
                                        )}
                                    </div>
                                    <h2>Tools</h2>
                                    <div>
                                        <div>
                                            <label>
                                                <input 
                                                    type="checkbox" 
                                                    style={{ accentColor: "blue"}}
                                                    defaultChecked={true}
                                                />
                                                Tooltip
                                            </label> 
                                        </div>
                                        <div>
                                            <label>
                                                <input 
                                                    type="checkbox" 
                                                    style={{ accentColor: "blue"}}
                                                    defaultChecked={false}
                                                />
                                                Datalabels
                                            </label>
                                        </div>
                                        <div>
                                            <label>
                                                <input 
                                                    type="checkbox" 
                                                    style={{ accentColor: "blue"}}
                                                    defaultChecked={true}
                                                />
                                                Zoom
                                            </label>
                                        </div>
                                        
                                        </div>
                          </div>
                        </div>
                    )
                case("LineBorderPlot"):
                    return (
                        <div>
                            <div style={{height: "100%", width: "75%", float: "left", display: "inline-block"}}>
                                <LineBorderPlot ref={this.chartRef} data={this.state.data} sets={this.state.sets}/>
                            </div>
                            <div style={{foat: "right", display: "inline-block"}}>
                                <div style={{height:"50%", width:"25%"}}>
                                    Legend
                                </div>
                                <div style={{height:"50%", width:"25%"}}>
                                    Tools
                                </div>
                            </div>
                        </div>
                    )
                case("BrushChart"):
                    return (
                        <div height="400px">
                            <div style={{height: "100%", width: "75%", float: "left", display: "inline-block"}}>
                                <BrushChart ref={this.chartRef} data={this.state.data} sets={this.state.sets} title={this.state.props.title}/>
                            </div>
                            <div style={{foat: "right", display: "inline-block"}}>
                                <div style={{height:"50%", width:"25%"}}>
                                    Legend
                                </div>
                                <div style={{height:"50%", width:"25%"}}>
                                    Tools
                                </div>
                            </div>
                        </div>
                    )
                case("StackedArea"):
                    return (
                        <div height="400px">
                            <div style={{height: "100%", width: "67%", float: "left", display: "inline-block"}}>
                                <StackedArea ref={this.chartRef} data={this.state.data} sets={this.state.sets} title={this.state.props.title}/>
                            </div>
                            <div style={{foat: "right", display: "inline-block", height:"50%", width:"33%"}}>
                                    <h2>Legend</h2>
                                    <div>
                                    {this.state.series && this.state.series.length > 0 ? (
                                            this.state.series.map((seriesName, index) => (
                                                <div key={index}>
                                                    <label>
                                                        <input 
                                                            type="checkbox" 
                                                            style={{ accentColor: (this.state.colours && this.state.colours[index]) ? this.state.colours[index] : 'blue' }} 
                                                            onChange={() => this.toggleSeries(seriesName, index)}
                                                            defaultChecked={true}
                                                        />
                                                        {seriesName}
                                                    </label>
                                                </div>
                                            ))
                                        ) : (
                                            <div>No series data available.</div>
                                        )}
                                    </div>
                                    <h2>Tools</h2>
                                    <div>
                                        <div>
                                            <label>
                                                <input 
                                                    type="checkbox" 
                                                    style={{ accentColor: "blue"}}
                                                    defaultChecked={true}
                                                />
                                                Tooltip
                                            </label> 
                                        </div>
                                        <div>
                                            <label>
                                                <input 
                                                    type="checkbox" 
                                                    style={{ accentColor: "blue"}}
                                                    defaultChecked={false}
                                                />
                                                Datalabels
                                            </label>
                                        </div>
                                        <div>
                                            <label>
                                                <input 
                                                    type="checkbox" 
                                                    style={{ accentColor: "blue"}}
                                                    defaultChecked={true}
                                                />
                                                Zoom
                                            </label>
                                        </div>
                                        
                                        </div>
                          </div>
                        </div>
                    )
                case("BarPlot"):
                    return (
                        <div height="400px">
                            <div style={{height: "100%", width: "75%", float: "left", display: "inline-block"}}>
                                <BarPlot ref={this.chartRef} data={this.state.data} sets={this.state.sets}/>
                            </div>
                            <div style={{foat: "right", display: "inline-block"}}>
                                <div style={{height:"50%", width:"25%"}}>
                                    Legend
                                </div>
                                <div style={{height:"50%", width:"25%"}}>
                                    Tools
                                </div>
                            </div>
                        </div>
                    )
                default :
                    return (
                        <div>Invalid graph type specified</div>
                    )
            }
        }
        return (
            <div>No graph type specified</div>
        )
    }
}

export default ChartBox;
