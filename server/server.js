// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000' // or the URL of your deployed React app
}));

let orders = [];
let nextOrderId = 1;

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.post('/api/place-order', (req, res) => {
  const { items, tableNumber, pax, contactNumber, roomNumber } = req.body;
  
  if (!items || items.length === 0 || !tableNumber) {
    return res.status(400).json({ success: false, message: 'Invalid order data' });
  }

  const newOrder = {
    id: nextOrderId++,
    items,
    tableNumber,
    pax,
    contactNumber,
    roomNumber,
    timestamp: new Date().toISOString(),
    status: 'Placed'
  };

  orders.push(newOrder);
  res.json({ success: true, orderId: newOrder.id });
});

app.get('/api/orders', (req, res) => {
  res.json(orders);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});