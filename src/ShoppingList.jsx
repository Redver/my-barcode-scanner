import React, { useState, useEffect } from 'react';

const ShoppingList = () => {
  const [items, setItems] = useState([]);

  // Load list from localStorage on mount
  useEffect(() => {
    const storedList = JSON.parse(localStorage.getItem('shoppingList') || '[]');
    setItems(storedList);
  }, []);

  // Save list to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(items));
  }, [items]);

  const toggleChecked = (index) => {
    const updated = [...items];
    updated[index].checked = !updated[index].checked;
    setItems(updated);
  };

  const removeItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Shopping List</h1>
      {items.length === 0 ? (
        <p>Your shopping list is empty.</p>
      ) : (
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {items.map((item, idx) => (
            <li
              key={idx}
              style={{
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                textDecoration: item.checked ? 'line-through' : 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                border: '1px solid #ccc',
                borderRadius: '5px',
                backgroundColor: item.checked ? '#e0ffe0' : 'white',
                color: 'black', 
              }}
            >
              <span onClick={() => toggleChecked(idx)}>
                {item.productName} (Eco Score: {item.ecoScore})
              </span>
              <button
                onClick={() => removeItem(idx)}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  padding: '0.3rem 0.6rem',
                  marginLeft: '1rem',
                }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShoppingList;
