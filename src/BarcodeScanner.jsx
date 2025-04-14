import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeScanner } from 'html5-qrcode';

const BarcodeScanner = () => {
  const scannerRef = useRef(null);
  const [productName, setProductName] = useState('');
  const [ecoScore, setEcoScore] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const scanner = new Html5Qrcode("reader");

    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        const cameraId = devices.find(device => device.label.toLowerCase().includes('back'))?.id || devices[0].id;

        scanner.start(
          cameraId,
          {
            fps: 10,
            qrbox: { width: 300, height: 300 },
            aspectRatio: 1.777,
          },
          async (decodedText) => {
            // Stop after first successful scan
            await scanner.stop();
            console.log("Scanned code:", decodedText);

            // Lookup product by barcode
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

                setProductName(name);
                setEcoScore(score);
                setShowOverlay(true);
              } else {
                setProductName('Product not found');
                setEcoScore('');
                setShowOverlay(true);
              }
            } catch (err) {
              console.error("Fetch error:", err);
              setProductName('Error fetching product');
              setEcoScore('');
              setShowOverlay(true);
            }
          },
          (errorMessage) => {
            // Scanning error (optional to log)
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
    }}
  >
    <h2>{productName}</h2>
    {ecoScore && <p>Eco Score: <strong>{ecoScore}</strong></p>}
      </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
