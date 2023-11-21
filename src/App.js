import logo from './logo.svg';
import './App.css';
import { restClient } from '@polygon.io/client-js';
//import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
//import LoginPage from './LoginPage';
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

    <StockInputPage />

  //  <Router>
  //     <Switch>
  //       <Route path="/login" component={LoginPage} />
  //       <Route path="/stock-input" component={StockInputPage} />
  //       <Route render={() => <Redirect to="/login" />} />
  //     </Switch>
  //   </Router>
 
);
}

export default App;
