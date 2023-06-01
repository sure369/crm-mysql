import React from 'react';
import Chart from 'react-apexcharts';

const RadialBarChart = ({ chartData }) => {
  const options = {
    plotOptions: {
      radialBar: {
        dataLabels: {
          total: {
            show: true,
            label: 'Total',
          },
        },
      },
    },
    labels: chartData.map((dataPoint) => dataPoint.x),
  };

  const series = chartData.map((dataPoint) => dataPoint.y);

  return (
    <>
      {
        chartData &&
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',  }}>
          <div style={{ width: '100%', maxWidth: '600px' }}>
          <p style={{ textAlign: 'center' }}>Grouped With <b>{chartData[0]?.z}</b> fields</p>
          <Chart options={options} series={series} type="radialBar" height={350} />
          </div>
        </div>
      }
    </>
  );
};

export default RadialBarChart;
