import React, { useState } from 'react';
import { wallet_backend } from '../../../declarations/wallet_backend';
import { useNavigate } from 'react-router-dom';
import './Deposit.css';

const Deposit = ({ onClose }) => {
  const [currency, setCurrency] = useState('ZMW');
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // For navigation

  const handleDeposit = async () => {
    if (!account.trim()) {
      setMessage('Account number is required.');
      return;
    }

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setMessage('Please enter a valid amount.');
      return;
    }

    const currencyMap = {
      ZMW: { ZambianKwacha: null },
      USD: { USDollar: null },
      MWK: { MalawianKwacha: null },
      ZWL: { ZimbabweanDollar: null }
    };
    const currencyCode = currencyMap[currency];

    if (!currencyCode) {
      setMessage('Invalid currency selected.');
      return;
    }

    try {
      const result = await wallet_backend.depositIntoUserByAccount(account, currencyCode, parseFloat(amount));
      console.log('Deposit Result:', result);

      if (result && 'ok' in result) {
        setMessage('Deposit successful!');
        setAmount('');
        setAccount('');
        // Redirect to dashboard after successful deposit
        navigate('/dashboard');
      } else {
        setMessage(`Deposit failed: ${result?.err || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error making deposit:', error);
      setMessage(`An error occurred while processing your deposit: ${error.message || 'Unknown error'}`);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard'); // Redirect to dashboard on cancel
  };

  return (
    <div className="deposit-modal">
      <div className="deposit-content">
        <h2>Make a Deposit</h2>
        <label>
          Account Number:
          <input
            type="text"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            placeholder="Enter account number"
          />
        </label>
        <label>
          Select Currency:
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="ZMW">Zambian Kwacha (ZMW)</option>
            <option value="USD">USD Dollar (USD)</option>
            <option value="MWK">Malawian Kwacha (MWK)</option>
            <option value="ZWL">Zimbabwean Dollar (ZWL)</option>
          </select>
        </label>
        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
        </label>
        <button onClick={handleDeposit}>Deposit</button>
        <button onClick={handleCancel}>Cancel</button>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Deposit;
