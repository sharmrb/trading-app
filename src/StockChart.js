// import React, { useEffect, useRef } from 'react';
// import Chart from 'chart.js/auto';

// const StockChart = ({ data }) => {
//   const chartRef = useRef(null);
//   const chartInstance = useRef(null);

//   useEffect(() => {
//     if (chartRef.current && data.length > 0) {
//       const ctx = chartRef.current.getContext('2d');

//       if (!chartInstance.current) {
//         chartInstance.current = new Chart(ctx, {
//           type: 'line',
//           data: {
//             labels: [], // Add labels if needed
//             datasets: [
//               {
//                 label: 'Close Price',
//                 data: data.map((item) => item.close),
//                 borderColor: 'blue',
//                 borderWidth: 1,
//                 fill: false,
//               },
//               {
//                 label: 'SMA10',
//                 data: data.map((item) => item.sma10),
//                 borderColor: 'green',
//                 borderWidth: 1,
//                 fill: false,
//               },
//               {
//                 label: 'SMA30',
//                 data: data.map((item) => item.sma30),
//                 borderColor: 'red',
//                 borderWidth: 1,
//                 fill: false,
//               },
//             ],
//           },
//           options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             scales: {
//               x: {
//                 type: 'time', // Use a time scale type
//                 time: {
//                   unit: 'minute', // You can customize the time unit (e.g., 'hour', 'day', 'month')
//                 },
//               },
//             },
//           },
//         });
//       } else {
//         // Update chart data if it already exists
//         chartInstance.current.data.datasets[0].data = data.map((item) => item.close);
//         chartInstance.current.data.datasets[1].data = data.map((item) => item.sma10);
//         chartInstance.current.data.datasets[2].data = data.map((item) => item.sma30);
//         chartInstance.current.update();
//       }
//     }
//   }, [chartRef, data]);

//   return (
//     <div>
//       <canvas ref={chartRef}></canvas>
//     </div>
//   );
// };

// export default StockChart;
