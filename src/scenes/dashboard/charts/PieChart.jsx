import React from 'react';
import Chart from 'react-apexcharts';

const PieChart = ({ chartData }) => {
  const options = {
    chart: {
      type: 'pie',
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
          <Chart options={options} series={series} type="pie" height={350} />
          </div>
        </div>
      }
    </>
  );
};

export default PieChart;
