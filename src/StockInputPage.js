// StockInputPage.js

import React, { useState } from 'react';
import DataTable from './DataTable';

const StockInputPage = () => {
  const [symbol, setSymbol] = useState('');
  const [data, setData] = useState({ sma5: [], sma30: [], time: [] });

  const handleSymbolChange = (e) => {
    setSymbol(e.target.value);
  };

  const handleStartButtonClick = async () => {
    try {
      const symbol = 'AAPL'; // Replace with the symbol you want to fetch
      const interval5 = '5min'; // 5-minute interval
      const interval30 = '30min'; // 30-minute interval
      const apiKey = '60282fcda5b847378bfa7c03f57d91ec'; // Replace with your actual API key
  
     // Fetch 5-minute SMA data
const apiData5 = await fetchData(symbol, interval5, apiKey);

// Fetch 30-minute SMA data
const apiData30 = await fetchData(symbol, interval30, apiKey);

// Update the state with the fetched data
setData({ sma5: apiData5.sma5, sma30: apiData30.sma, time: apiData5.time }); // Corrected 'sma30' here

    } catch (error) {
      // Handle errors
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
        <div>
          <h2>Fetched Data</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
      <DataTable data={data} />
    </div>
  );
};

async function fetchData(symbol, interval, apiKey) {
    try {
      const apiUrl = `https://api.twelvedata.com/sma?symbol=${symbol}&interval=${interval}&apikey=${apiKey}`;
      const apiResponse = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      

  
      if (!apiResponse.ok) {
        throw new Error('Network response was not ok');
      }
  
      const apiData = await apiResponse.json();
      console.log(apiData);
      if (!apiData.values || !Array.isArray(apiData.values)) {
        throw new Error('API response is missing or has invalid data');
      }
  
      // Extract SMA values and time
      const sma5 = apiData.values.map((item) => parseFloat(item.sma));
      const time = apiData.values.map((item) => item.datetime);
      
      return { sma5, time };
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
  
  

export default StockInputPage;
