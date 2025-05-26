import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';

const BarcodeScanner = () => {
  const scannerRef = useRef(null);
  const [productName, setProductName] = useState('');
  const [ecoScore, setEcoScore] = useState('');
  const [labels, setLabels] = useState([]);
  const [suggestion, setSuggestion] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [isFavourite, setIsFavourite] = useState(false);
  const navigate = useNavigate();

  const getFavourites = () => {
    const stored = localStorage.getItem('favourites');
    return stored ? JSON.parse(stored) : [];
  };

  const updateFavourites = (newFavourites) => {
    localStorage.setItem('favourites', JSON.stringify(newFavourites));
  };

  const toggleFavourite = () => {
    const currentFavourites = getFavourites();
    if (isFavourite) {
      const updated = currentFavourites.filter(p => p.barcode !== barcode);
      updateFavourites(updated);
      setIsFavourite(false);
    } else {
      const newItem = { barcode, productName, ecoScore };
      const updated = [...currentFavourites, newItem];
      updateFavourites(updated);
      setIsFavourite(true);
    }
  };

  const checkIfFavourite = (barcodeToCheck) => {
    const currentFavourites = getFavourites();
    return currentFavourites.some(p => p.barcode === barcodeToCheck);
  };

  const handleDecodedText = async (decodedText) => {
    if (!scannerRef.current) return;

    await scannerRef.current.stop();
    setBarcode(decodedText);

    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${decodedText}.json`,
        {
          headers: {
            "User-Agent": "UniProject/1.0 331418@via.dk"
          }
        }
      );
      const data = await response.json();

      if (data.status === 1) {
        const name = data.product.product_name || 'Unknown Product';
        const score = data.product.ecoscore_grade?.toUpperCase() || 'N/A';
        const rawLabels = data.product.labels || '';
        const productLabels = rawLabels
          .split(',')
          .map(label => label.trim())
          .filter(label => label.length > 0);

        setProductName(name);
        setEcoScore(score);
        setLabels(productLabels);
        setIsFavourite(checkIfFavourite(decodedText));
        setShowOverlay(true);

        if (score !== 'A') {
          setSuggestion('Try this instead: organic chocolate');
        } else {
          setSuggestion('');
        }

      } else {
        setProductName('Product not found');
        setEcoScore('');
        setLabels([]);
        setSuggestion('');
        setIsFavourite(false);
        setShowOverlay(true);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setProductName('Error fetching product');
      setEcoScore('');
      setLabels([]);
      setSuggestion('');
      setIsFavourite(false);
      setShowOverlay(true);
    }
  };

  const restartScanner = async () => {
    if (scannerRef.current) {
      setShowOverlay(false);
      try {
        const devices = await Html5Qrcode.getCameras();
        const cameraId = devices.find(device => device.label.toLowerCase().includes('back'))?.id || devices[0].id;

        await scannerRef.current.start(
          cameraId,
          {
            fps: 10,
            qrbox: { width: 300, height: 100 },
            aspectRatio: 1.777,
          },
          handleDecodedText,
          (errorMessage) => {
            console.warn("Scan error:", errorMessage);
          }
        );
      } catch (err) {
        console.error("Restart scanner error:", err);
      }
    }
  };

  useEffect(() => {
    const scanner = new Html5Qrcode("reader");

    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        const cameraId = devices.find(device => device.label.toLowerCase().includes('back'))?.id || devices[0].id;

        scanner.start(
          cameraId,
          {
            fps: 10,
            qrbox: { width: 300, height: 100 },
            aspectRatio: 1.777,
          },
          handleDecodedText,
          (errorMessage) => {
            console.warn("Scan error:", errorMessage);
          }
        );

        scannerRef.current = scanner;
      }
    });

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().then(() => {
          scannerRef.current.clear();
        });
      }
    };
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <h1>Scan a Barcode</h1>
      <div id="reader" style={{ width: '320px', margin: '0 auto' }}></div>

      <button
        onClick={() => navigate('/receipt')}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          backgroundColor: '#007BFF',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Go to Receipt Scanner
      </button>

      <button
        onClick={() => navigate('/favourites')}
        style={{
          marginLeft: '1rem',
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          backgroundColor: '#6f42c1',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Go to Favourites
      </button>

      {showOverlay && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            maxWidth: '320px',
            margin: '1rem auto',
            backgroundColor: {
              A: '#3CB371',
              B: '#9ACD32',
              C: '#FFD700',
              D: '#FFA500',
              E: '#FF4500',
            }[ecoScore] || '#ccc',
            color: {
              A: 'white',
              E: 'white',
            }[ecoScore] || 'black',
            textAlign: 'center'
          }}
        >
          <h2>{productName}</h2>
          {ecoScore && <p>Eco Score: <strong>{ecoScore}</strong></p>}

          {labels.length > 0 && (
            <div style={{ marginTop: '0.5rem' }}>
              <p>Labels:</p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {labels.map((label, idx) => (
                  <li key={idx} style={{
                    backgroundColor: '#eee',
                    margin: '0.2rem 0',
                    padding: '0.3rem',
                    borderRadius: '4px'
                  }}>
                    {label.replace(/-/g, ' ')}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {suggestion && (
            <div style={{ marginTop: '1rem', backgroundColor: '#f0f0f0', padding: '0.5rem', borderRadius: '5px' }}>
              <strong>{suggestion}</strong>
            </div>
          )}

          {productName === 'Product not found' && (
            <button
              onClick={() => navigate('/submit')}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                fontSize: '1rem',
                backgroundColor: '#ff6347',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Submit Product Info
            </button>
          )}

          <button
            onClick={toggleFavourite}
            style={{
              marginTop: '0.5rem',
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              backgroundColor: isFavourite ? '#dc3545' : '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            {isFavourite ? 'Remove from Favourites' : 'Add to Favourites'}
          </button>

          <button
            onClick={restartScanner}
            style={{
              marginTop: '0.5rem',
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Scan Again
          </button>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
