const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000' // or the URL of your deployed React app
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

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
