class DataRepository {
    constructor(){
        
    }

    static getRangeSeriesFromUncertainty(data, set){

        let all_data = []
        let colours = []
        let widths = []

        // if there are uncertainty series specified in the set, and they are correctly formulated according to JSON, parse them
        if (set.uncertainty && JSON.parse(set.uncertainty)) {
            const uncertainties = JSON.parse(set.uncertainty);
            
            // process each uncertainty seperately
            uncertainties.forEach((uncertainty) => {

                let series = {
                    type: 'rangeArea',
                    name: set.title? `${set.title}-uncertainty` : `series-${all_data.length + 1}-uncertainty`,
                    data: [],
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
                colours.push(uncertainty.colour ? uncertainty.colour : `rgba(${Math.random()*255}, ${Math.random()*255}. ${Math.random()*255}, 0.7`);
                widths.push(0);

            });
        };

        return {
            dataset: all_data,
            colours: colours,
            widths: widths,
        }
    }

    static getLineSeriesFromUncertainty(data, set){

        let all_data = []
        let colours = []
        let widths = []
        
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

                colours.push(uncertainty.colour ? uncertainty.colour : 
                    `rgba(${Math.random()*255}, ${Math.random()*255}. ${Math.random()*255}, 0.7`);
                colours.push(uncertainty.colour ? uncertainty.colour : 
                    `rgba(${Math.random()*255}, ${Math.random()*255}. ${Math.random()*255}, 0.7`);

                widths.push(set.uncertainty_width ? set.uncertainty_width : 2)
                widths.push(set.uncertainty_width ? set.uncertainty_width : 2)
        
            });
        };
        
        return {
            dataset: all_data,
            colours: colours,
            widths: widths,
        }

    }

    static getSeriesFromData(input_data, set, index = 0){
        let series = {
            type: 'line',
            name: set.title || (index === 0 ? "Energy Time Series" : `series-${index + 1}`),
            data: input_data.map(element => ({
              x: element[String(set.x)],
              y: set.consumption ? element[String(set.y)]*-1 : element[String(set.y)] ,
            })),
        };
    
        return {
            dataset: series,
            widths: set.width ? set.width : 2,
            colours: set.colour ? set.colour : `rgba(${Math.random()*255}, ${Math.random()*255}. ${Math.random()*255}, 0.7`
        }
    }
}

export default DataRepository