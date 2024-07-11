import React, { useState, useEffect } from 'react';
import Header from './components/Head';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Footer from './components/Footer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import './App.css';

const App = () => {
  const [items, setItems] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({});
  const [showMessage, setShowMessage] = useState(false);
  const [currency, setCurrency] = useState('LKR');
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch('https://mocki.io/v1/0dc94c35-ad55-4de0-8717-f0a65701e94e')
      .then(response => response.json())
      .then(data => setItems(data.foodItems))
      .catch(error => console.error('Error fetching food items:', error));
  }, []);

  useEffect(() => {
    fetch('https://api.exchangerate-api.com/v4/latest/LKR')
      .then(response => response.json())
      .then(data => setExchangeRates(data.rates))
      .catch(error => console.error('Error fetching exchange rates:', error));
  }, []);

  const addToCart = (item) => {
    const updatedItem = { ...item, timestamp: new Date().getTime() };
    setCart(prevCart => [...prevCart, updatedItem]);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  const removeFromCart = (itemIndex) => {
    setCart(prevCart => prevCart.filter((_, index) => index !== itemIndex));
  };

  const placeOrder = (tableNumber) => {
    const orderData = {
      items: cart,
      tableNumber: tableNumber,
      timestamp: new Date().getTime()
    };

    fetch('http://localhost:3001/api/place-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          setCart([]);
          alert('Order placed successfully!');
        } else {
          alert('Failed to place order. Please try again.');
        }
      })
      .catch(error => {
        console.error('Error placing order:', error);
        alert('An error occurred while placing the order. Please try again.');
      });
  };

  const convertPrice = (price) => {
    if (!exchangeRates[currency]) return price;
    return (price * exchangeRates[currency]).toFixed(2);
  };

  return (
    <Router>
      <div id="root">
        <Header cartCount={cart.length} currency={currency} setCurrency={setCurrency} exchangeRates={exchangeRates} />
        {showMessage && (
          <Alert variant="success" className="success-message">
            Item added to cart successfully!
          </Alert>
        )}
        <div className="content">
          <Routes>
            <Route path="/" element={<Menu items={items} addToCart={addToCart} convertPrice={convertPrice} currency={currency} />} />
            <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} convertPrice={convertPrice} currency={currency} placeOrder={placeOrder} />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
