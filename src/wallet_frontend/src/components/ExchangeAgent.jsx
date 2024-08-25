import React, { useState } from 'react';
import { wallet_backend } from '../../../declarations/wallet_backend'; // Adjust the import path based on your project structure
import { useNavigate } from 'react-router-dom';
import './Exchange.css';

const ExchangeAgent = ({ onClose }) => {
  const [fromCurrency, setFromCurrency] = useState('ZMW');
  const [toCurrency, setToCurrency] = useState('USD');
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // For navigation

  const handleExchange = async () => {
    if (!account.trim()) {
      setMessage('Account number is required.');
      return;
    }

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setMessage('Please enter a valid amount.');
      return;
    }

    if (fromCurrency === toCurrency) {
      setMessage('From and To currencies must be different.');
      return;
    }

    const currencyMap = {
      ZMW: { ZambianKwacha: null },
      USD: { USDollar: null },
      MWK: { MalawianKwacha: null },
      ZWL: { ZimbabweanDollar: null }
    };

    const fromCurrencyCode = currencyMap[fromCurrency];
    const toCurrencyCode = currencyMap[toCurrency];

    if (!fromCurrencyCode || !toCurrencyCode) {
      setMessage('Invalid currency selected.');
      return;
    }

    try {
      const result = await wallet_backend.exchangeCurrency(account, fromCurrencyCode, toCurrencyCode, parseFloat(amount));
      console.log('Exchange Result:', result);

      if (result && 'ok' in result) {
        setMessage('Currency exchange successful!');
        setAmount('');
        setAccount('');
        // Redirect to dashboard after successful exchange
        navigate('/agent');
      } else {
        setMessage(`Exchange failed: ${result?.err || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error during currency exchange:', error);
      setMessage(`An error occurred while processing your exchange: ${error.message || 'Unknown error'}`);
    }
  };

  const handleCancel = () => {
    navigate('/agent'); // Redirect to dashboard on cancel
  };

  return (
    <div className="exchange-modal">
      <div className="exchange-content">
        <h2>Exchange Currency</h2>
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
          From Currency:
          <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
            <option value="ZMW">Zambian Kwacha (ZMW)</option>
            <option value="USD">USD Dollar (USD)</option>
            <option value="MWK">Malawian Kwacha (MWK)</option>
            <option value="ZWL">Zimbabwean Dollar (ZWL)</option>
          </select>
        </label>
        <label>
          To Currency:
          <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
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
        <button onClick={handleExchange}>Exchange</button>
        <button onClick={handleCancel}>Cancel</button>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default ExchangeAgent;
