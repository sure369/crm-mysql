import React, { useEffect, useState } from 'react';
import { RequestServer } from '../api/HttpReq';
import BarChart from './charts/BarChart';
import DonutChart from './charts/DonutChart';
import LineChart from './charts/LineChart';
import PieChart from './charts/PieChart';
import PolarAreaChart from './charts/PolarAreaChart';
import RadarChart from './charts/RadarChart';
import RadialBarChart from './charts/RadialBarChart';

const DashboardCharts = ({ dashboard,formValues }) => {
  const [chartType, setChartType] = useState('');
  const [chartData, setChartData] = useState([]);

  const URL_getDashboard = `/dashboardGroup`;

  console.log(formValues,"DashboardCharts formValues")
  console.log(dashboard," DashboardCharts dashboard")

  useEffect(() => {
    if (dashboard) {
      setChartType(dashboard.chartType);
      fetchExistingRecords(dashboard);
    }
    if(formValues){
      setChartType(formValues.chartType);
      fetchRecords(formValues);
    }
  }, [dashboard,formValues]);


  const fetchRecords = async (item) => {
    console.log("inside DashboardCharts",item)
    // let fields = JSON.parse(item.fields)
   console.log(item.fields,"fetchNewRecords")
    try {
      const response = await RequestServer(`${URL_getDashboard}?object=${item.objectName}&field=${item.fields}`);
      if (response.success) {
        console.log(response.data, 'api res dashboardGroup  dashboard rec');
        if(typeof(response.data==='object')){

          let objdatas =  response.data.map(e => {
            let { count, ...dynamicKeys } = e;
            let _id = {};
            
            for (let key in dynamicKeys) {
              if (dynamicKeys[key] !== '') {
                _id[key] = dynamicKeys[key];
              } else {
                _id[key] = null;
              }
            }            
            return { count, _id };
          });

          console.log(objdatas,"objdatas")
          setChartData(objdatas);
        }else{          
        setChartData([]);
        }
      } else {
        setChartData([]);
      }
    } catch (error) {
      setChartData([]);
      console.log(error, 'fetchChartData error');
    }
  };

  const fetchExistingRecords = async (item) => {
    console.log("inside fetchExistingRecords",item)
     let fields = JSON.parse(item.fields)
   console.log(fields,"fetchExistingRecords")
    try {
      const response = await RequestServer(`${URL_getDashboard}?object=${item.objectName}&field=${fields}`);
      if (response.success) {
        console.log(response.data, 'api res dashboardGroup  dashboard rec');
        if(typeof(response.data==='object')){

          let objdatas =  response.data.map(e => {
            let { count, ...dynamicKeys } = e;
            let _id = {};
            
            for (let key in dynamicKeys) {
              if (dynamicKeys[key] !== '') {
                _id[key] = dynamicKeys[key];
              } else {
                _id[key] = null;
              }
            }            
            return { count, _id };
          });

          console.log(objdatas,"objdatas")
          setChartData(objdatas);
        }else{          
        setChartData([]);
        }
      } else {
        setChartData([]);
      }
    } catch (error) {
      setChartData([]);
      console.log(error, 'fetchChartData error');
    }
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        const lineChartData = chartData.map((dataPoint) => ({
          x: dataPoint._id
          ? Object.values(dataPoint._id)
              .map((value) => (value !== null ? value : 'null'))
              .join(' - ')
          : 'null',
          y: dataPoint.count,
          z: Object.keys(dataPoint._id).join(', '),
        }));
        return <LineChart chartData={lineChartData} />;
      case 'bar':
        const barChartData = chartData.map((dataPoint) => ({
          x:dataPoint._id
          ? Object.values(dataPoint._id)
              .map((value) => (value !== null ? value : 'null'))
              .join(' - ')
          : 'null',
          y: dataPoint.count,
          z: Object.keys(dataPoint._id).join(', '),
        }));
        return <BarChart chartData={barChartData} />;
      case 'pie':
        const pieChartData = chartData.map((dataPoint) => ({
          x: dataPoint._id ? Object.values(dataPoint._id).join(' - ') : 'null',
          y: dataPoint.count,
          z: Object.keys(dataPoint._id).join(', '),
        }));
        return <PieChart chartData={pieChartData} />;
      case 'donut':
        const donutChartData = chartData.map((dataPoint) => ({
          x: dataPoint._id
          ? Object.values(dataPoint._id)
              .map((value) => (value !== null ? value : 'null'))
              .join(' - ')
          : 'null',
          y: dataPoint.count,
          z: Object.keys(dataPoint._id).join(', '),
        }));
        return <DonutChart chartData={donutChartData} />;
      case 'radar':
        const radarChartData = chartData.map((dataPoint) => ({
          x:dataPoint._id
          ? Object.values(dataPoint._id)
              .map((value) => (value !== null ? value : 'null'))
              .join(' - ')
          : 'null',
          y: dataPoint.count,
          z: Object.keys(dataPoint._id).join(', '),
        }));
        return <RadarChart chartData={radarChartData} />;
      case 'radialBar':
        const radialBarChartData = chartData.map((dataPoint) => ({
          x: dataPoint._id
          ? Object.values(dataPoint._id)
              .map((value) => (value !== null ? value : 'null'))
              .join(' - ')
          : 'null',
          y: dataPoint.count,
          z: Object.keys(dataPoint._id).join(', '),
        }));
        return <RadialBarChart chartData={radialBarChartData} />;
      case 'polarArea':
        const polarAreaChartData = chartData.map((dataPoint) => ({
          x: dataPoint._id
          ? Object.values(dataPoint._id)
              .map((value) => (value !== null ? value : 'null'))
              .join(' - ')
          : 'null',
          y: dataPoint.count,
          z: Object.keys(dataPoint._id).join(', '),
        }));
        return <PolarAreaChart chartData={polarAreaChartData} />;
      default:
        return <p>No data available for the selected chart type.</p>;
    }
  };
  console.log(renderChart,"renderChart")

  return <div className="dashboard-charts">{renderChart() }</div>;

}
export default DashboardCharts;

