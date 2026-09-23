import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { TanfirulGhoyyiLogo } from './TanfirulGhoyyiLogo';
import { SCHOOL_INFO } from '../data/mockData';
import { QrCode, ExternalLink, Copy, CheckCheck, Download } from 'lucide-react';

interface OfficialBarcodeCardProps {
  className?: string;
  size?: number;
  showDetails?: boolean;
}

export const OfficialBarcodeCard: React.FC<OfficialBarcodeCardProps> = ({
  className = '',
  size = 220,
  showDetails = true,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const registrationLink = SCHOOL_INFO.registrationBitly; // https://bit.ly/SPMB-SMKTG-2027-2028
  const displayLink = 'bit.ly/SPMB-SMKTG-2027-2028';

  useEffect(() => {
    QRCode.toDataURL(registrationLink, {
      width: size * 2,
      margin: 2,
      errorCorrectionLevel: 'H', // High error correction to allow center emblem logo
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR code', err));
  }, [registrationLink, size]);

  const handleCopy = () => {
    navigator.clipboard.writeText(registrationLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className={`bg-white rounded-2xl p-6 border-2 border-slate-200 text-center shadow-md relative ${className}`}>
      
      {/* Top Banner Tag */}
      <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 mb-3 bg-emerald-50 py-1 px-3 rounded-full border border-emerald-200 inline-block">
        Scan Barcode Pendaftaran SPMB
      </div>

      {/* QR Code Container with Center Logo Overlay matching KODE BARCODE.jpeg */}
      <div className="relative inline-block mx-auto p-2 bg-white rounded-xl shadow-xs border border-slate-200">
        {qrDataUrl ? (
          <div className="relative" style={{ width: size, height: size }}>
            <img
              src={qrDataUrl}
              alt="Scan Barcode SPMB SMKTG 2027-2028"
              className="w-full h-full object-contain"
            />
            {/* Center Logo Emblem */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-12 h-12 bg-white rounded-full p-0.5 shadow-md border-2 border-emerald-600 flex items-center justify-center">
                <TanfirulGhoyyiLogo size={40} />
              </div>
            </div>
          </div>
        ) : (
          <div
            className="flex items-center justify-center bg-slate-100 text-slate-400"
            style={{ width: size, height: size }}
          >
            <QrCode className="w-16 h-16 animate-pulse" />
          </div>
        )}
      </div>

      {/* Label under barcode matching uploaded image */}
      <div className="mt-3">
        <div className="font-bold text-sm tracking-wide text-purple-900 uppercase">
          SPMB SMKTG 2027-2028
        </div>
        <div className="mt-1 font-mono text-xs font-semibold text-emerald-800 bg-slate-50 py-1 px-2.5 rounded border border-slate-200 break-all select-all">
          {displayLink}
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-2">
          <a
            href={registrationLink}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <span>Buka Link Pendaftaran</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={handleCopy}
            className="w-full sm:w-auto px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin!' : 'Salin Tautan'}</span>
          </button>
        </div>
      )}

      <div className="mt-2 text-[10px] text-slate-500">
        Arahkan kamera smartphone ke barcode untuk mengisi formulir langsung
      </div>

    </div>
  );
};
