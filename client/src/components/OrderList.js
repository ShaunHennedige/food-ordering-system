// src/components/OrderList.js
import React, { useState, useEffect } from 'react';
import { Container, ListGroup, Card } from 'react-bootstrap';

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    fetch('http://localhost:3001/api/orders')
      .then(response => response.json())
      .then(data => {
        setOrders(data);
      })
      .catch(error => console.error('Error fetching orders:', error));
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <h2 className="font-weight-bold mb-4">Order List</h2>
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <ListGroup>
              {orders.map(order => (
                <ListGroup.Item key={order.id}>
                  <h5>Order #{order.id}</h5>
                  <p>Table: {order.tableNumber}</p>
                  <p>Pax: {order.pax}</p>
                  <p>Contact: {order.contactNumber}</p>
                  {order.roomNumber && <p>Room: {order.roomNumber}</p>}
                  <p>Status: {order.status}</p>
                  <p>Timestamp: {new Date(order.timestamp).toLocaleString()}</p>
                  <h6>Items:</h6>
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.name} - Quantity: {item.quantity}, Price: {item.price}
                      </li>
                    ))}
                  </ul>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OrderList;