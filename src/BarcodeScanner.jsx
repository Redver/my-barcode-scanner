// src/components/ReceiptScanner.jsx
import React, { useState } from 'react';
import Tesseract from 'tesseract.js';


const ReceiptScanner = () => {
  const [image, setImage] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      processImage(file);
    }
  };

  const processImage = async (file) => {
    setLoading(true);
    try {
      const { data: { text } } = await Tesseract.recognize(
        file,
        'eng',
        { logger: m => console.log(m) }
      );

      const productNames = text
        .split(/\n|\r|\s{2,}/)
        .map(line => line.trim())
        .filter(line => line.length > 2)
        .slice(0, 10); // limit for demo

      const productData = await Promise.all(productNames.map(async name => {
        try {
          const res = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(name)}&search_simple=1&action=process&json=1`, {
            headers: {
              'User-Agent': 'UniProject/1.0 (331418@via.dk)'
            }
          });
          const json = await res.json();
          const product = json.products[0];
          return {
            name,
            foundName: product?.product_name || 'Not found',
            ecoscore: product?.ecoscore_grade?.toUpperCase() || 'N/A'
          };
        } catch {
          return { name, foundName: 'Error', ecoscore: 'N/A' };
        }
      }));

      setResults(productData);
    } catch (err) {
      console.error('OCR error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Receipt Eco Scanner</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-4" />
      {image && <img src={image} alt="receipt" className="mx-auto mb-4 max-h-80" />}
      {loading && <p>Processing...</p>}
      {results.length > 0 && (
        <div className="text-left">
          {results.map((item, idx) => (
            <div
              key={idx}
              className={`rounded p-3 mb-2 text-white ${getEcoColor(item.ecoscore)}`}
            >
              <p><strong>Detected:</strong> {item.name}</p>
              <p><strong>Matched:</strong> {item.foundName}</p>
              <p><strong>Eco Score:</strong> {item.ecoscore}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const getEcoColor = (score) => {
  switch (score) {
    case 'A': return 'bg-green-600';
    case 'B': return 'bg-green-500';
    case 'C': return 'bg-yellow-500';
    case 'D': return 'bg-orange-500';
    case 'E': return 'bg-red-600';
    default: return 'bg-gray-500';
  }
};

export default ReceiptScanner;