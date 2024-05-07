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
            
            // process each uncertainty seperate
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
        return
    }

    static getSeriesFromData(input_data, set, index = 0){
        let series = {
            type: 'line',
            name: set.title || (index === 0 ? "Energy Time Series" : `series-${index + 1}`),
            data: input_data.map(element => ({
              x: element[String(set.x)],
              y: set.consumption ? element[String(set.y)]*-1 : element[String(set.y)] ,
            })),
            color: set.background ? set.background : (set.consumption ? 'rgba(255,0,0,0.2)' : 'rgba(0,255,0,0.2)')
        };
    
        return {
            dataset: series,
            widths: set.width ? set.width : 2,
            colours: set.colour ? set.colour : `rgba(${Math.random()*255}, ${Math.random()*255}. ${Math.random()*255}, 0.7`
        }
    }
}

export default DataRepository