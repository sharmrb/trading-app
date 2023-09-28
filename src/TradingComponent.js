// TradingComponent.js
import React, { useState, useEffect } from 'react';

const TradingComponent = ({ symbol, data }) => {
  // State for tracking trading-related data
  const [cashBalance, setCashBalance] = useState(10000); // Starting balance of $10,000
  const [stockHoldings, setStockHoldings] = useState(0); // Number of shares 
  const [tradeHistory, setTradeHistory] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  useEffect(() => {
    
    if (data.length >= 2) {
      const lastData = data[0];
      const secondToLastData = data[1];
  
      const sma10Current = lastData.sma10;
      const sma30Current = lastData.sma30;
      const sma10Previous = secondToLastData.sma10;
      const sma30Previous = secondToLastData.sma30;
  
      // Buy condition: SMA10 crosses above SMA30
      if (sma10Current > sma30Current )//&& sma10Previous <= sma30Previous)
       {
        const sharesToBuy = Math.floor(cashBalance / lastData.close); // Buy as many shares as possible
        if (sharesToBuy > 0) {
          const cost = sharesToBuy * lastData.close;
          setCashBalance((prevBalance) => prevBalance - cost);
          setStockHoldings((prevHoldings) => prevHoldings + sharesToBuy);
          console.log("buying");
            setTradeHistory([
                ...tradeHistory,
                {
                type: 'Buy',
                shares: sharesToBuy,
                price: lastData.close,
                time: new Date().toLocaleTimeString(),
                },
            ]);
        }
      }
  
      // Sell condition: SMA10 crosses below SMA30
      if (sma10Current < sma30Current)// && sma10Previous >= sma30Previous
      {
        if (stockHoldings > 0) {
          const saleValue = stockHoldings * lastData.close;
          setCashBalance((prevBalance) => prevBalance + saleValue);
          setStockHoldings(0);
          console.log("selling");
            setTradeHistory([
                ...tradeHistory,
                {
                type: 'Sell',
                shares: stockHoldings,
                price: lastData.close,
                time: new Date().toLocaleTimeString(),
                },
            ]);
        }
      }
    }
  }, [data, cashBalance, stockHoldings]);

  
  const renderTradeHistory = () => {
    return (
      <div>
        <h2>Trade History</h2>
        <ul>
          {tradeHistory.map((trade, index) => (
            <li key={index}>
              {trade.type}: {trade.shares} shares at ${trade.price} (Time: {trade.time})
            </li>
          ))}
        </ul>
      </div>
    );
  };
  return (
    <div>
      <h2>Trading Summary</h2>
      <p>Cash Balance: ${cashBalance.toFixed(2)}</p>
      <p>Stock Holdings: {stockHoldings} shares</p>

      
      
      <div>
      {/* ... */}
      {renderTradeHistory()}
    </div>
    </div>
    
  );
  
};


export default TradingComponent;
