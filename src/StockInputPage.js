// StockInputPage.js
// ApIKey = 60282fcda5b847378bfa7c03f57d91ec
import TradingComponent from './TradingComponent';
import React, { useState, useEffect } from 'react';
import DataTable from './DataTable';
import StockChart from './StockChart';

const StockInputPage = () => {
  const [symbol, setSymbol] = useState('');
  const [data, setData] = useState([]);
  const [fetchingActive, setFetchingActive] = useState(false);
  const fetchingDuration = 1 * 60 * 1000; // 1 minute can be changed
  let fetchIntervalId = null;

  const handleSymbolChange = (e) => {
    setSymbol(e.target.value);
  };

  const fetchData = async (symbol, interval, apiKey) => {
    try {
      const apiUrl = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&apikey=${apiKey}&outputsize=30`; //&start_date=2023-09-26 15:29:00&end_date=2023-09-27 15:30:00
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

      return apiData.values.map((item) => ({
        time: item.datetime,
        close: parseFloat(item.close),
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle errors
      
      return [];
    }
  };

  const fetchAndScheduleData = async () => {
    try {
      const apiKey = '60282fcda5b847378bfa7c03f57d91ec'; 

      // Fetch 1-minute SMA data
      const fetchedData = await fetchData(symbol, '1min', apiKey);
      console.log(fetchedData);
      if (fetchedData.length >= 30) {
        // Calculate SMA5 and SMA30 based on the last 30 minutes 
        const last30MinutesData = fetchedData.slice(0, 30);
        const newSma10 = calculateSMA(last30MinutesData, 10);
        const newSma30 = calculateSMA(last30MinutesData, 30);
        
        // Append the new data to the existing data
        setData((prevData) => [
          {
            time: fetchedData[0].time,
            close: fetchedData[0].close,
            sma10: newSma10,
            sma30: newSma30,
          },
          ...prevData,
        ]);
      }
    } catch (error) {
      
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
      
      setFetchingActive(false);

      // Clear the fetch interval
      clearTimeout(fetchIntervalId);
    }
  };

  const calculateSMA = (data, period) => {
    if (data.length < period) {
      
      return null;
    }

    
    const slice = data.slice(0, period);

    // Calculate the sum of the values in the slice
    const sum = slice.reduce((accumulator, currentValue) => accumulator + currentValue.close, 0);

    
    const sma = sum / period;

    return sma;
  };

  useEffect(() => {
    
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
      <TradingComponent symbol={symbol} data={data} />  
      {/* <StockChart data={data} /> */}
    </div>
  
  );
  

};



export default StockInputPage;















//  useEffect(() => {
//   if (fetchingActive) {
//     fetchIntervalId = setTimeout(fetchAndScheduleData, fetchingDuration);
//   }
// }, [fetchingActive, fetchingDuration]);