import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';

const FrequencyChart = ({ frequencies }) => {
  useEffect(() => {
    let myChart = null;
    const amplitude = 5;
    const frequency = 0.1;
    const phase = 0;

    const createChart = () => {
      const ctx = document.getElementById('frequencyChart');

      if (myChart) {
        myChart.destroy();
        myChart = null;
      }

      myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: frequencies.map((_, index) => index + 1),
          datasets: [{
            label: 'Frequency',
            data: frequencies.map((_, index) => frequencies[index] + amplitude * Math.sin(frequency * index + phase)),
            fill: false,
            borderColor: 'orange',
            borderWidth: 3
          }]
        },
        options: {
          animation: {
            tension: {
              duration: 100,
              easing: 'easeInOutElastic',
              from: 1,
              to: 0,
              loop: true
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              ticks: {
                font: {
                  weight: 'bold'
                }
              }
            },
            x: {
              ticks: {
                font: {
                  weight: 'bold'
                }
              }
            }
          }
        }
      });
    };

    createChart();

    // Handle window resize to recreate the chart
    window.addEventListener('resize', createChart);

    return () => {
      window.removeEventListener('resize', createChart);
      if (myChart) {
        myChart.destroy();
      }
    };
  }, [frequencies]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '300px' }}>
      <canvas id="frequencyChart" style={{ width: '100%', height: '100%' }}></canvas>
    </div>
  );
};

export default FrequencyChart;
