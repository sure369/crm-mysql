import React from 'react';
import Chart from 'react-apexcharts';

const BarChart = ({ chartData }) => {
  const options = {
    chart: {
      type: 'bar',
    },
    colors: ['#007BFF', '#28A745', '#FFA500', '#DC3545', '#6C63FF', '#6C757D'],
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    xaxis: {
      categories: chartData.map((dataPoint) => dataPoint.x),
    },
    yaxis: {
      title: {
        text: 'Count',
      },
    },
  };

  const series = [
    {
      name: 'Series 1',
      data: chartData.map((dataPoint) => dataPoint.y),
    },
  ];

  return (
    <>
    {
      chartData &&
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
        <div style={{ width: '100%', maxWidth: '600px' }}>
        <p style={{ textAlign: 'center' }}>Grouped With <b>{chartData[0]?.z}</b> fields</p>
        <Chart options={options} series={series} type="bar" height={350} />
        </div>
      </div>
    }
  </>
  );
};

export default BarChart;


// import React from 'react';
// import Chart from 'react-apexcharts';

// const BarChart = ({ chartData }) => {
//   const options = {
//     chart: {
//       type: 'bar',
//     },
//     colors: ["#007BFF", "#28A745", "#FFA500", "#DC3545",
//     "#6C63FF", "#6C757D",],
//     plotOptions: {
//       bar: {
//         horizontal: false,
//       },
//     },
//     xaxis: {
//       categories: chartData.map((dataPoint) => dataPoint.x),
//     },
//     yaxis: {
//       title: {
//         text: 'Count',
//       },
//     },
//   };

//   const series = [
//     {
//       name: 'Series 1',
//       data: chartData.map((dataPoint) => dataPoint.y),
//     },
//   ];

//   return (
//     <div>
//       <Chart options={options} series={series} type="bar" height={350} />
//     </div>
//   );
// };

// export default BarChart;
