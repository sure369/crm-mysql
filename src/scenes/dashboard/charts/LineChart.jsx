import React from 'react';
import ReactApexChart from 'react-apexcharts';

const LineChart = ({ chartData }) => {
  const options = {
    chart: {
      type: 'line',
    },
    series: [
      {
        name: 'Count',
        data: chartData,
      },
    ],
    xaxis: {
      type: 'category',
    },
  };

  return (
    <>
    {
      chartData &&
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
        <div style={{ width: '100%', maxWidth: '600px' }}>
        <p style={{ textAlign: 'center' }}>Grouped With <b>{chartData[0]?.z}</b> fields</p>
        <ReactApexChart options={options} series={options.series} type={options.chart.type} height={350} />
        </div>
      </div>
    }
  </>
  );
};

export default LineChart;
