import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function BarChart({ labels, data }) {
  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            label: "Total Shipments",
            data,
            backgroundColor: "#4CAF50"
          }
        ]
      }}
      options={{
        responsive: true,
        plugins: {
          legend: { position: "top" }
        }
      }}
    />
  );
}

export default BarChart;
