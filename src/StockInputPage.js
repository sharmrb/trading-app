// StockInputPage.js
// ApIKey = 60282fcda5b847378bfa7c03f57d91ec
import React, { useState } from 'react';
import DataTable from './DataTable';


const StockInputPage = () => {
  const [symbol, setSymbol] = useState('');
  const [data, setData] = useState({ sma5: [], sma30: [], time5: [], time30: [] });
const[fetchingActive, setfetchingActive] = useState(false);
const fetchingDuration= 2*60*1000        //2 mins CAN BE CHANGED
  const handleSymbolChange = (e) => {
    setSymbol(e.target.value);
  };




  const handleStartButtonClick = async () => {
    try {
        const apiKey = '60282fcda5b847378bfa7c03f57d91ec'; // Replace with your actual API key
  
        // Fetch 5-minute SMA data
        const { sma: sma5, time: time5 } = await fetchData(symbol, '5min', apiKey);
  
        // Fetch 30-minute SMA data
        const { sma: sma30, time: time30 } = await fetchData(symbol, '30min', apiKey);
  
        // Update the state with both 5-minute and 30-minute SMA data
        setData({ sma5, sma30, time5, time30 });
      } catch (error) {
        // Handle errors
      }
      
  

    };



const fetchData = async (symbol, interval, apiKey) => {
    try {
      const apiUrl = `https://api.twelvedata.com/sma?symbol=${symbol}&interval=${interval}&apikey=${apiKey}&outputsize=1`;
      const apiResponse = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!apiResponse.ok) {
        throw new Error('Network response not ok');
      }

      const apiData = await apiResponse.json();
      console.log('API Response:', apiData);

      if (!apiData.values || !Array.isArray(apiData.values)) {
        throw new Error('API response invalid data');
      }

      // Extract SMA values and time
      const sma = apiData.values.map((item) => parseFloat(item.sma));
      const time = apiData.values.map((item) => item.datetime);

      return { sma, time };
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };
  
  return (
    <div>
      <h1>Day Trading App</h1>
      <div>
        <label htmlFor="stockSymbol">Enter Stock Symbol:</label>
        <input
          type="text"
          id="stockSymbol"
          value={symbol}
          onChange={handleSymbolChange}
        />
      </div>
      <div>
        <button onClick={handleStartButtonClick}>Start</button>
      </div>
      {data && (

          <h2>Fetched Data</h2>
         

      )}
      <DataTable data={data} />
    </div>
  );
};
  

export default StockInputPage;
