import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BarcodeScanner from './BarcodeScanner';
import MockReceiptScanner from './MockReceiptScanner';

const App = () => {
  return (
    <Router>
      <nav style={{ padding: '1rem', textAlign: 'center' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Scan Barcode</Link>
        <Link to="/receipt">Upload Receipt</Link>
      </nav>

      <Routes>
        <Route path="/" element={<BarcodeScanner />} />
        <Route path="/receipt" element={<MockReceiptScanner />} />
      </Routes>
    </Router>
  );
};

export default App;
