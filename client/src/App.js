import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Head';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Footer from './components/Footer';
import POSCenterSelection from './components/POSCenterSelection';
import './App.css';

const App = () => {
  const [items, setItems] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({});
  const [showMessage, setShowMessage] = useState(false);
  const [currency, setCurrency] = useState('LKR');
  const [cart, setCart] = useState([]);
  const [selectedPOSCenter, setSelectedPOSCenter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [pin, setPin] = useState('1234');
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [pinRequired, setPinRequired] = useState(true);

  const handlePinChange = (event) => {
    setEnteredPin(event.target.value);
    setPinError(false);
  };

  const validatePin = () => {
    if (enteredPin === pin) {
      setPinRequired(false);
    } else {
      setPinError(true);
    }
  };

  useEffect(() => {
    if (selectedPOSCenter) {
      setLoading(true);
      setError(null);
      fetch('https://mani.citruspms.site/API/POS_GetItemList.aspx')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('API Response:', data);
          if (!Array.isArray(data)) {
            throw new Error('API did not return an array');
          }
          const filteredItems = data.filter(item => item.POSCenterCode === selectedPOSCenter);
          console.log('Filtered Items:', filteredItems);
          setItems(filteredItems);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching food items:', error);
          setError('Failed to load menu items. Please try again.');
          setLoading(false);
        });
    }
  }, [selectedPOSCenter]);

  useEffect(() => {
    fetch('https://api.exchangerate-api.com/v4/latest/LKR')
      .then(response => response.json())
      .then(data => setExchangeRates(data.rates))
      .catch(error => console.error('Error fetching exchange rates:', error));
  }, []);

  const addToCart = (item, quantity) => {
    const updatedItem = { ...item, quantity, timestamp: new Date().getTime() };
    setCart(prevCart => [...prevCart, updatedItem]);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  const removeFromCart = (itemIndex) => {
    setCart(prevCart => prevCart.filter((_, index) => index !== itemIndex));
  };

  const placeOrder = (tableNumber) => {
    console.log(`Order placed for table ${tableNumber}`);
    setCart([]);
  };

  const convertPrice = (price) => {
    if (!exchangeRates[currency]) return price;
    return (price * exchangeRates[currency]).toFixed(2);
  };

  const handlePOSCenterSelect = (centerID, centerCode) => {
    console.log('handlePOSCenterSelect called with:', { centerID, centerCode });
    if (!pinRequired) {
      if (centerID && centerCode) {
        console.log('Selected POS Center:', centerID, 'Code:', centerCode);
        setSelectedPOSCenter(centerCode);
      } else {
        console.log('No POS Center selected');
        setSelectedPOSCenter(null);
      }
    }
  };

  const handleBackToPOSCenters = () => {
    setSelectedPOSCenter(null);
  };

  return (
    <Router>
      <div id="root">
        <Header cartCount={cart.length} currency={currency} setCurrency={setCurrency} exchangeRates={exchangeRates} />
        {showMessage && (
          <div className="snackbar">
            Item added to cart successfully!
          </div>
        )}

        <div className="content">
          <Routes>
            <Route
              path="/"
              element={
                <div className="center-screen">
                  {pinRequired ? (
                    <div className="card mx-auto mt-5" style={{ maxWidth: '400px' }}>
                      <div className="card-body">
                        <h3 className="card-title mb-4">Enter PIN to Proceed</h3>
                        <input type="password" value={enteredPin} onChange={handlePinChange} className="form-control mb-3" placeholder="Enter PIN" />
                        {pinError && <p className="error-message">Incorrect PIN. Please try again.</p>}
                        <button onClick={validatePin} className="btn btn-primary">Enter</button>
                      </div>
                    </div>
                  ) : selectedPOSCenter === null ? (
                    <POSCenterSelection onSelect={handlePOSCenterSelect} />
                  ) : loading ? (
                    <div>Loading menu items...</div>
                  ) : error ? (
                    <div>{error}</div>
                  ) : (
                    <Menu
                      items={items}
                      addToCart={addToCart}
                      convertPrice={convertPrice}
                      currency={currency}
                      onBackClick={handleBackToPOSCenters}
                    />
                  )}
                </div>
              }
            />
            <Route
              path="/cart"
              element={
                selectedPOSCenter ? (
                  <Cart
                    cart={cart}
                    removeFromCart={removeFromCart}
                    convertPrice={convertPrice}
                    currency={currency}
                    placeOrder={placeOrder}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;