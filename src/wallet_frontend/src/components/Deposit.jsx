import React, { useState } from 'react';
import { wallet_backend } from '../../../declarations/wallet_backend';
import './Deposit.css';

const Deposit = ({ onClose, onDepositSuccess = () => {} }) => {
  const [currency, setCurrency] = useState('ZMW');
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState('');
  const [message, setMessage] = useState('');

  const handleDeposit = async () => {
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
      const result = await wallet_backend.depositIntoUserByAccount(account, currencyCode, parseFloat(amount));
      console.log('Deposit Result:', result); // Debugging

      // Check if the result is successful
      if (result && 'ok' in result) {
        if (typeof onDepositSuccess === 'function') {
          onDepositSuccess(currency, parseFloat(amount));
        } else {
          console.warn('onDepositSuccess is not a function');
        }
        setMessage('Deposit successful!');
        // Clear the input fields after successful deposit
        setAmount('');
        setAccount('');
      } else {
        // Display an error message if the deposit failed
        setMessage(`Deposit failed: ${result?.err || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error making deposit:', error);
      setMessage(`An error occurred while processing your deposit: ${error.message || 'Unknown error'}`);
    }
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
        <button onClick={onClose}>Cancel</button>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Deposit;
