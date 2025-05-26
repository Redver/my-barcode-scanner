import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BarcodeScanner from './BarcodeScanner';
import MockReceiptScanner from './MockReceiptScanner';
import SubmitProduct from './SubmitProduct';
import Favourites from './Favourites';
import ShoppingList from './ShoppingList';
const App = () => {
  return (
    <Router>
      <nav style={{ padding: '1rem', textAlign: 'center' }}>
        <Link to="/my-barcode-scanner" style={{ marginRight: '1rem' }}>Scan Barcode</Link>
        <Link to="/receipt">Upload Receipt  </Link>
        <Link to="/submit">Submit Product   </Link>
        <Link to="/favourites">Favourites   </Link>
        <Link to="/ShoppingList">Shopping List   </Link>
      </nav>

      <Routes>
      <Route path="/submit" element={<SubmitProduct />} />
        <Route path="/my-barcode-scanner" element={<BarcodeScanner />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/receipt" element={<MockReceiptScanner />} />
        <Route path="/shoppingList" element={<ShoppingList />} />
      </Routes>
    </Router>
  );
};

export default App;
