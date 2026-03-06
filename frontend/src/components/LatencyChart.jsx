import { useEffect, useRef } from "react";
import api from "../services/api";
import Chart from "chart.js/auto";

export default function LatencyChart() {

  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {

    const ctx = canvasRef.current.getContext("2d");

    // destroy chart เก่าถ้ามี
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Latency (ms)",
            data: [],
            borderColor: "#3b82f6",
            tension: 0.3
          }
        ]
      },
      options: {
        animation: false,
        responsive: true
      }
    });

    const interval = setInterval(async () => {

      const res = await api.get("/latency/latest");
      const data = res.data;

      const chart = chartRef.current;

      chart.data.labels.push(new Date().toLocaleTimeString());
      chart.data.datasets[0].data.push(data.avg_latency);

      if (chart.data.labels.length > 20) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
      }

      chart.update();

    }, 5000);

    return () => {
      clearInterval(interval);

      // destroy chart ตอน component หาย
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };

  }, []);

  return (
    <div style={{background:"#fff",padding:"20px",borderRadius:"10px"}}>
      <h4>Realtime Latency</h4>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}