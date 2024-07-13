import React, { useState } from 'react';
import { Card, Accordion } from 'react-bootstrap';
import { BsCartPlus } from 'react-icons/bs';

const Menu = ({ items, addToCart, convertPrice, currency }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItem, setExpandedItem] = useState(null);
  const [itemQuantities, setItemQuantities] = useState({});

  if (!items || items.length === 0) {
    return <div className="container mt-5">No menu items available for this POS center.</div>;
  }

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const groupItemsByCategory = () => {
    const groupedItems = {};
    items.forEach((item) => {
      if (!groupedItems[item.CategoryName]) {
        groupedItems[item.CategoryName] = [];
      }
      groupedItems[item.CategoryName].push(item);
    });
    return groupedItems;
  };

  const groupedItems = groupItemsByCategory();

  const handleFilterByCategory = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filterItems = (itemsToFilter) => {
    return itemsToFilter.filter((item) =>
      item.ItemName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const toggleDetails = (index) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  const handleQuantityChange = (itemId, quantity) => {
    setItemQuantities({ ...itemQuantities, [itemId]: quantity });
  };

  const renderItems = (itemsToRender) => {
    if (itemsToRender.length === 0) {
      return (
        <div className="col-12">
          <p className="text-muted">No items available in this section.</p>
        </div>
      );
    }

    return (
      <div className="row">
        {itemsToRender.map((item, itemIndex) => (
          <div key={itemIndex} className="col-md-4 mb-4">
            <Card
              className={`h-100 ${expandedItem === itemIndex ? 'card-expanded' : ''}`}
              onMouseEnter={() => handleMouseEnter(itemIndex)}
              onMouseLeave={handleMouseLeave}
              style={{ boxShadow: hoveredIndex === itemIndex ? '0px 0px 15px 0px rgba(0,0,0,0.5)' : 'none' }}
              onClick={() => toggleDetails(itemIndex)}
            >
              <Card.Img
                variant="top"
                src={item.ImageURL}
                className={`card-image ${expandedItem === itemIndex ? 'card-image-expanded' : ''}`}
              />
              <Card.Body>
                <Card.Title style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{item.ItemName}</Card.Title>
                <Card.Text style={{ marginBottom: '10px' }}>
                  {convertPrice(item.Price)} {currency}
                </Card.Text>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="input-group" style={{ width: '150px' }}>
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => handleQuantityChange(item.ItemNumber, Math.max((itemQuantities[item.ItemNumber] || 0) - 1, 0))}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      className="form-control text-center"
                      value={itemQuantities[item.ItemNumber] || 0}
                      readOnly
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => handleQuantityChange(item.ItemNumber, (itemQuantities[item.ItemNumber] || 0) + 1)}
                    >
                      +
                    </button>
                  </div>
                  <BsCartPlus
                    size={24}
                    style={{
                      cursor: 'pointer',
                      color: '#6c757d',
                      marginLeft: '10px',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const quantity = itemQuantities[item.ItemNumber] || 0;
                      if (quantity > 0) {
                        addToCart(item, quantity);
                      } else {
                        alert('Quantity must be greater than zero to add to cart.');
                      }
                    }}
                  />
                </div>
              </Card.Body>
              <Accordion.Collapse eventKey={`item-details-${itemIndex}`} in={expandedItem === itemIndex}>
                <Card.Body>
                  <p>Description: {item.Description}</p>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </div>
        ))}
      </div>
    );
  };
    const renderGroupedItems = () => {
      return Object.keys(groupedItems).map((category, index) => {
        const filteredCategoryItems = filterItems(groupedItems[category]);
        return (
          <div key={index} className="mb-4">
            <h5>{category}</h5>
            {filteredCategoryItems.length === 0 ? (
              <p className="text-muted">No items available in this section.</p>
            ) : (
              renderItems(filteredCategoryItems)
            )}
          </div>
        );
      });
    };
  
    const filteredItems = selectedCategory
      ? filterItems(items.filter((item) => item.CategoryName === selectedCategory))
      : filterItems(items);
  
    return (
      <div className="container mt-5">
        <div className="mb-3">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="form-control"
            style={{
              border: '2px solid #007bff',
              boxShadow: '0 0 10px rgba(0, 123, 255, 0.2)',
              padding: '10px',
              fontSize: '16px'
            }}
          />
        </div>
  
        <div className="mb-3 d-flex flex-wrap">
          <button
            className={`btn ${selectedCategory === null ? 'btn-primary' : 'btn-outline-primary'} mr-2 mb-2`}
            onClick={() => handleFilterByCategory(null)}
            style={{ marginBottom: '10px' }}
          >
            All
          </button>
          <span>&nbsp;</span> {/* This adds a space after the "All" button */}
          {Object.keys(groupedItems).map((category, index) => (
            <button
              key={index}
              className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-outline-primary'} mr-2 mb-2`}
              onClick={() => handleFilterByCategory(category)}
              style={{ marginRight: '10px', marginBottom: '10px' }}
            >
              {category}
            </button>
          ))}
        </div>
  
        {selectedCategory === null ? (
          renderGroupedItems()
        ) : (
          filteredItems.length === 0 ? (
            <p className="text-muted">No items available in this section.</p>
          ) : (
            renderItems(filteredItems)
          )
        )}
  
        <div style={{ marginTop: '20px' }}>
          {/* Add your additional content or buttons here */}
        </div>
      </div>
    );
  };
  
  export default Menu;