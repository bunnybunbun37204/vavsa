import React, { useEffect } from 'react';
import Chart from 'chart.js/auto'; // Import Chart from Chart.js

const FrequencyChart = ({ frequencies }) => {
  useEffect(() => {
    let myChart = null;
    const amplitude = 5; // Amplitude of the sine wave
    const frequency = 0.1; // Frequency of the sine wave
    const phase = 0; // Phase shift

    const ctx = document.getElementById('frequencyChart');

    if (myChart) {
      myChart.destroy();
      myChart = null; // Reset the chart instance after destroying
    }

    myChart = new Chart(ctx, {
      type: 'line', // Change to a line chart for a smoother waveform
      data: {
        labels: frequencies.map((_, index) => index + 1),
        datasets: [{
          label: 'Frequency',
          data: frequencies.map((_, index) => frequencies[index] + amplitude * Math.sin(frequency * index + phase)),
          fill: false,
          borderColor: 'orange', // Adjusted to a more Halloween-themed color
          borderWidth: 3
        }]
      },
      options: {
        animation: {
          tension: {
            duration: 100,
            easing: 'easeInOutElastic', // Applying an easing effect
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

    return () => {
      if (myChart) {
        myChart.destroy();
      }
    };
  }, [frequencies]);

  return (
    <div>
      <canvas id="frequencyChart" width="400" height="200"></canvas>
    </div>
  );
};

export default FrequencyChart;
