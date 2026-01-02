import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Login from './pages/Login';
import Layout from './pages/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Messages from './pages/Messages';
import Settings from './pages/Settings';

function App() {
    return (
        <>
            <Toaster position="bottom-right" />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/" element={<Layout />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="products" element={<Products />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="messages" element={<Messages />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
