import React, { useRef, useState } from 'react';

const MOCK_PRODUCTS = [
  { name: 'Organic Milk', ecoScore: 'A' },
  { name: 'Beef Steak', ecoScore: 'E' },
  { name: 'Pasta', ecoScore: 'C' },
  { name: 'Broccoli', ecoScore: 'A' },
  { name: 'Coca Cola', ecoScore: 'D' },
];

const bgColor = {
  A: '#3CB371',
  B: '#9ACD32',
  C: '#FFD700',
  D: '#FFA500',
  E: '#FF4500',
};

const textColor = {
  A: 'white',
  E: 'white',
};

const MockReceiptScanner = () => {
  const videoRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
    });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  };

  const takePicture = () => {
    setProducts(MOCK_PRODUCTS);
    setShowOverlay(true);
  };

  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <h1>Upload Receipt</h1>
      <video ref={videoRef} style={{ width: '100%', maxWidth: '400px' }} />
      <br />
      <button onClick={startCamera}>Start Camera</button>
      <button onClick={takePicture}>Take Picture</button>

      {showOverlay && (
        <div style={{ marginTop: '1rem' }}>
          <h2>Detected Products</h2>
          {products.map((p, i) => (
            <div
              key={i}
              style={{
                margin: '0.5rem auto',
                padding: '1rem',
                borderRadius: '8px',
                boxShadow: '0 0 10px rgba(0,0,0,0.2)',
                backgroundColor: bgColor[p.ecoScore] || '#ccc',
                color: textColor[p.ecoScore] || 'black',
                maxWidth: '320px',
              }}
            >
              <h3>{p.name}</h3>
              <p>Eco Score: <strong>{p.ecoScore}</strong></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MockReceiptScanner;
