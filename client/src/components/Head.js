import React from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

const Header = ({ cartCount, currency, setCurrency, exchangeRates }) => {
  const currencies = Object.keys(exchangeRates);

  const handleChangeCurrency = (newCurrency) => {
    setCurrency(newCurrency);
  };

  return (
    <Navbar className="custom-navbar" expand="lg"> {/* Added custom class */}
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src="/android-chrome-512x512.png" // Ensure the path is correct
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="Citrus PMS Logo" // Provide a meaningful alt attribute
          />
          {' '}
          Citrus PMS - Food Ordering System
        </Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/cart" className="d-flex align-items-center mr-lg-3">
            <FaShoppingCart size={20} />
            {cartCount > 0 && <span className="ml-1">{cartCount}</span>}
          </Nav.Link>
        </Nav>
        <Dropdown>
          <Dropdown.Toggle variant="light" id="currency-dropdown">
            {currency}
          </Dropdown.Toggle>
          <Dropdown.Menu style={{ minWidth: 'auto' }}>
            <Dropdown.Divider />
            <input
              type="text"
              className="form-control dropdown-item"
              onChange={(e) => handleChangeCurrency(e.target.value)}
              placeholder="Type"
            />
            {currencies
              .filter((curr) => curr.toLowerCase().includes(currency.toLowerCase()))
              .map((curr) => (
                <Dropdown.Item key={curr} onClick={() => handleChangeCurrency(curr)}>
                  {curr}
                </Dropdown.Item>
              ))}
          </Dropdown.Menu>
        </Dropdown>
      </Container>
    </Navbar>
  );
};

export default Header;
