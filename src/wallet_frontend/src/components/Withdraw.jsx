import React, { useState } from 'react';
import { wallet_backend } from '../../../declarations/wallet_backend';
import { useNavigate } from 'react-router-dom';
import './Withdraw.css';

const Withdraw = ({ onClose }) => {
  const [currency, setCurrency] = useState('ZMW');
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // For navigation

  const handleWithdraw = async () => {
    // Validate account number
    if (!account.trim()) {
      setMessage('Account number is required.');
      return;
    }

    // Validate amount
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setMessage('Please enter a valid amount.');
      return;
    }

    // Currency mapping
    const currencyMap = {
      ZMW: { ZambianKwacha: null },
      USD: { USDollar: null },
      MWK: { MalawianKwacha: null },
      ZWL: { ZimbabweanDollar: null }
    };
    const currencyCode = currencyMap[currency];

    // Validate selected currency
    if (!currencyCode) {
      setMessage('Invalid currency selected.');
      return;
    }

    try {
      // Call the backend function and await the result
      const result = await wallet_backend.withdrawFunds(account, currencyCode, parseFloat(amount));
      console.log('Withdraw Result:', result); // Debugging

      // Check if the result is successful
      if (result && 'ok' in result) {
        setMessage('Withdrawal successful!');
        setAmount('');
        setAccount('');
        // Redirect to dashboard after successful withdrawal
        navigate('/dashboard');
      } else {
        // Display an error message if the withdrawal failed
        setMessage(`Withdrawal failed: ${result?.err || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error making withdrawal:', error);
      setMessage(`An error occurred while processing your withdrawal: ${error.message || 'Unknown error'}`);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard'); // Redirect to dashboard on cancel
  };

  return (
    <div className="withdraw-modal">
      <div className="withdraw-content">
        <h2>Make a Withdrawal</h2>
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
        <button onClick={handleWithdraw}>Withdraw</button>
        <button onClick={handleCancel}>Cancel</button>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Withdraw;
