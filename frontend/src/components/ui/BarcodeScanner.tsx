import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Camera, X } from 'lucide-react';
import { Button } from './Button';

interface BarcodeScannerProps {
  onScan: (decodedText: string) => void;
  onClose: () => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose }) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [error] = useState<string>('');

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner(
      'reader',
      { 
        fps: 10, 
        qrbox: { width: 250, height: 150 },
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
        formatsToSupport: [
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.QR_CODE,
        ]
      },
      false
    );

    scannerRef.current.render(
      (decodedText) => {
        scannerRef.current?.clear();
        onScan(decodedText);
      },
      () => {
        // usually ignore continuous scanning errors
      }
    );

    return () => {
      scannerRef.current?.clear().catch(e => console.error(e));
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[var(--color-bg-card)] rounded-xl shadow-xl w-full max-w-md overflow-hidden relative">
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
            <Camera size={20} />
            Scan Barcode
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-[var(--color-bg-hover)] text-[var(--color-text-muted)] transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div id="reader" className="w-full rounded-lg overflow-hidden border border-[var(--color-border)]"></div>
          <p className="text-xs text-center text-[var(--color-text-muted)] mt-4">
            Position the barcode inside the frame to scan.
          </p>
        </div>
        <div className="p-4 border-t border-[var(--color-border)] flex justify-end">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
};
