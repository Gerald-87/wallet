import React, { useEffect, useState } from 'react';
import { wallet_backend } from '../../../declarations/wallet_backend';
import './Dashboard.css';

const Navbar = ({ fullName }) => (
  <div className="navbar">
    <div className="logo">Agents Dashboard</div>
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
      <li><a href="/exchangeagent">Exchange</a></li>
      <li><a href="/depositagent">Deposit</a></li>
      <li><a href="/withdrawagent">Withdraw</a></li>
      <li><a href="/transferagent">Transfer</a></li>
      <li><a href="/paybillsagent">PayBills</a></li>
      <li><a href="/customer">Customers</a></li>
      <li><a href="/" onClick={onLogout}>Logout</a></li>
    </ul>
  </div>
);

const Card = ({ currency, balance }) => (
  <div className="card">
    <h3>{currency}</h3>
    <p>Balance: {balance.toFixed(2)}</p>
  </div>
);

const CurrencyCards = ({ balances }) => (
  <div className="currency-cards">
    <Card currency="Zambian Kwacha (ZMW)" balance={balances.zambianKwacha} />
    <Card currency="USD Dollar (USD)" balance={balances.usDollar} />
    <Card currency="Malawian Kwacha (MWK)" balance={balances.malawianKwacha} />
    <Card currency="Zimbabwean Dollar (ZWL)" balance={balances.zimbabweanDollar} />
    <Card currency="Commisions" balance={balances.zimbabweanDollar} />
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

const Agent = () => {
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
          <CurrencyCards balances={balances} />
          <TransactionHistory />
        </div>
      </div>
    </div>
  );
};

export default Agent;
