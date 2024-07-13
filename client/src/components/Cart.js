import React, { useState, useEffect } from 'react';
import { Container, ListGroup, Button, Row, Col, Alert, Form, Card } from 'react-bootstrap';
import { FaTrash, FaPlus, FaFilePdf } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const Cart = ({ cart, removeFromCart, convertPrice, currency, placeOrder }) => {
  const [tableNumber, setTableNumber] = useState('');
  const [pax, setPax] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);
  const [orderTimestamp, setOrderTimestamp] = useState(null);
  const [orderNumber, setOrderNumber] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setOrderNumber(generateOrderNumber());
  }, []);

  const generateOrderNumber = () => {
    return 'ORD-' + Math.floor(100000 + Math.random() * 900000);
  };

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

    const orderInfo = {
      tableNumber,
      pax,
      contactNumber,
      roomNumber
    };

    const timestamp = new Date().toLocaleString();
    setOrderTimestamp(timestamp);
    setPlacedOrder({ ...orderInfo, items: [...cart], total: calculateTotal() });
    placeOrder(orderInfo);
    clearForm();
  };

  const clearForm = () => {
    setTableNumber('');
    setPax('');
    setContactNumber('');
    setRoomNumber('');
  };

  const handleNewOrder = () => {
    setPlacedOrder(null);
    setOrderTimestamp(null);
    setOrderNumber(generateOrderNumber());
    navigate('/');
  };

  const handleSavePdf = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Order Details', 14, 22);

    doc.setFontSize(12);
    doc.text(`Order Number: ${orderNumber}`, 14, 32);
    doc.text(`Order Date: ${orderTimestamp}`, 14, 38);
    doc.text(`Table Number: ${placedOrder.tableNumber}`, 14, 44);
    doc.text(`Number of Pax: ${placedOrder.pax}`, 14, 50);
    doc.text(`Contact Number: ${placedOrder.contactNumber}`, 14, 56);
    if (placedOrder.roomNumber) {
      doc.text(`Room Number: ${placedOrder.roomNumber}`, 14, 62);
    }

    const tableData = placedOrder.items.map((item, index) => [
      index + 1,
      item.name,
      convertPrice(item.price) + ' ' + currency
    ]);

    doc.autoTable({
      head: [['#', 'Item', 'Price']],
      body: tableData,
      startY: 70,
    });

    doc.text(`Total: ${placedOrder.total.toFixed(2)} ${currency}`, 14, doc.autoTable.previous.finalY + 10);

    doc.save(`invoice_${orderNumber}.pdf`);
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <h2 className="font-weight-bold mb-4">Your Food Order</h2>
          {placedOrder ? (
            <>
              <Alert variant="success">
                Order placed successfully at {orderTimestamp}
              </Alert>
              <h3>Placed Order Details:</h3>
              <ListGroup className="my-4">
                <ListGroup.Item>
                  <strong>Table Number:</strong> {placedOrder.tableNumber}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Number of Pax:</strong> {placedOrder.pax}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Contact Number:</strong> {placedOrder.contactNumber}
                </ListGroup.Item>
                {placedOrder.roomNumber && (
                  <ListGroup.Item>
                    <strong>Room Number:</strong> {placedOrder.roomNumber}
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  <strong>Items:</strong>
                  <ul>
                    {placedOrder.items.map((item, index) => (
                      <li key={index}>
                        {item.name} - {convertPrice(item.price)} {currency}
                      </li>
                    ))}
                  </ul>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Total:</strong> {placedOrder.total.toFixed(2)} {currency}
                </ListGroup.Item>
              </ListGroup>
              <Button variant="primary" onClick={handleNewOrder} style={{ marginRight: '8px' }}>
                <FaPlus className="mr-2" /> Start New Order
              </Button>
              <Button variant="secondary" onClick={handleSavePdf}>
                <FaFilePdf className="mr-2" /> Save as PDF
              </Button>
            </>
          ) : (
            <>
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
                  <Form className="mt-4">
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
                    </Form.Group><br></br>
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
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Cart
