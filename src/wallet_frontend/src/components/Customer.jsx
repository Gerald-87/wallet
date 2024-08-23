import React, { useEffect, useState } from 'react';
import { wallet_backend } from '../../../declarations/wallet_backend';
import './Dashboard.css';

const Navbar = ({ fullName }) => (
  <div className="navbar">
    <div className="logo">Customers Dashboard</div>
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
      <li><a href="/dashboard">Dashboard</a></li>
      <li><a href="/withdraw">Withdraw</a></li>
      <li><a href="/transfer">Transfer</a></li>
      <li><a href="/pay-bills">Pay Bills</a></li>
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

const Customer = () => {
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

    fetchUserData();
    fetchAccountNumber();
  }, [userId]);

  const handleExchange = async (fromCurrency) => {
    const toCurrency = prompt('Enter target currency (ZMW, USD, MWK, ZWL):').trim();
    const amount = parseFloat(prompt('Enter amount to exchange:'));

    if (isNaN(amount) || amount <= 0) {
        alert('Invalid amount.');
        return;
    }

    const currencyMap = {
        'ZMW': 'zambianKwacha',
        'USD': 'usDollar',
        'MWK': 'malawianKwacha',
        'ZWL': 'zimbabweanDollar'
    };

    if (!currencyMap[toCurrency]) {
        alert('Invalid currency.');
        return;
    }

    try {
        const response = await wallet_backend.exchangeCurrency(userId, fromCurrency, toCurrency, amount);
        console.log('Exchange response:', response); // Debug log
        if (response.ok) {
            setBalances(prevBalances => ({
                ...prevBalances,
                [currencyMap[fromCurrency]]: prevBalances[currencyMap[fromCurrency]] - amount,
                [currencyMap[toCurrency]]: prevBalances[currencyMap[toCurrency]] + response.exchangedAmount,
            }));
            alert('Currency exchanged successfully.');
        } else {
            alert('Currency exchange failed.');
        }
    } catch (error) {
        console.error('Error exchanging currency:', error);
        alert('An error occurred while exchanging currency.');
    }
};

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('fullName');
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-container">
      <Sidebar onLogout={handleLogout} />
      <div className="main-content">
        <Navbar fullName={fullName} />
        <div className="dashboard-content">
          <CurrencyCards balances={balances} onExchange={handleExchange} />
          <TransactionHistory />
        </div>
      </div>
    </div>
  );
};

export default Customer;
