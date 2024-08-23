import React, { useEffect, useState } from 'react';
import { wallet_backend } from '../../../declarations/wallet_backend';
import './Dashboard.css';

const Navbar = ({ fullName, accountNumber }) => (
  <div className="navbar">
    <div className="logo">Dashboard</div>
    <div className="user-info">
      <div className="user-icon">&#128100;</div>
      <div className="user-name">{fullName}</div>
      <div className="accountNo">{accountNumber}</div>
    </div>
  </div>
);

const Sidebar = ({ onLogout }) => (
  <div className="sidebar">
    <div className="logo">Dashboard</div>
    <ul>
      <li><a href="/dashboard">Dashboard</a></li>
      <li><a href="/deposit">Deposit</a></li>
      <li><a href="/withdraw">Withdraw</a></li>
      <li><a href="/transfer">Transfer</a></li>
      <li><a href="/paybills">PayBills</a></li>
      <li><a href="/exchange">Exchange</a></li>
      <li><a href="/agent">Agents</a></li>
      <li><a href="/customer">Customers</a></li>
      <li><a href="/profile">Profile</a></li>
      <li><a href="/" onClick={onLogout}>Logout</a></li>
    </ul>
  </div>
);



// Card component for displaying currency balances
const Card = ({ currency, balance, onExchange }) => (
  <div className="card">
    <h3>{currency}</h3>
    <p>Balance: {balance.toFixed(2)}</p>
    <button onClick={() => onExchange(currency)}>Exchange</button>
  </div>
);

// CurrencyCards component for displaying all currency cards
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
        {/* Sample data, replace with dynamic data fetched from backend */}
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

  // Handle currency exchange
  const handleExchange = async (fromCurrency) => {
    const toCurrency = prompt('Enter target currency (ZMW, USD, MWK, ZWL):');
    const amount = parseFloat(prompt('Enter amount to exchange:'));

    if (!amount || isNaN(amount) || amount <= 0) {
      alert('Invalid amount.');
      return;
    }

    const currencyMap = {
      ZMW: { ZambianKwacha: null },
      USD: { USDollar: null },
      MWK: { MalawianKwacha: null },
      ZWL: { ZimbabweanDollar: null }
    };
  
    if (!currencyMap[toCurrency]) {
      alert('Invalid currency.');
      return;
    }

    try {
      const response = await wallet_backend.exchangeCurrency(userId, fromCurrency, toCurrency, amount);
      if ('ok' in response) {
        setBalances(prevBalances => ({
          ...prevBalances,
          [currencyMap[fromCurrency]]: prevBalances[currencyMap[fromCurrency]] - amount,
          [currencyMap[toCurrency]]: prevBalances[currencyMap[toCurrency]] + response.ok,
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
  
  const handleDeposit = async () => {
    const amount = parseFloat(prompt('Enter amount to deposit:'));
    const currency = prompt('Enter currency (ZMW, USD, MWK, ZWL):');

    if (!amount || isNaN(amount) || amount <= 0) {
      alert('Invalid amount.');
      return;
    }

    try {
      const response = await wallet_backend.deposit(userId, amount, currency);
      if ('ok' in response) {
        setBalances(prevBalances => ({
          ...prevBalances,
          [currency]: prevBalances[currency] + amount,
        }));
        alert('Deposit successful.');
      } else {
        alert('Deposit failed.');
      }
    } catch (error) {
      console.error('Error depositing:', error);
      alert('An error occurred during deposit.');
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(prompt('Enter amount to withdraw:'));
    const currency = prompt('Enter currency (ZMW, USD, MWK, ZWL):');

    if (!amount || isNaN(amount) || amount <= 0) {
      alert('Invalid amount.');
      return;
    }

    try {
      const response = await wallet_backend.withdraw(userId, amount, currency);
      if ('ok' in response) {
        setBalances(prevBalances => ({
          ...prevBalances,
          [currency]: prevBalances[currency] - amount,
        }));
        alert('Withdrawal successful.');
      } else {
        alert('Withdrawal failed.');
      }
    } catch (error) {
      console.error('Error withdrawing:', error);
      alert('An error occurred during withdrawal.');
    }
  };

  const handleTransfer = async () => {
    const recipientId = prompt('Enter recipient account ID:');
    const amount = parseFloat(prompt('Enter amount to transfer:'));
    const currency = prompt('Enter currency (ZMW, USD, MWK, ZWL):');

    if (!recipientId) {
      alert('Recipient account ID is required.');
      return;
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      alert('Invalid amount.');
      return;
    }

    try {
      const response = await wallet_backend.transfer(userId, recipientId, amount, currency);
      if ('ok' in response) {
        setBalances(prevBalances => ({
          ...prevBalances,
          [currencyMap[currency]]: prevBalances[currencyMap[currency]] - amount,
        }));
        alert('Transfer successful.');
      } else {
        alert('Transfer failed.');
      }
    } catch (error) {
      console.error('Error transferring:', error);
      alert('An error occurred during the transfer.');
    }
  };
  const handlePayBills = async () => {
    const billType = prompt('Enter bill type (e.g., Electricity, Water, School):');
    const amount = parseFloat(prompt('Enter amount to pay:'));
    const currency = prompt('Enter currency (ZMW, USD, MWK, ZWL):');

    if (!billType) {
      alert('Bill type is required.');
      return;
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      alert('Invalid amount.');
      return;
    }

    try {
      const response = await wallet_backend.payBills(userId, billType, amount, currency);
      if ('ok' in response) {
        setBalances(prevBalances => ({
          ...prevBalances,
          [currency]: prevBalances[currency] - amount,
        }));
        alert('Bill payment successful.');
      } else {
        alert('Bill payment failed.');
      }
    } catch (error) {
      console.error('Error paying bills:', error);
      alert('An error occurred while paying bills.');
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('fullName');
    window.location.href = '/';
  };

  return (
    <div className="dashboard">
      <Navbar fullName={fullName} accountNumber={accountNumber} />
      <Sidebar onLogout={handleLogout} />
      <div className="main-content">
        <CurrencyCards balances={balances} onExchange={handleExchange} />
        <div className="actions">
          <button onClick={handleDeposit}>Deposit</button>
          <button onClick={handleWithdraw}>Withdraw</button>
          <button onClick={handleTransfer}>Transfer</button>
          <button onClick={handlePayBills}>PayBills</button>
        </div>
        <TransactionHistory />
      </div>
    </div>
  );
};

export default Dashboard;
