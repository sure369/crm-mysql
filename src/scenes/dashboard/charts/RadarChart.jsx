import React from 'react';
import Chart from 'react-apexcharts';

const RadarChart = ({ chartData }) => {
  console.log(chartData,"inside chart page")
  const options = {
    chart: {
      type: 'radar',
    },
    xaxis: {
      categories: chartData.map((dataPoint) => dataPoint.x),
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',  }}>
        <div style={{ width: '100%', maxWidth: '600px' }}>
        <p style={{ textAlign: 'center' }}>Grouped With <b>{chartData[0]?.z}</b> fields</p>
          <Chart options={options} series={series} type="radar" height={350} />
        </div>
      </div>
    }
  </>
  );
};

export default RadarChart;
