import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BarcodeScanner from './BarcodeScanner';
import MockReceiptScanner from './MockReceiptScanner';
import SubmitProduct from './SubmitProduct';

const App = () => {
  return (
    <Router>
      <nav style={{ padding: '1rem', textAlign: 'center' }}>
        <Link to="/my-barcode-scanner" style={{ marginRight: '1rem' }}>Scan Barcode</Link>
        <Link to="/receipt">Upload Receipt  </Link>
        <Link to="/submit">Submit Product</Link>
      </nav>

      <Routes>
      <Route path="/submit" element={<SubmitProduct />} />
        <Route path="/my-barcode-scanner" element={<BarcodeScanner />} />
        <Route path="/receipt" element={<MockReceiptScanner />} />
      </Routes>
    </Router>
  );
};

export default App;
