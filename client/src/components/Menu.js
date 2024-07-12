import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { BsCartPlus } from 'react-icons/bs';

const Menu = ({ items, addToCart, convertPrice, currency }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
                    color: '#6c757d',
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