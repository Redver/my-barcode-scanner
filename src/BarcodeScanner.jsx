import { useEffect, useRef } from "react";
import { Html5Qrcode, Html5QrcodeScanType } from "html5-qrcode";
import React from 'react';

const BarcodeScanner = () => {
  const scannerRef = useRef(null);

  useEffect(() => {
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.7777778,
      supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
    };

    const html5QrCode = new Html5Qrcode("scanner");

    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        // Prefer rear camera if available
        const rearCamera = devices.find(device => device.label.toLowerCase().includes("back")) || devices[0];

        html5QrCode.start(
          rearCamera.id,
          config,
          (decodedText, decodedResult) => {
            console.log("✅ Code scanned:", decodedText, decodedResult);
          },
          (errorMessage) => {
            console.log(errorMessage)
          }
        );
      }
    });

    return () => {
      html5QrCode.stop().then(() => html5QrCode.clear());
    };
  }, []);

  return (
    <div>
      <div id="scanner" ref={scannerRef} style={{ width: "100%" }} />
    </div>
  );
};

export default BarcodeScanner;
