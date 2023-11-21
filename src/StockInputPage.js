// StockInputPage.js
// ApIKey = 60282fcda5b847378bfa7c03f57d91ec
import TradingComponent from './TradingComponent';
import React, { useState, useEffect } from 'react';
import DataTable from './DataTable';
import StockChart from './StockChart';
import axios from 'axios';

let currentprice=0;
const StockInputPage = () => {
  const [symbol, setSymbol] = useState('');
  const [data, setData] = useState([]);
  const [fetchingActive, setFetchingActive] = useState(false);
  const fetchingDuration = 1 * 60 * 1000; // 1 minute can be changed
  let fetchIntervalId = null;
  const [quantityToBuy, setQuantityToBuy] = useState(1); 

  const [stockUrl, setStockUrl] = useState('');
  const [urlFetched, setUrlFetched] = useState(false);

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
      //setting the latest close price to send to back end
      if (apiData.values && apiData.values.length > 0) {
        currentprice = parseFloat(apiData.values[0].close); 
        console.log('Latest Close Price:', currentprice);
        fetchCurrentPrice();
    }
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
        const newSma10 = calculateSMA(last30MinutesData, 10).toFixed(2);
        const newSma30 = calculateSMA(last30MinutesData, 30).toFixed(2);
        
        //add the new data to the existing data
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

  const handleSetQuantity = () => {
   
    if (quantityToBuy > 0) {
      console.log('Setting quantity to', quantityToBuy);
    } else {
      console.log('Invalid quantity');
    }
  };

  const handleStartButtonClick = () => {
    if (!fetchingActive) {
      fetchStockUrl();
      // Start data fetching
      setFetchingActive(true);

      // Fetch data 
      fetchAndScheduleData();
    }
  };

  const handleStopButtonClick = () => {
    if (fetchingActive) {
      
      setFetchingActive(false);

      //clear the fetch interval
      clearTimeout(fetchIntervalId);
    }
  };

  const calculateSMA = (data, period) => {
    if (data.length < period) {
      
      return null;
    }
 
  ;
    
    const slice = data.slice(0, period);

    //calculate the sum of the values in the slice
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

 const callBuyScript = () => {
  fetch('http://localhost:3050/run-robinhood-script', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({}),
})
.then(response => response.json())
.then(data => {
    // Handle the response from the server
    if (data.error) {
        alert('Error: ' + data.error);
    } else {
        alert('Success: ' + data.message);
    }
})
.catch(error => {
    console.error(error);
    alert('An error occurred while executing the script.');
});
}

//Sell Command
const callSellScript = () => {
  fetch('http://localhost:3050/api/sell-stock', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message); // Should log 'Sell order placed successfully' if it works
    })
    .catch((error) => {
      console.error('Error placing sell order:', error);
    });
}
const fetchStockUrl = async () => {
  try {
    console.log('Fetching stock url...');
    await axios.post('http://localhost:3050/api/fetch-stock-url', { symbol });
  } catch (error) {
    console.error('Error triggering the function on the backend:', error);
  }
};
//sending current price to backend
const fetchCurrentPrice = async () => {
  try {
    console.log('Fetching current price...');
    await axios.post('http://localhost:3050/api/fetch-current-price', { currentprice });
  } catch (error) {
    console.error('Error triggering the function on the backend:', error);
  }
}

//Logging out of Robinhood 
const handleLogout = () => {
  fetch('http://localhost:3050/api/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => response.json())
  .then(data => {
      // Handle the response from the server
      if (data.error) {
          alert('Error: ' + data.error);
      } else {
          alert('Success: ' + data.message);
      }
  })
    .catch((error) => {
      console.error('Error expiring token:', error);
    });
};




 return (
  <div>
    <h1>Day Trading App</h1>
    
    <div className="top-bar">
      
      <div>
        <label htmlFor="stockSymbol">Enter Stock Symbol:</label>
        <input
          type="text"
          id="stockSymbol"
          value={symbol}
          onChange={handleSymbolChange}
        />
      </div>
      <button onClick={handleStartButtonClick}>Start</button>
      <button onClick={handleStopButtonClick} disabled={!fetchingActive}>
        Stop
      </button>
      <input
        type="number"
        id="quantityToBuy"
        placeholder="Set Quantity"
        value={quantityToBuy}
        onChange={(e) => setQuantityToBuy(Number(e.target.value))}
      />
      <button onClick={handleSetQuantity}>Set Quantity</button>
      <button onClick={callBuyScript}>Buy</button>
      <button onClick={callSellScript}>Sell</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
    <DataTable data={data} />
    <TradingComponent symbol={symbol} data={data} quantityToBuy={quantityToBuy} />
  </div>
);

  

};



export default StockInputPage;















//  useEffect(() => {
//   if (fetchingActive) {
//     fetchIntervalId = setTimeout(fetchAndScheduleData, fetchingDuration);
//   }
// }, [fetchingActive, fetchingDuration]);