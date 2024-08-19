import { useState } from 'react';
import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { wallet_backend } from 'declarations/wallet_backend';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Agent from './components/Agent';
import Customer from './components/Customer';

function App() {
  const route = createBrowserRouter([
    {
      path: "/Register",
      element: <Register />,
    },
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/agent",
      element: <Agent/>
    },
    {
      path: "/customer",
      element: <Customer/>
    },
    
  ]);
  return (
    <div className="App">
      <RouterProvider router={route}></RouterProvider>
    </div>
  );
}

export default App;
