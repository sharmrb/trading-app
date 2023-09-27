const DataTable = ({ data }) => {
    if (!data || !data.sma5 || !data.sma30 || !data.time5 || !data.time30) {
      return <p>No data available.</p>;
    }
  
    const { sma5, sma30, time5, time30 } = data;
  
    return (
      <div>
        <h2>SMA Data Table</h2>
        <table>
          <thead>
            <tr>
              <th>Time (5-Min)</th>
              <th>5-Minute SMA</th>
              <th>Time (30-Min)</th>
              <th>30-Minute SMA</th>
            </tr>
          </thead>
          <tbody>
            {time5.map((timestamp, index) => (
              <tr key={index}>
                <td>{timestamp}</td>
                <td>{sma5[index]}</td>
                <td>{time30[index]}</td>
                <td>{sma30[index]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

    export default DataTable;