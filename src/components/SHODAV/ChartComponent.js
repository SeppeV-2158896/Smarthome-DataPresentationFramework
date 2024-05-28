import Component from 'react';

class ChartComponent extends Component{

    constructor(props) {
        super(props);
        if (new.target === ChartComponent) {
            throw new TypeError("Cannot construct ChartComponent instances directly");
        }
    }

    componentDidMount(){
        throw new Error("Method 'componentDidMount()' must be implemented.");
    }

    appendData(series, data) {
        throw new Error("Method 'appendData()' must be implemented.");
    }

    updateData(input){
        throw new Error("Method 'updateData()' must be implemented.");
    }

    getSeries = () => {
        throw new Error("Method 'getSeries()' must be implemented.");
    }

    toggleSeries = (name) => {
        throw new Error("Method 'toggleSeries()' must be implemented.");
    }

    render() {
        throw new Error("Method 'render()' must be implemented."); 
    }

}

export default ChartComponent