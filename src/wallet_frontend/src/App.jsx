import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Agent from './components/Agent';
import Customer from './components/Customer';
import Deposit from './components/Deposit'; // 
import Withdraw from './components/Withdraw';
import PayBills from './components/PayBills';
import Transfer from './components/Transfer';
import Exchange from './components/Exchange'


// Helper function to check authentication
const isAuthenticated = () => {
  const userId = localStorage.getItem('userId');
  return Boolean(userId);
};

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Login />;
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
      element: <ProtectedRoute element={<Dashboard />} />,
    },
    {
      path: "/agent",
      element: <ProtectedRoute element={<Agent />} />,
    },
    {
      path: "/customer",
      element: <ProtectedRoute element={<Customer />} />,
    },
    {
      path: "/deposit",
      element: <ProtectedRoute element={<Deposit />} />,
    },
    {
      path: "/withdraw",
      element: <ProtectedRoute element={<Withdraw />} />,
    },
    {
      path: "/paybills",
      element: <ProtectedRoute element={<PayBills />} />,
    },
    {
      path: "/transfer",
      element: <ProtectedRoute element={<Transfer />} />,
    },
    {
      path: "/exchange",
      element: <ProtectedRoute element={<Exchange />} />,
    },
    
  ]);

  return (
    <div className="App">
      <RouterProvider router={route} />
    </div>
  );
}

export default App;
