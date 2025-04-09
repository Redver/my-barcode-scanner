import React, { useState } from 'react';
import './App.css';
import ReactQRScanner from 'react-qr-scanner';

function App() {
  const [barcode, setBarcode] = useState('');

  // Handle scan
  const handleScan = (data) => {
    if (data) {
      setBarcode(data.text);
      console.log('Scanned Barcode:', data.text);  // Log the scanned barcode
    }
  };

  // Handle error
  const handleError = (err) => {
    console.error(err);
  };

  // Log facing mode when the component mounts
  React.useEffect(() => {
    console.log('Initializing QR scanner with back camera (facingMode: environment)');
  }, []);

  return (
    <div className="App">
      <h1>Barcode Scanner</h1>
      <div className="scanner">
        <ReactQRScanner
          delay={300}  // Delay in ms to optimize the scanning
          facingMode="rear"  // Set the camera to the back camera (environment mode)
          onError={handleError}
          onScan={handleScan}
        />
      </div>
      <div className="result">
        {barcode && <p>Scanned Barcode: {barcode}</p>}
      </div>
    </div>
  );
}

export default App;
