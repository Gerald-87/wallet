import React from 'react';
import './Dashboard.css';

const Navbar = () => (
  <div className="navbar">
    <div className="logo">Dashboard</div>
    <div className="user-info">
      <div className="user-icon">&#128100;</div>
      <div className="user-name">John Doe</div> {/* User's name */}
    </div>
  </div>
);

const Sidebar = () => (
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
      <li><a href="#logout">Logout</a></li>
    </ul>
  </div>
);

const Card = ({ currency, balance }) => (
  <div className="card">
    <h3>{currency}</h3>
    <p>Balance: {balance}</p>
    <button>Exchange</button>
  </div>
);

const CurrencyCards = () => (
  <div className="currency-cards">
    <Card currency="Zambian Kwacha (ZMW)" balance="10,000 ZMW" />
    <Card currency="USD Dollar (USD)" balance="1,000 USD" />
    <Card currency="Malawian Kwacha (MWK)" balance="8,000 MWK" />
    <Card currency="Zimbabwean Dollar (ZWL)" balance="5,000 ZWL" />
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

const Dashboard = () => (
  <div className="dashboard">
    <Navbar />
    <Sidebar />
    <div className="main-content">
      <CurrencyCards />
      <TransactionHistory />
    </div>
  </div>
);

export default Dashboard;
