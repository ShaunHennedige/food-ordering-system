import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { BsCartPlus } from 'react-icons/bs'; // Import the cart icon from react-icons

const Menu = ({ items, addToCart, convertPrice, currency }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  // Function to group items by subcategory
  const groupItemsBySubcategory = () => {
    const groupedItems = {};
    items.forEach((item) => {
      if (!groupedItems[item.subcategory]) {
        groupedItems[item.subcategory] = [];
      }
      groupedItems[item.subcategory].push(item);
    });
    return groupedItems;
  };

  const groupedItems = groupItemsBySubcategory();

  // Function to filter items by subcategory
  const handleFilterBySubcategory = (subcategory) => {
    setSelectedSubcategory(subcategory === selectedSubcategory ? null : subcategory);
  };

  // Function to render items based on selected subcategory or all items if no subcategory selected
  const renderItems = () => {
    if (selectedSubcategory === null) {
      // Render items grouped by subcategory
      return Object.keys(groupedItems).map((subcategory, index) => (
        <div key={index}>
          <h2>{subcategory}</h2>
          <div className="row">
            {groupedItems[subcategory].map((item, itemIndex) => (
              <div key={itemIndex} className="col-md-4">
                <Card
                  className="mb-4"
                  onMouseEnter={() => handleMouseEnter(itemIndex)}
                  onMouseLeave={handleMouseLeave}
                  style={{ boxShadow: hoveredIndex === itemIndex ? '0px 0px 15px 0px rgba(0,0,0,0.5)' : 'none' }}
                >
                  <Card.Img variant="top" src={item.image} style={{ height: '200px', objectFit: 'cover' }} />
                  <Card.Body>
                    <Card.Title style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{item.name}</Card.Title>
                    <Card.Text style={{ marginBottom: '10px' }}>
                      {convertPrice(item.price, currency)} {currency}
                    </Card.Text>
                    <BsCartPlus
                      size={24}
                      style={{
                        cursor: 'pointer',
                        color: hoveredIndex === itemIndex ? '#007bff' : '#6c757d',
                        transition: 'color 0.3s ease',
                        marginRight: '10px',
                      }}
                      onClick={() => addToCart(item)}
                    />
                    <span
                      style={{
                        fontSize: '0.9rem',
                        color: '#6c757d',
                        verticalAlign: 'middle',
                        display: 'inline-block',
                      }}
                    >
                      Add to Cart
                    </span>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        </div>
      ));
    } else {
      // Render items for the selected subcategory
      return (
        <div>
          <h2>{selectedSubcategory}</h2>
          <div className="row">
            {items
              .filter((item) => item.subcategory === selectedSubcategory)
              .map((item, itemIndex) => (
                <div key={itemIndex} className="col-md-4">
                  <Card
                    className="mb-4"
                    onMouseEnter={() => handleMouseEnter(itemIndex)}
                    onMouseLeave={handleMouseLeave}
                    style={{ boxShadow: hoveredIndex === itemIndex ? '0px 0px 15px 0px rgba(0,0,0,0.5)' : 'none' }}
                  >
                    <Card.Img variant="top" src={item.image} style={{ height: '200px', objectFit: 'cover' }} />
                    <Card.Body>
                      <Card.Title style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{item.name}</Card.Title>
                      <Card.Text style={{ marginBottom: '10px' }}>
                        {convertPrice(item.price, currency)} {currency}
                      </Card.Text>
                      <BsCartPlus
                        size={24}
                        style={{
                          cursor: 'pointer',
                          color: hoveredIndex === itemIndex ? '#007bff' : '#6c757d',
                          transition: 'color 0.3s ease',
                          marginRight: '10px',
                        }}
                        onClick={() => addToCart(item)}
                      />
                      <span
                        style={{
                          fontSize: '0.9rem',
                          color: '#6c757d',
                          verticalAlign: 'middle',
                          display: 'inline-block',
                        }}
                      >
                        Add to Cart
                      </span>
                    </Card.Body>
                  </Card>
                </div>
              ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="container mt-5">
      {/* Filter buttons */}
      <div className="mb-3">
        <button
          className={`btn ${selectedSubcategory === null ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => handleFilterBySubcategory(null)}
        >
          All
        </button>
        {Object.keys(groupedItems).map((subcategory, index) => (
          <button
            key={index}
            className={`btn ${selectedSubcategory === subcategory ? 'btn-primary' : 'btn-outline-primary'}`}
            style={{ marginLeft: '10px' }}
            onClick={() => handleFilterBySubcategory(subcategory)}
          >
            {subcategory}
          </button>
        ))}
      </div>

      {/* Display filtered items */}
      {renderItems()}
    </div>
  );
};

export default Menu;
