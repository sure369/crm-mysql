import React from 'react';
import Chart from 'react-apexcharts';

const PolarAreaChart = ({ chartData }) => {
  console.log(chartData,"chartData PolarAreaChart")

  const options = {
    labels: chartData.map((dataPoint) => dataPoint.x),
    plotOptions: {
      polarArea: {
        rings: {
          strokeWidth: 0,
        },
        spokes: {
          strokeWidth: 0,
        },
      },
    },
  };

  const series = chartData.map((dataPoint) => dataPoint.y);

  return (
    <>
      {
        chartData &&
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',  }}>
          <div style={{ width: '100%', maxWidth: '600px' }}>
          <p style={{ textAlign: 'center' }}>Grouped With <b>{chartData[0]?.z}</b> fields</p>
          <Chart options={options} series={series} type="polarArea" height={350} />
          </div>
        </div>
      }
    </>
  );
};

export default PolarAreaChart;
