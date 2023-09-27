import React from 'react';

const DataTable = ({ data }) => {
    if (!data || !data.sma5 || !data.time) {
      return <p>No data available.</p>;
    }

  const { sma5, time } = data;

  return (
    <div>
      <h2>SMA Data Table</h2>
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>5-Minute SMA</th>
            <th>30-Minute SMA</th>
          </tr>
        </thead>
        <tbody>
          {time.map((timestamp, index) => (
            <tr key={index}>
              <td>{timestamp}</td>
              <td>{sma5[index]}</td>
              {/* Display 30-minute SMA data here */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
