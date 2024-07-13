import React, { useState } from 'react';
import { Card, Accordion } from 'react-bootstrap';
import { BsCartPlus } from 'react-icons/bs';

const Menu = ({ items, addToCart, convertPrice, currency }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItem, setExpandedItem] = useState(null); // Track expanded item index
  const [itemQuantities, setItemQuantities] = useState({});

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

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

  const handleFilterBySubcategory = (subcategory) => {
    setSelectedSubcategory(subcategory === selectedSubcategory ? null : subcategory);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filterItems = (itemsToFilter) => {
    return itemsToFilter.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const toggleDetails = (index) => {
    if (expandedItem === index) {
      setExpandedItem(null); // Collapse if already expanded
    } else {
      setExpandedItem(index); // Expand clicked card
    }
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
              onClick={() => toggleDetails(itemIndex)} // Toggle details on click
            >
              <Card.Img
                variant="top"
                src={item.image}
                className={`card-image ${expandedItem === itemIndex ? 'card-image-expanded' : ''}`}
              />
              <Card.Body>
                <Card.Title style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{item.name}</Card.Title>
                <Card.Text style={{ marginBottom: '10px' }}>
                  {convertPrice(item.price, currency)} {currency}
                </Card.Text>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="input-group" style={{ width: '150px' }}>
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => handleQuantityChange(item.id, Math.max((itemQuantities[item.id] || 0) - 1, 0))}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      className="form-control text-center"
                      value={itemQuantities[item.id] || 0}
                      readOnly
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => handleQuantityChange(item.id, (itemQuantities[item.id] || 0) + 1)}
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
                      e.stopPropagation(); // Prevent card click from triggering toggleDetails
                      addToCart(item, itemQuantities[item.id] || 0);
                    }}
                  />
                </div>
              </Card.Body>
              <Accordion.Collapse eventKey={`item-details-${itemIndex}`} in={expandedItem === itemIndex}>
                <Card.Body>
                  <p>Description: {item.description}</p>
                  <p>Ingredients: {item.ingredients}</p>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </div>
        ))}
      </div>
    );
  };

  const renderGroupedItems = () => {
    return Object.keys(groupedItems).map((subcategory, index) => {
      const filteredSubcategoryItems = filterItems(groupedItems[subcategory]);
      return (
        <div key={index} className="mb-4">
          <h5>{subcategory}</h5>
          {filteredSubcategoryItems.length === 0 ? (
            <p className="text-muted">No items available in this section.</p>
          ) : (
            renderItems(filteredSubcategoryItems)
          )}
        </div>
      );
    });
  };

  const filteredItems = selectedSubcategory
    ? filterItems(items.filter((item) => item.subcategory === selectedSubcategory))
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

      {selectedSubcategory === null ? (
        renderGroupedItems()
      ) : (
        filteredItems.length === 0 ? (
          <p className="text-muted">No items available in this section.</p>
        ) : (
          renderItems(filteredItems)
        )
      )}
    </div>
  );
};

export default Menu;
