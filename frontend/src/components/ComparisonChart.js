import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ComparisonChart = ({ data }) => {
  const labels = data.map(item => item.company);
  const datasets = [
    {
      label: 'WSM',
      data: data.map(item => item.WSM),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    },
    {
      label: 'TOPSIS',
      data: data.map(item => item.TOPSIS),
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
    },
    {
      label: 'AHP',
      data: data.map(item => item.AHP),
      backgroundColor: 'rgba(255, 159, 64, 0.6)',
    },
    {
      label: 'PROMETHEE',
      data: data.map(item => item.PROMETHEE),
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
    },
    {
      label: 'ARAS',
      data: data.map(item => item.ARAS),
      backgroundColor: 'rgba(122, 123, 22, 0.6)',
    },
  ];

  const chartData = {
    labels,
    datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Primerjava MCDA metod',
      },
    },
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Podjetja',
        },
      },
      y: {
        type: 'linear', 
        title: {
          display: true,
          text: 'Rezultati',
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default ComparisonChart;