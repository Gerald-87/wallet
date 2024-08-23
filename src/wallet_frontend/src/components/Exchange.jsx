import React, { useState } from 'react';
import './Exchange.css';

const Exchange = ({ onClose, onExchange }) => {
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fromCurrency || !toCurrency || !amount) {
      alert('All fields are required.');
      return;
    }

    if (fromCurrency === toCurrency) {
      alert('From and To currencies must be different.');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Invalid amount.');
      return;
    }

    onExchange(fromCurrency, toCurrency, parsedAmount);
    onClose(); // Close the form after successful exchange
  };

  return (
    <div className="exchange-form">
      <form onSubmit={handleSubmit}>
        <h2>Exchange Currency</h2>
        <div className="form-group">
          <label>From Currency:</label>
          <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
            <option value="">Select Currency</option>
            <option value="ZMW">Zambian Kwacha (ZMW)</option>
            <option value="USD">USD Dollar (USD)</option>
            <option value="MWK">Malawian Kwacha (MWK)</option>
            <option value="ZWL">Zimbabwean Dollar (ZWL)</option>
          </select>
        </div>
        <div className="form-group">
          <label>To Currency:</label>
          <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
            <option value="">Select Currency</option>
            <option value="ZMW">Zambian Kwacha (ZMW)</option>
            <option value="USD">USD Dollar (USD)</option>
            <option value="MWK">Malawian Kwacha (MWK)</option>
            <option value="ZWL">Zimbabwean Dollar (ZWL)</option>
          </select>
        </div>
        <div className="form-group">
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.01"
          />
        </div>
        <button type="submit">Exchange</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default Exchange;
