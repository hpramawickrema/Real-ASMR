import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <PayPalScriptProvider
            options={{
                "client-id": "Ae7JmesjRLbZ44HdDuBDa7fU-_dzmgydjXJY8C4jo_3QRRcpYyTcgrUhLXavGM6A3bGjkiPxSy5Adjg3", // 🔁 Replace with your actual Client ID
                currency: "USD"
            }}
        >
            <App />
        </PayPalScriptProvider>
    </React.StrictMode>
);
