const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000' // or whatever port your React app is running on
}));

let placedOrders = [];
let nextPlacedOrderId = 1;

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.post('/api/place-order', (req, res) => {
  const { items, tableNumber, timestamp } = req.body;
  
  if (!items || items.length === 0 || !tableNumber) {
    return res.status(400).json({ success: false, message: 'Invalid order data' });
  }

  const newPlacedOrder = {
    id: nextPlacedOrderId++,
    items,
    tableNumber,
    timestamp,
    status: 'Placed'
  };

  placedOrders.push(newPlacedOrder);

  res.json({ success: true, orderId: newPlacedOrder.id });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});