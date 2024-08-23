import React, { useState } from 'react';
import { wallet_backend } from '../../../declarations/wallet_backend';
import './PayBills.css';

const PayBills = ({ onClose, onPaySuccess = () => {} }) => {
  const [billType, setBillType] = useState('');
  const [currency, setCurrency] = useState('ZMW');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handlePayBill = async () => {
    // Validate bill type
    if (!billType.trim()) {
      setMessage('Bill type is required.');
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
      const result = await wallet_backend.payBill(billType, currencyCode, parseFloat(amount));
      console.log('Pay Bill Result:', result); // Debugging

      // Check if the result is successful
      if (result && 'ok' in result) {
        if (typeof onPaySuccess === 'function') {
          onPaySuccess(currency, parseFloat(amount));
        } else {
          console.warn('onPaySuccess is not a function');
        }
        setMessage('Bill payment successful!');
        // Clear the input fields after successful payment
        setBillType('');
        setAmount('');
      } else {
        // Display an error message if the payment failed
        setMessage(`Bill payment failed: ${result?.err || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error making bill payment:', error);
      setMessage(`An error occurred while processing your payment: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="pay-bills-modal">
      <div className="pay-bills-content">
        <h2>Pay a Bill</h2>
        <label>
          Bill Type:
          <input
            type="text"
            value={billType}
            onChange={(e) => setBillType(e.target.value)}
            placeholder="Enter bill type"
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
        <button onClick={handlePayBill}>Pay Bill</button>
        <button onClick={onClose}>Cancel</button>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default PayBills;
