import React from 'react';
import { Form } from 'react-bootstrap';

const CurrencyConverter = ({ currency, setCurrency, exchangeRates }) => {
  const currencies = Object.keys(exchangeRates);

  return (
    <div className="container mt-3">
      <Form>
        <Form.Group controlId="currencySelect">
          <Form.Label>Select Currency</Form.Label>
          <Form.Control
            as="select"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            {currencies.map((curr) => (
              <option key={curr} value={curr}>
                {curr}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </Form>
    </div>
  );
};

export default CurrencyConverter;
