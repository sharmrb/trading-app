import React from 'react';

const DataTable = ({ data }) => {
  return (
    <div>
      <h2>Stock Data</h2>
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Close</th>
            <th>SMA10</th>
            <th>SMA30</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index}>
              <td>{entry.time}</td>
              <td>{entry.close}</td>
              <td>{entry.sma10 || 'Calculating...'}</td>
              <td>{entry.sma30 || 'Calculating...'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;