import logo from './logo.svg';
import './App.css';
import { restClient } from '@polygon.io/client-js';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import StockInputPage from './StockInputPage';
const rest = restClient('WVJPIWLBg78WEjm8XqPQq4DcYOYQCCH6');

function App() {
  return (
    // rest.stocks.aggregates("AAPL", 1, "day", "2023-01-01", "2023-04-14").then((data) => {
    //   console.log(data);
    // }).catch(e => {
    //   console.error('An error happened:', e);
    // })
    // rest.stocks.lastTrade("AAPL").then((data) => {
    //   console.log(data);
    // }).catch(e => {
    //   console.error('An error happened:', e);
    // })

   // ORignal code----- <StockInputPage />

<Router>
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/main" element={<StockInputPage />} />
    <Route path="*" element={<Navigate to="/login" />} />
  </Routes>
</Router>
 
);
}

export default App;
