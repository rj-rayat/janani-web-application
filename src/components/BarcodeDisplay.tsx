import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

interface BarcodeDisplayProps {
  value: string;
  width?: number;
  height?: number;
  displayValue?: boolean;
  className?: string;
  format?: 'CODE128' | 'CODE39' | 'EAN13' | 'pharmacode';
}

export const BarcodeDisplay: React.FC<BarcodeDisplayProps> = ({
  value,
  width = 1.4,
  height = 36,
  displayValue = true,
  className = '',
  format = 'CODE128',
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (svgRef.current && value) {
      try {
        JsBarcode(svgRef.current, value, {
          format,
          width,
          height,
          displayValue,
          font: 'JetBrains Mono',
          fontSize: 11,
          fontOptions: '600',
          textMargin: 2,
          margin: 4,
          background: '#ffffff',
          lineColor: '#0f172a',
        });
      } catch (e) {
        console.error('Barcode rendering error:', e);
      }
    }
  }, [value, width, height, displayValue, format]);

  if (!value) return null;

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg ref={svgRef} className="max-w-full overflow-visible" />
    </div>
  );
};
