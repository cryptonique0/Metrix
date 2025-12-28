import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import { Metric } from '../services/graphql';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export function TvlChart({ data }: { data: Metric[] }) {
  const labels = data.map((d) => new Date(d.timestamp).toLocaleTimeString());
  const tvls = data.map((d) => d.tvl);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'TVL',
        data: tvls,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        tension: 0.25,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { display: true },
      y: { display: true },
    },
  } as const;

  return (
    <div style={{ height: 360 }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
