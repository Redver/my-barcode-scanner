// src/pages/Favourites.jsx
import React from 'react';

const Favourites = () => {
  const favourites = JSON.parse(localStorage.getItem('favourites') || '[]');

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Your Favourite Products</h1>
      {favourites.length === 0 ? (
        <p>No favourites yet.</p>
      ) : (
        <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
          {favourites.map((product, idx) => (
            <li
              key={idx}
              style={{
                marginBottom: '1rem',
                padding: '1rem',
                border: '1px solid #ccc',
                borderRadius: '5px'
              }}
            >
              <strong>{product.productName}</strong><br />
              Eco Score: <strong>{product.ecoScore}</strong>

              <button
                onClick={() => {
            // Get current shopping list from localStorage
            const currentList = JSON.parse(localStorage.getItem('shoppingList') || '[]');
            // Check if item already exists (by barcode or productName)
             if (!currentList.some(item => item.productName === product.productName)) {
               currentList.push({ productName: product.productName, ecoScore: product.ecoScore, checked: false });
               localStorage.setItem('shoppingList', JSON.stringify(currentList));
               alert(`${product.productName} added to shopping list.`);
             } else {
                alert(`${product.productName} is already in your shopping list.`);
              }
            }}
            style={{
              marginLeft: '1rem',
              padding: '0.3rem 0.6rem',
              fontSize: '0.9rem',
              cursor: 'pointer',
              borderRadius: '3px',
            }}
            >
              Add to Shopping List
            </button>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Favourites;


