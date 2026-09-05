import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
  onScanClick?: () => void;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  value,
  size = 110,
  className = '',
  onScanClick,
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    if (!value) return;

    QRCode.toDataURL(value, {
      width: size,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        if (isMounted) {
          setDataUrl(url);
          setError(false);
        }
      })
      .catch((err) => {
        console.error('QR generation error:', err);
        if (isMounted) setError(true);
      });

    return () => {
      isMounted = false;
    };
  }, [value, size]);

  if (error || !dataUrl) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`bg-slate-100 border border-slate-300 rounded flex items-center justify-center text-[10px] text-slate-500 ${className}`}
      >
        QR Loading...
      </div>
    );
  }

  return (
    <div
      onClick={onScanClick}
      title="Scan or click to verify authentic Janani clinical report"
      className={`inline-block cursor-pointer transition hover:opacity-95 ${className}`}
    >
      <img
        src={dataUrl}
        alt="Janani Report Verification QR Code"
        width={size}
        height={size}
        className="rounded border border-slate-200 bg-white p-1"
      />
    </div>
  );
};
