import React, { useRef, useState } from 'react';
import { createWorker } from 'tesseract.js';

const ReceiptScanner = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }, // Use back camera if available
    });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  };

  const captureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageDataURL = canvas.toDataURL('image/png');

    setLoading(true);
    const worker = await createWorker('eng');

    const {
      data: { text },
    } = await worker.recognize(imageDataURL);

    setText(text);
    await worker.terminate();
    setLoading(false);

    // Optionally: Parse `text` and call Open Food Facts for each item found.
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Scan Receipt</h2>
      <video ref={videoRef} style={{ width: '100%', maxWidth: '400px' }} />
      <br />
      <button onClick={startCamera}>Start Camera</button>
      <button onClick={captureAndScan} disabled={loading}>
        {loading ? 'Scanning...' : 'Scan Receipt'}
      </button>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {text && (
        <div style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>
          <h3>OCR Result:</h3>
          <p>{text}</p>
        </div>
      )}
    </div>
  );
};

export default ReceiptScanner;
