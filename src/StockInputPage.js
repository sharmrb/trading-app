// StockInputPage.js
// ApIKey = 60282fcda5b847378bfa7c03f57d91ec
import React, { useState, useEffect } from 'react';
import DataTable from './DataTable';

const StockInputPage = () => {
  const [symbol, setSymbol] = useState('');
  const [data, setData] = useState([]);
  const [fetchingActive, setFetchingActive] = useState(false);
  const fetchingDuration = 1 * 60 * 1000; // 1 minute
  let fetchIntervalId = null;

  const handleSymbolChange = (e) => {
    setSymbol(e.target.value);
  };

  const fetchData = async (symbol, interval, apiKey) => {
    try {
      const apiUrl = `https://api.twelvedata.com/sma?symbol=${symbol}&interval=${interval}&apikey=${apiKey}&outputsize=30`;
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

      if (!apiData.values || !Array.isArray(apiData.values)) {
        throw new Error('API response invalid data');
      }

      return apiData.values.map((item) => ({
        time: item.datetime,
        sma1: parseFloat(item.sma),
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle errors
      return [];
    }
  };

  const fetchAndScheduleData = async () => {
    try {
      const apiKey = '60282fcda5b847378bfa7c03f57d91ec'; // Replace with your actual API key

      // Fetch 1-minute SMA data
      const fetchedData = await fetchData(symbol, '1min', apiKey);
      console.log('Fetching data...');
      if (fetchedData.length >= 30) {
        // Calculate SMA5 and SMA30 based on the last 30 minutes of data
        const last30MinutesData = fetchedData.slice(0, 30);
        const newSma5 = calculateSMA(last30MinutesData, 5);
        const newSma30 = calculateSMA(last30MinutesData, 30);

        // Append the new data to the existing data
        setData((prevData) => [
          {
            time: fetchedData[0].time,
            sma1: fetchedData[0].sma1,
            sma5: newSma5,
            sma30: newSma30,
          },
          ...prevData,
        ]);
      }
    } catch (error) {
      // Handle errors
    }

    // Schedule the next data fetch after the interval duration
    if (fetchingActive) {
      console.log('Scheduling next fetch...');
      fetchIntervalId = setTimeout(fetchAndScheduleData, fetchingDuration);
    }
  };

  const handleStartButtonClick = () => {
    if (!fetchingActive) {
      // Start data fetching
      setFetchingActive(true);

      // Fetch data immediately
      fetchAndScheduleData();
    }
  };

  const handleStopButtonClick = () => {
    if (fetchingActive) {
      // Stop data fetching
      setFetchingActive(false);

      // Clear the fetch interval
      clearTimeout(fetchIntervalId);
    }
  };

  const calculateSMA = (data, period) => {
    if (data.length < period) {
      // Not enough data points to calculate SMA
      return null;
    }

    // Slice the last 'period' data points
    const slice = data.slice(0, period);

    // Calculate the sum of the values in the slice
    const sum = slice.reduce((accumulator, currentValue) => accumulator + currentValue.sma1, 0);

    // Calculate the SMA
    const sma = sum / period;

    return sma;
  };

  useEffect(() => {
    // Cleanup function to clear the interval when the component unmounts
    return () => {
      if (fetchingActive) {
        clearTimeout(fetchIntervalId);
      }
    };
  }, [fetchingActive, fetchingDuration]);
  useEffect(() => {
    if (fetchingActive) {
      fetchIntervalId = setTimeout(fetchAndScheduleData, fetchingDuration);
    }
  }, [fetchingActive, fetchingDuration]);
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
        <button onClick={handleStopButtonClick} disabled={!fetchingActive}>
          Stop
        </button>
      </div>
      <DataTable data={data} />
    </div>
  );
};

export default StockInputPage;