import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import type { Weight } from '../App';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function WeightChart({ weights }: { weights: Weight[] }) {
  const sorted = weights.slice().sort((a, b) => (a.date < b.date ? -1 : 1));
  const labels = sorted.map((s) => s.date);
  const data = sorted.map((s) => s.weight);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Weight (kg)',
        data,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)'
      }
    ]
  };

  return (
    <section className="chart">
      <h2>Trend</h2>
      <div style={{ width: '100%', height: 220 }}>
        <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </section>
  );
}
