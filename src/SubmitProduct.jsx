import React from 'react';
import { useNavigate } from 'react-router-dom';

const SubmitProduct = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thanks! The product will be reviewed and added soon.");
    navigate('/my-barcode-scanner');
  };

  return (
    <div style={{ padding: '1rem', textAlign: 'center' }}>
      <h1>Submit Product Info</h1>
      <p>Help us improve by adding info for products not found in our database.</p>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '400px',
          margin: '0 auto'
        }}
      >
        <input type="text" placeholder="Product Name" required style={{ margin: '0.5rem 0' }} />
        <input type="text" placeholder="Brand" required style={{ margin: '0.5rem 0' }} />
        <textarea placeholder="Ingredients / Description" rows="4" style={{ margin: '0.5rem 0' }} />
        <input type="file" accept="image/*" style={{ margin: '0.5rem 0' }} />
        <button
          type="submit"
          style={{
            padding: '0.5rem',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px'
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default SubmitProduct;
