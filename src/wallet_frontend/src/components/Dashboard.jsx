import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { wallet_backend } from '../../../declarations/wallet_backend';
import './Dashboard.css';

const Navbar = ({ fullName }) => (
  <div className="navbar">
    <div className="logo">Dashboard</div>
    <div className="user-info">
      <div className="user-icon">&#128100;</div>
      <div className="user-name">{fullName}</div>
    </div>
  </div>
);

const Sidebar = ({ onLogout }) => (
  <div className="sidebar">
    <div className="logo">Dashboard</div>
    <ul>
      <li><Link to="/dashboard">Dashboard</Link></li>
      <li><Link to="/deposit">Deposit</Link></li>
      <li><Link href="/withdraw">Withdraw</Link></li>
      <li><a href="#transfer">Transfer</a></li>
      <li><a href="#pay-bills">Pay Bills</a></li>
      <li><a href="#customer">Customers</a></li>
      <li><a href="#agent">Agents</a></li>
      <li><a href="/" onClick={onLogout}>Logout</a></li>
    </ul>
  </div>
);

const Card = ({ currency, balance, onExchange }) => (
  <div className="card">
    <h3>{currency}</h3>
    <p>Balance: {balance.toFixed(2)}</p>
    <button onClick={() => onExchange(currency)}>Exchange</button>
  </div>
);

const CurrencyCards = ({ balances, onExchange }) => (
  <div className="currency-cards">
    <Card currency="Zambian Kwacha (ZMW)" balance={balances.zambianKwacha} onExchange={onExchange} />
    <Card currency="USD Dollar (USD)" balance={balances.usDollar} onExchange={onExchange} />
    <Card currency="Malawian Kwacha (MWK)" balance={balances.malawianKwacha} onExchange={onExchange} />
    <Card currency="Zimbabwean Dollar (ZWL)" balance={balances.zimbabweanDollar} onExchange={onExchange} />
  </div>
);

const TransactionHistory = () => (
  <div className="transaction-history">
    <h2>Transaction History</h2>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Amount</th>
          <th>Currency</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {/* Example transactions; replace with dynamic data as needed */}
        <tr>
          <td>2024-08-01</td>
          <td>Deposit</td>
          <td>500</td>
          <td>USD</td>
          <td>Completed</td>
        </tr>
        <tr>
          <td>2024-07-30</td>
          <td>Withdraw</td>
          <td>200</td>
          <td>ZMW</td>
          <td>Pending</td>
        </tr>
        <tr>
          <td>2024-07-25</td>
          <td>Pay Bills</td>
          <td>100</td>
          <td>MWK</td>
          <td>Completed</td>
        </tr>
        <tr>
          <td>2024-07-20</td>
          <td>Deposit</td>
          <td>300</td>
          <td>ZWL</td>
          <td>Completed</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const DepositForm = ({ onDeposit }) => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('ZMW');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount && !isNaN(amount) && amount > 0) {
      onDeposit(parseFloat(amount), currency);
    } else {
      alert('Please enter a valid amount.');
    }
  };

  return (
    <div id="deposit-section" className="deposit-form">
      <h2>Deposit Funds</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>
        <label>
          Currency:
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="ZMW">Zambian Kwacha (ZMW)</option>
            <option value="USD">USD Dollar (USD)</option>
            <option value="MWK">Malawian Kwacha (MWK)</option>
            <option value="ZWL">Zimbabwean Dollar (ZWL)</option>
          </select>
        </label>
        <button type="submit">Deposit</button>
      </form>
    </div>
  );
};

const Dashboard = () => {
  const [userId, setUserId] = useState('');
  const [fullName, setFullName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [balances, setBalances] = useState({
    zambianKwacha: 0,
    malawianKwacha: 0,
    zimbabweanDollar: 0,
    usDollar: 0,
  });

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const fullName = localStorage.getItem('fullName');

    if (userId) setUserId(userId);
    if (fullName) setFullName(fullName);

    const fetchUserData = async () => {
      try {
        const result = await wallet_backend.getBalance(userId);
        if ('ok' in result) {
          setBalances(result.ok);
        } else {
          console.error('Failed to fetch balances:', result.err);
        }
      } catch (error) {
        console.error('Error fetching balances:', error);
      }
    };

    const fetchAccountNumber = async () => {
      try {
        const userData = await wallet_backend.getAccountNumber(userId);
        if ('ok' in userData) {
          setAccountNumber(userData.ok);
        } else {
          console.error('Failed to fetch account number:', userData.err);
        }
      } catch (error) {
        console.error('Error fetching account number:', error);
      }
    };

    if (userId) {
      fetchUserData();
      fetchAccountNumber();
    }
  }, [userId]);

  const handleDeposit = async (amount, currency) => {
    try {
      const response = await wallet_backend.depositFunds(userId, amount, currency);
      
      if ('ok' in response) {
        setBalances(prevBalances => ({
          ...prevBalances,
          [currency.toLowerCase()]: prevBalances[currency.toLowerCase()] + amount,
        }));
        alert('Deposit successful.');
      } else {
        alert('Deposit failed: ' + response.err);
      }
    } catch (error) {
      console.error('Error making deposit:', error);
      alert('An error occurred while making the deposit.');
    }
  };

  const handleExchange = async (fromCurrency) => {
    const toCurrency = prompt('Enter target currency (ZMW, USD, MWK, ZWL):');
    const amount = parseFloat(prompt('Enter amount to exchange:'));

    if (!amount || isNaN(amount) || amount <= 0) {
      alert('Invalid amount.');
      return;
    }

    const currencyMap = {
      'Zambian Kwacha (ZMW)': 'ZMW',
      'USD Dollar (USD)': 'USD',
      'Malawian Kwacha (MWK)': 'MWK',
      'Zimbabwean Dollar (ZWL)': 'ZWL'
    };

    const fromCurrencyCode = currencyMap[fromCurrency];
    const toCurrencyCode = currencyMap[toCurrency];

    if (!fromCurrencyCode) {
      alert(`Invalid source currency: ${fromCurrency}`);
      return;
    }

    if (!toCurrencyCode) {
      alert(`Invalid target currency: ${toCurrency}`);
      return;
    }

    try {
      const response = await wallet_backend.exchangeCurrency(userId, amount, fromCurrencyCode, toCurrencyCode);

      if ('ok' in response) {
        setBalances(prevBalances => ({
          ...prevBalances,
          [fromCurrencyCode.toLowerCase()]: prevBalances[fromCurrencyCode.toLowerCase()] - amount,
          [toCurrencyCode.toLowerCase()]: prevBalances[toCurrencyCode.toLowerCase()] + response.ok,
        }));
        alert('Exchange successful.');
      } else {
        alert('Exchange failed: ' + response.err);
      }
    } catch (error) {
      console.error('Error exchanging currency:', error);
      alert('An error occurred while exchanging currency.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('fullName');
    window.location.href = '/';
  };

  return (
    <div className="dashboard">
      <Navbar fullName={fullName} />
      <div className="main-content">
        <Sidebar onLogout={handleLogout} />
        <div className="dashboard-content">
          <CurrencyCards balances={balances} onExchange={handleExchange} />
          <DepositForm onDeposit={handleDeposit} />
          <TransactionHistory />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
