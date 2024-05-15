class DataRepository {
    constructor(){
        
    }

    static getRangeSeriesFromUncertainty(data, set){

        let all_data = []
        let colours = []
        let widths = []
        let types = []

        // if there are uncertainty series specified in the set, and they are correctly formulated according to JSON, parse them
        if (set.uncertainty && JSON.parse(set.uncertainty)) {
            const uncertainties = JSON.parse(set.uncertainty);
            
            // process each uncertainty seperately
            uncertainties.forEach((uncertainty) => {

                let series = {
                    type: 'rangeArea',
                    name: set.title? `${set.title}-uncertainty` : `series-${all_data.length + 1}-uncertainty`,
                    data: [],
                    colour: null,
                };

                // if the value is specified, there is a constant uncertainty over the whole series
                if (uncertainty.title && uncertainty.value) {
                    
                    data.forEach((element) => {
                        series.data.push({
                            x: element[String(set.x)],
                            y: set.consumption ? [
                            -1 * (element[String(set.y)] - (parseFloat(uncertainty.value) * element[String(set.y)])),
                            -1 * (element[String(set.y)] + (parseFloat(uncertainty.value) * element[String(set.y)]))
                            ] : [
                            element[String(set.y)] - (parseFloat(uncertainty.value) * element[String(set.y)]),
                            element[String(set.y)] + (parseFloat(uncertainty.value) * element[String(set.y)])
                            ]
                        });
                    });
                } 
    
                // if the uncertainty is not constant, but defined by upper and lower values these can be interpreted here
                if (uncertainty.title_up && uncertainty.title_down){ 
          
                    data.forEach((element) => {
                        series.data.push({
                            x: element[String(set.x)],
                            y: set.consumption ? [-1 *element[String(uncertainty.title_down)], -1 * element[uncertainty.title_up]] 
                            : [element[String(uncertainty.title_down)], element[String(uncertainty.title_up)]]
                        });
                    });
                }

                // add the series to their corresponding arrays with their properties
                all_data.push(series);
                
                colours.push(uncertainty.colour ? uncertainty.colour : `rgba(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255}, 0.7)`);
                series.colour = (uncertainty.colour ? uncertainty.colour : `rgba(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255}, 0.7)`)
                
                widths.push(0);

                types.push('solid')

            });
        };

        return {
            dataset: all_data,
            colours: colours,
            widths: widths,
            types: types,
        }
    }

    static getLineSeriesFromUncertainty(data, set){

        let all_data = []
        let colours = []
        let widths = []
        let types = []
        
        // if there are uncertainty series specified in the set, and they are correctly formulated according to JSON, parse them
        if (set.uncertainty && JSON.parse(set.uncertainty)) {
            const uncertainties = JSON.parse(set.uncertainty);

            // process each uncertainty seperately
            uncertainties.forEach((uncertainty) => {

                let series_up = {
                    type: 'line',
                    name: set.title? `${set.title}-uncertainty-up-${uncertainty.title}` : `series-${all_data.length + 1}-uncertainty-up-${uncertainty.title}`,
                    data: [],
                };
                let series_down = {
                    type: 'line',
                    name: set.title? `${set.title}-uncertainty-down-${uncertainty.title}` : `series-${all_data.length + 1}-uncertainty-down-${uncertainty.title}`,
                    data: [],
                };

                // if the value is specified, there is a constant uncertainty over the whole series

                if (uncertainty.title && uncertainty.value) {
                    
                    data.forEach((element) => {
                        series_up.data.push({
                            x: element[String(set.x)],
                            y: set.consumption ? 
                            -1 * (element[String(set.y)] + (parseFloat(uncertainty.value) * element[String(set.y)]))
                                : 
                            element[String(set.y)] + (parseFloat(uncertainty.value) * element[String(set.y)])
                        });
    
                        series_down.data.push({
                            x: element[String(set.x)],
                            y: set.consumption ? 
                                -1 * (element[String(set.y)] - (parseFloat(uncertainty.value) * element[String(set.y)]))
                            : 
                                element[String(set.y)] - (parseFloat(uncertainty.value) * element[String(set.y)])
                        });
                    });
                }
    
                // if the uncertainty is not constant, but defined by upper and lower values these can be interpreted here

                if (uncertainty.title_up && uncertainty.title_down){        
            
                    data.forEach((element) => {
                        series_up.data.push({
                            x: element[String(set.x)],
                            y: set.consumption ? -1 * element[uncertainty.title_up] : element[String(uncertainty.title_up)]
                        });
    
                        series_down.data.push({
                            x: element[String(set.x)],
                            y: set.consumption ? -1 *element[String(uncertainty.title_down)] : element[String(uncertainty.title_down)]
                        });
                    });        
                }

                // add the series to their corresponding arrays with their properties

                all_data.push(series_up);
                all_data.push(series_down);

                if (set.gradient && set.gradient.enable) {
                    colours = []                    
                } else {
                    colours.push(uncertainty.colour ? uncertainty.colour : `rgba(${Math.round(Math.random()*255)}, ${Math.round(Math.random()*255)}, ${Math.round(Math.random()*255)}, 0.7)`);
                }
                
                widths.push(set.uncertainty_width ? set.uncertainty_width : 2)
                widths.push(set.uncertainty_width ? set.uncertainty_width : 2)

                types.push('solid')
                types.push('solid')

        
            });
        };
        
        return {
            dataset: all_data,
            colours: colours,
            widths: widths,
            types: types,
        }

    }

    static getSeriesFromData(input_data, set, index = 0, uncertainty_up = null, uncertainty_range = null){
        let series = {
            type: 'line',
            name: set.title || (index === 0 ? "Energy Time Series" : `series-${index + 1}`),
            data: input_data.map(element => ({
              x: element[String(set.x)],
              y: set.consumption ? element[String(set.y)]*-1 : element[String(set.y)] ,
            })),
        };

        let previous_offset = -2;
        let stops = []
        let colours = null

        if (set.gradient && set.gradient.enable) {
            const gradient = set.gradient;
            const _ = require("lodash");
            let max
            if (uncertainty_up){
                max = _.maxBy(uncertainty_up.data, function (p) { return Math.abs(p.y); }).y
            } 
            else if (uncertainty_range){
                max = _.maxBy(uncertainty_range.data, function (p) { return Math.abs(p.y[1]); }).y[1]
            }
            else {
                max = _.maxBy(series.data, function (p) { return Math.abs(p.y); }).y
            }
            console.log(max, gradient.value)
            if (gradient.stops) {
                gradient.stops.forEach((stop) => {  
                    let offset = stop.value / max * 100                                     
                    stops.push(
                        {
                            offset: 100 - Math.round(previous_offset) + 2,
                            color: stop.color ? stop.color : (stop.colour ? stop.colour : `rgba(${Math.round(Math.random()*255)}, ${Math.round(Math.random()*255)}, ${Math.round(Math.random()*255)}, 1)`),
                            opacity: set.opacity ? set.opacity : 1
                        }
                    )
                    stops.push(
                        {
                            offset: 100 - Math.round(offset) - 2,
                            color: stop.color ? stop.color : (stop.colour ? stop.colour : `rgba(${Math.round(Math.random()*255)}, ${Math.round(Math.random()*255)}, ${Math.round(Math.random()*255)}, 1)`),
                            opacity: stop.opacity ? stop.opacity : 1
                        }
                    )
                    previous_offset = offset
                })
            }
            else 
            if (gradient.value) {
                stops.push(
                    {
                        offset: 0,
                        color: gradient.color ? gradient.color : (set.colour ? set.colour : `red`),
                        opacity: gradient.opacity ? gradient.opacity : 1
                    }
                )
                stops.push(
                    {
                        offset: 100 - Math.round(gradient.value / max * 100 ) - 2,
                        color: gradient.color ? gradient.color : (set.colour ? set.colour : `red`),
                        opacity: gradient.opacity ? gradient.opacity : 1
                    }
                )
                stops.push(
                    {
                        offset: 100 - Math.round(gradient.value / max * 100 ) + 2,
                        color: gradient.color ? gradient.color : (set.colour ? set.colour : `green`),
                        opacity: gradient.opacity ? gradient.opacity : 1
                    }
                )
                stops.push(
                    {
                        offset: 100,
                        color: gradient.color ? gradient.color : (set.colour ? set.colour : `green`),
                        opacity: gradient.opacity ? gradient.opacity : 1
                    }
                )
            }
            
        } else {
           colours = (set.colour ? set.colour : `rgba(${Math.round(Math.random()*255)}, ${Math.round(Math.random()*255)}, ${Math.round(Math.random()*255)}, 1)`);
        }
    
        return {
            dataset: series,
            widths: set.width ? set.width : 2,
            colours: colours,
            type: (set.gradient && set.gradient.enable) ? 'gradient' : 'solid',
            stops: stops,
        }
    }
}

export default DataRepository