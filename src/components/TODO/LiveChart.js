// import React, {Component} from 'react';
// import DataRepository from '../DataRepository';
// import {ReactApexChart, ApexCharts} from 'react-apexcharts';

// class LiveChart extends React.Component {


    
//     constructor(props) {
//       super(props);

//       this.state = {
//         props: props,
//         series: [],
//         options: {
//           chart: {
//             id: 'realtime',
//             height: 350,
//             type: 'line',
//             animations: {
//               enabled: true,
//               easing: 'linear',
//               dynamicAnimation: {
//                 speed: 1000
//               }
//             },
//             toolbar: {
//               show: false
//             },
//             zoom: {
//               enabled: false
//             }
//           },
//           dataLabels: {
//             enabled: false
//           },
//           stroke: {
//             curve: 'smooth'
//           },
//           title: {
//             text: 'Dynamic Updating Chart',
//             align: 'left'
//           },
//           markers: {
//             size: 0
//           },
//           xaxis: {
//             type: 'datetime',
//           },
//           yaxis: {
//             max: 100
//           },
//           legend: {
//             show: false
//           },
//         },
      
      
//       };

//       this.updateData=this.updateData.bind(this);
//       this.appendData=this.appendData.bind(this);

//     }

//     appendData() {

//     }

  
//     componentDidMount() {
//       window.setInterval(() => {
//         getNewSeries(lastDate, {
//           min: 10,
//           max: 90
//         })
        
//         ApexCharts.exec('realtime', 'updateSeries', [{
//           data: data
//         }])
//       }, 1000)
//     }

//     updateData(input){
//         let all_data = []
//         let colours = []
//         let widths = []
//         let stops = []
//         let types = []
  
//         this.state.props.sets.forEach((set) => {
//           let uncertainties = DataRepository.getRangeSeriesFromUncertainty(input, set)
  
//           if (uncertainties.dataset.length > 0){
//             uncertainties.dataset.forEach((series) => all_data.push(series))
//             uncertainties.colours.forEach((colour) => colours.push(colour))
//             uncertainties.widths.forEach((width) => widths.push(width))
//             uncertainties.types.forEach((type) => types.push(type))
//           }
  
//           let dataseries = DataRepository.getSeriesFromData(input, set, 0, null, uncertainties.dataset[-1])
  
//           if (dataseries.dataset.data.length > 0){
//             all_data.push(dataseries.dataset)
//             colours.push(dataseries.colours)
//             widths.push(dataseries.widths)
//             stops = dataseries.stops
//             types.push(dataseries.type)
//           }
          
//         })
        
//         this.setState({
//           series: all_data,
//           options: {
//             colors: colours,
//             fill:{
//               type: types,
//               gradient: {
//                 type: 'vertical',
//                 shadeIntensity: 1,
//                 opacityFrom: 1,
//                 opacityTo: 1,
//                 colorStops: stops
//               },
//             },
//             stroke: {
//               width: widths
//             } 
//           }
//         })
        
  
//         this.render()
  
//       }
  

//     render() {
//       return (
//         <div>
//           <div id="chart">
//             <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={350} />
//           </div>
//           <div id="html-dist"></div>
//         </div>
//       );
//     }
//   }

// export default LiveChart