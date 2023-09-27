// StockInputPage.js
// ApIKey = 60282fcda5b847378bfa7c03f57d91ec
import React, { useState, useEffect } from 'react';
import DataTable from './DataTable';

const StockInputPage = () => {
  const [symbol, setSymbol] = useState('');
  const [data, setData] = useState({ sma5: [], sma30: [], time5: [], time30: [] });
  const [fetchingActive, setFetchingActive] = useState(false);
  const fetchingDuration = 1 * 30 * 1000; // 2 minutes (in milliseconds)

  const handleSymbolChange = (e) => {
    setSymbol(e.target.value);
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

  const startFetchingData = () => {
    if (!fetchingActive) {
      // Start data fetching
      setFetchingActive(true);
    }
  };

  const stopFetchingData = () => {
    if (fetchingActive) {
      // Stop data fetching
      setFetchingActive(false);
    }
  };

  useEffect(() => {
    let fetchIntervalId;

    const fetchAndScheduleData = async () => {
      try {
        const apiKey = '60282fcda5b847378bfa7c03f57d91ec'; // Replace with your actual API key

        // Fetch 5-minute SMA data
        const { sma: newSma5, time: newTime5 } = await fetchData(symbol, '5min', apiKey);

        // Fetch 30-minute SMA data
        const { sma: newSma30, time: newTime30 } = await fetchData(symbol, '30min', apiKey);

        // Update the state with new SMA values and timestamps
        setData((prevData) => ({
          sma5: [newSma5, ...prevData.sma5],
          sma30: [newSma30, ...prevData.sma30],
          time5: [newTime5, ...prevData.time5],
          time30: [newTime30, ...prevData.time30],
        }));
      } catch (error) {
        // Handle errors
      }

      // Schedule the next data fetch after the interval duration
      if (fetchingActive) {
        fetchIntervalId = setTimeout(fetchAndScheduleData, fetchingDuration);
      }
    };

    // Start data fetching when `fetchingActive` becomes `true`
    if (fetchingActive) {
      fetchAndScheduleData();
    }

    return () => {
      // Clean up the interval when the component unmounts or `fetchingActive` becomes `false`
      clearTimeout(fetchIntervalId);
    };
  }, [fetchingActive, fetchingDuration, symbol]);

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
        <button onClick={startFetchingData}>Start</button>
        <button onClick={stopFetchingData} disabled={!fetchingActive}>
          Stop
        </button>
      </div>
      <DataTable data={data} />
    </div>
  );
};

export default StockInputPage;
