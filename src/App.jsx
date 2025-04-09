import React, { useState } from 'react';
import './App.css';
import BarcodeReader from 'react-barcode-reader';

function App() {
  const [barcode, setBarcode] = useState('');

  // Handle barcode scanning
  const handleScan = (data) => {
    if (data) {
      setBarcode(data);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div className="App">
      <h1>Barcode Scanner</h1>
      <div className="scanner">
        <BarcodeReader
          onScan={handleScan}
          onError={handleError}
          facingMode="environment"
        />
      </div>
      <div className="result">
        {barcode && <p>Scanned Barcode: {barcode}</p>}
      </div>
    </div>
  );
}

export default App;
