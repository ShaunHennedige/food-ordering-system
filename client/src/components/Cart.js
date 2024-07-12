import React, { useState } from 'react';
import { Container, ListGroup, Button, Row, Col, Alert, Form, Card } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';

const Cart = ({ cart, removeFromCart, convertPrice, currency, placeOrder }) => {
  const [tableNumber, setTableNumber] = useState('');
  const [pax, setPax] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [roomNumber, setRoomNumber] = useState('');

  const calculateTotal = () => {
    return cart.reduce((acc, item) => {
      const price = parseFloat(convertPrice(item.price));
      return acc + price;
    }, 0);
  };

  const handlePlaceOrder = () => {
    if (tableNumber.trim() === '') {
      alert('Please enter a table number');
      return;
    }

    // Validate other required fields like name and contact number as needed

    const orderInfo = {
      tableNumber,
      pax,
      contactNumber,
      roomNumber
    };

    placeOrder(orderInfo);
    setTableNumber('');
    setPax('');
    setContactNumber('');
    setRoomNumber('');
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <h2 className="font-weight-bold mb-4">Your Food Order</h2>
          {cart.length === 0 && (
            <Alert variant="warning">Your order is empty.</Alert>
          )}
          {cart.length > 0 && (
            <>
              <ListGroup className="my-4">
                <ListGroup.Item className="font-weight-bold text-primary">
                  <Row>
                    <Col className="font-weight-bold">Item</Col>
                    <Col className="font-weight-bold">Added On</Col>
                    <Col className="font-weight-bold text-right">Price</Col>
                    <Col xs={1}></Col>
                  </Row>
                </ListGroup.Item>
                {cart.map((item, index) => (
                  <ListGroup.Item key={index}>
                    <Row className="align-items-center">
                      <Col>{item.name}</Col>
                      <Col>
                        {new Date(item.timestamp).toLocaleString()}
                      </Col>
                      <Col className="text-right">
                        {convertPrice(item.price)} {currency}
                      </Col>
                      <Col xs={1}>
                        <Button
                          variant="link"
                          onClick={() => removeFromCart(index)}
                          className="p-0"
                        >
                          <FaTrash className="text-danger" />
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item className="font-weight-bold text-primary">
                  <Row>
                    <Col className="font-weight-bold">Total</Col>
                    <Col></Col>
                    <Col className="font-weight-bold text-right">
                      {calculateTotal().toFixed(2)} {currency}
                    </Col>
                    <Col xs={1}></Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup> 
                <Form.Group as={Row} controlId="roomNumber">
                  <Form.Label column sm={4}>Room Number (if applicable)</Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      type="text"
                      placeholder="Enter room number"
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                    />
                  </Col>
                </Form.Group><br></br>
                <Form.Group as={Row} controlId="tableNumber">
                  <Form.Label column sm={4}>Table Number</Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      type="text"
                      placeholder="Enter table number"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                    />
                  </Col>
                </Form.Group>
                <Form className="mt-4">
                <Form.Group as={Row} controlId="pax">
                  <Form.Label column sm={4}>Number of Pax</Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      type="text"
                      placeholder="Number of Pax"
                      value={pax}
                      onChange={(e) => setPax(e.target.value)}
                    />
                  </Col>
                </Form.Group><br></br>
                <Form.Group as={Row} controlId="contactNumber">
                  <Form.Label column sm={4}>Contact Number</Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      type="text"
                      placeholder="Enter contact number"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                    />
                  </Col>
                </Form.Group>
                <Row className="justify-content-center mt-4">
                  <Col sm={6} className="text-center">
                    <Button variant="primary" onClick={handlePlaceOrder}>
                      Place the Order
                    </Button>
                  </Col>
                </Row>
              </Form>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Cart;
