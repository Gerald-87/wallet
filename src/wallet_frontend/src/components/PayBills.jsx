import React, { useState } from 'react';
import { wallet_backend } from '../../../declarations/wallet_backend';
import { useNavigate } from 'react-router-dom';
import './PayBills.css';

const PayBills = ({ onClose }) => {
  const [currency, setCurrency] = useState('ZMW');
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState('');
  const [billType, setBillType] = useState('Electricity'); // Default bill type
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // For navigation

  const handlePayBill = async () => {
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

    // Bill type mapping
    const billTypeMap = {
      Electricity: { Electricity: null },
      Water: { Water: null },
      Internet: { Internet: null },
      Rent: { Rent: null }
    };
    const selectedBillType = billTypeMap[billType];

    // Validate selected bill type
    if (!selectedBillType) {
      setMessage('Invalid bill type selected.');
      return;
    }

    try {
      // Call the backend function and await the result
      const result = await wallet_backend.payBill(account, selectedBillType, currencyCode, parseFloat(amount));
      console.log('Pay Bill Result:', result); // Debugging

      // Check if the result is successful
      if (result && 'ok' in result) {
        setMessage('Bill payment successful!');
        setAmount('');
        setAccount('');
        setBillType('Electricity'); // Reset bill type to default
        // Redirect to dashboard after successful payment
        navigate('/dashboard');
      } else {
        // Display an error message if the payment failed
        setMessage(`Payment failed: ${result?.err || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error making payment:', error);
      setMessage(`An error occurred while processing your payment: ${error.message || 'Unknown error'}`);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard'); // Redirect to dashboard on cancel
  };

  return (
    <div className="paybills-modal">
      <div className="paybills-content">
        <h2>Pay a Bill</h2>
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
          Select Bill Type:
          <select value={billType} onChange={(e) => setBillType(e.target.value)}>
            <option value="Electricity">Electricity</option>
            <option value="Water">Water</option>
            <option value="Internet">Internet</option>
            <option value="Rent">Rent</option>
          </select>
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
        <button onClick={handleCancel}>Cancel</button>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default PayBills;
