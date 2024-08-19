import React, { useEffect, useState } from 'react';
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
    <ul>
      <li><a href="#dashboard">Dashboard</a></li>
      <li><a href="#smart-wallet">Smart Wallet</a></li>
      <li><a href="#deposit">Deposit</a></li>
      <li><a href="#withdraw">Withdraw</a></li>
      <li><a href="#transfer">Transfer</a></li>
      <li><a href="#agents">Agents</a></li>
      <li><a href="#customers">Customers</a></li>
      <li><a href="#pay-bills">Pay Bills</a></li>
      <li><a href="#profile">Profile</a></li>
      <li><a href="#logout" onClick={onLogout}>Logout</a></li>
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
        {/* Add more transaction rows as needed */}
      </tbody>
    </table>
  </div>
);

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

    fetchUserData();
    fetchAccountNumber();
  }, [userId]);

  const handleExchange = async (fromCurrency) => {
    const toCurrency = prompt('Enter target currency (ZMW, USD, MWK, ZWL):');
    const amount = parseFloat(prompt('Enter amount to exchange:'));

    if (!amount || isNaN(amount) || amount <= 0) {
      alert('Invalid amount.');
      return;
    }

    const currencyMap = {
      'Zambian Kwacha (ZMW)': 'zambianKwacha',
      'USD Dollar (USD)': 'usDollar',
      'Malawian Kwacha (MWK)': 'malawianKwacha',
      'Zimbabwean Dollar (ZWL)': 'zimbabweanDollar'
    };

    if (!currencyMap[fromCurrency] || !currencyMap[toCurrency]) {
      alert('Unsupported currency.');
      return;
    }

    try {
      const result = await wallet_backend.exchangeCurrency(
        userId,
        currencyMap[fromCurrency],
        currencyMap[toCurrency],
        amount
      );

      if ('ok' in result) {
        alert(`Exchanged successfully: ${amount} ${fromCurrency} to ${result.ok} ${toCurrency}`);
        setBalances((prevBalances) => ({
          ...prevBalances,
          [currencyMap[fromCurrency]]: prevBalances[currencyMap[fromCurrency]] - amount,
          [currencyMap[toCurrency]]: prevBalances[currencyMap[toCurrency]] + result.ok,
        }));
      } else {
        alert(`Exchange failed: ${result.err}`);
      }
    } catch (error) {
      console.error('Error during exchange:', error);
      alert('Error during exchange');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="dashboard-container">
      <Navbar fullName={fullName} />
      <Sidebar onLogout={handleLogout} />
      <div className="dashboard-content">
        <h1>Welcome, {fullName}!</h1>
        <h3>Account Number: {accountNumber}</h3>
        <CurrencyCards balances={balances} onExchange={handleExchange} />
        <TransactionHistory />
      </div>
    </div>
  );
};

export default Dashboard;
