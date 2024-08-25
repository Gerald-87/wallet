import React from 'react';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Agent from './components/Agent';
import Customer from './components/Customer';
import Deposit from './components/Deposit';
import Withdraw from './components/Withdraw';
import PayBills from './components/PayBills';
import Transfer from './components/Transfer';
import Exchange from './components/Exchange';
import DepositAgent from './components/DepositAgent'; 
import WithdrawAgent from './components/WithdrawAgent';
import TransferAgent from './components/TransferAgent';
import ExchangeAgent from './components/ExchangeAgent';
import PayBillsAgent from './components/PayBillsAgent';
import WithdrawCustomer from './components/WithdrawCustomer';
import TransferCustomer from './components/TransferCustomer';
import ExchangeCustomer from './components/ExchangeCustomer';
import PayBillsCustomer from './components/PayBillsCustomer';


// Helper function to check authentication
const isAuthenticated = () => {
  const userId = localStorage.getItem('userId');
  const userRole = JSON.parse(localStorage.getItem('userRole'));
  return userId && userRole;
};

// Protected Route Component
const ProtectedRoute = ({ element, allowedRoles }) => {
  const isAuthenticated = () => {
    const userId = localStorage.getItem('userId');
    const userRole = JSON.parse(localStorage.getItem('userRole'));
    return userId && userRole && allowedRoles.includes(Object.keys(userRole)[0]);
  };

  return isAuthenticated() ? element : <Navigate to="/" />;
};

// Redirect to root if accessing restricted routes
const RedirectIfUnauthorized = () => {
  const userRole = JSON.parse(localStorage.getItem('userRole'));
  if (!userRole) return <Navigate to="/" />;

  switch (Object.keys(userRole)[0]) {
    case 'Admin':
      return <Navigate to="/dashboard" />;
    case 'Customer':
      return <Navigate to="/customer" />;
    case 'Agent':
      return <Navigate to="/agent" />;
    default:
      return <Navigate to="/" />;
  }
};

function App() {
  const route = createBrowserRouter([
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/dashboard",
      element: <ProtectedRoute element={<Dashboard />} allowedRoles={["Admin"]} />,
    },
    {
      path: "/agent",
      element: <ProtectedRoute element={<Agent />} allowedRoles={["Agent"]} />,
    },
    {
      path: "/customer",
      element: <ProtectedRoute element={<Customer />} allowedRoles={["Customer"]} />,
    },
    {
      path: "/deposit",
      element: <ProtectedRoute element={<Deposit />} allowedRoles={["Admin"]} />,
    },
    {
      path: "/withdraw",
      element: <ProtectedRoute element={<Withdraw />} allowedRoles={["Admin"]} />,
    },
    {
      path: "/paybills",
      element: <ProtectedRoute element={<PayBills />} allowedRoles={["Admin"]} />,
    },
    {
      path: "/transfer",
      element: <ProtectedRoute element={<Transfer />} allowedRoles={["Admin"]} />,
    },
    {
      path: "/exchange",
      element: <ProtectedRoute element={<Exchange />} allowedRoles={["Admin"]} />,
    },
    {
      path: "/depositagent",
      element: <ProtectedRoute element={<DepositAgent />} allowedRoles={["Agent"]} />,
    },
    {
      path: "/withdrawagent",
      element: <ProtectedRoute element={<WithdrawAgent />} allowedRoles={["Agent"]} />,
    },
    {
      path: "/transferagent",
      element: <ProtectedRoute element={<TransferAgent />} allowedRoles={["Agent"]} />,
    },
    {
      path: "/exchangeagent",
      element: <ProtectedRoute element={<ExchangeAgent />} allowedRoles={["Agent"]} />,
    },
    {
      path: "/paybillsagent",
      element: <ProtectedRoute element={<PayBillsAgent />} allowedRoles={["Agent"]} />,
    },
    {
      path: "/withdrawcustomer",
      element: <ProtectedRoute element={<WithdrawCustomer />} allowedRoles={["Customer"]} />,
    },
    {
      path: "/transfercustomer",
      element: <ProtectedRoute element={<TransferCustomer />} allowedRoles={["Customer"]} />,
    },
    {
      path: "/exchangecustomer",
      element: <ProtectedRoute element={<ExchangeCustomer />} allowedRoles={["Customer"]} />,
    },
    {
      path: "/paybillscustomer",
      element: <ProtectedRoute element={<PayBillsCustomer />} allowedRoles={["Customer"]} />,
    },
    {
      path: "*",
      element: <RedirectIfUnauthorized />,
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={route} />
    </div>
  );
}

export default App;
