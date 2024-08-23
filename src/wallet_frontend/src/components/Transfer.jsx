import React, { useState } from 'react';
import { wallet_backend } from '../../../declarations/wallet_backend';
import { useNavigate } from 'react-router-dom';
import './Transfer.css';

const Transfer = () => {
  const [recipientAccountNumber, setRecipientAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('ZMW'); // Default currency
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // For navigation

  const handleTransfer = async () => {
    // Validate recipient account number
    if (!recipientAccountNumber.trim()) {
      setMessage('Recipient account number is required.');
      return;
    }

    // Validate amount
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setMessage('Please enter a valid amount.');
      return;
    }

    // Map currency to backend variant names
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
      const senderId = localStorage.getItem('userId');
      if (!senderId) {
        setMessage('User not logged in. Please log in to transfer funds.');
        return;
      }

      const result = await wallet_backend.transferFunds(
        senderId,
        recipientAccountNumber,
        currencyCode, // Correct currency code
        parseFloat(amount)
      );

      console.log('Transfer Result:', result); // Debugging

      if (result && result.Success === "Funds transferred successfully") {
        setMessage('Funds transferred successfully!');
        setRecipientAccountNumber('');
        setAmount('');
        setCurrency('ZMW'); // Reset to default currency
        navigate('/dashboard'); // Redirect after successful transfer
      } else if (result && result.InsufficientBalance) {
        setMessage('Insufficient balance. Please check your account.');
      } else if (result && result.AccountNotFound) {
        setMessage('Recipient account not found. Please check the account number.');
      } else {
        setMessage('Transfer failed: Unknown error');
      }
    } catch (error) {
      console.error('Error making transfer:', error);
      setMessage(`An error occurred while processing your transfer: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="transfer-container">
      <h2>Make a Transfer</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleTransfer(); }}>
        <div className="form-group">
          <label>Recipient Account Number:</label>
          <input
            type="text"
            value={recipientAccountNumber}
            onChange={(e) => setRecipientAccountNumber(e.target.value)}
            placeholder="Enter recipient account number"
            required
          />
        </div>
        <div className="form-group">
          <label>Select Currency:</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
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
            placeholder="Enter amount"
            required
          />
        </div>
        <button type="submit">Transfer</button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default Transfer;
