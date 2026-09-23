import React, { useState, useEffect } from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  alt?: string;
}

export const TanfirulGhoyyiLogo: React.FC<LogoProps> = ({
  className = '',
  size = 48,
  alt = 'Logo Resmi SMK Islam Tanfirul Ghoyyi Lamongan',
}) => {
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    // Check if the administrator/user has loaded the exact raw image file
    const stored = localStorage.getItem('tg_official_logo_image');
    if (stored) {
      setCustomLogoUrl(stored);
    }

    const handleStorageChange = () => {
      const updated = localStorage.getItem('tg_official_logo_image');
      setCustomLogoUrl(updated);
    };

    window.addEventListener('tg_logo_updated', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('tg_logo_updated', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // If the user uploaded their exact original file, render the original untouched image
  if (customLogoUrl) {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
        title={alt}
      >
        <img
          src={customLogoUrl}
          alt={alt}
          width={size}
          height={size}
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  // Default: Exact vector rendering of LOGO SMK TG.jpeg
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1024 1024"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={`inline-block shrink-0 select-none ${className}`}
      aria-label={alt}
      role="img"
    >
      <defs>
        <path id="tgTopTextArc" d="M 195,512 A 317,317 0 1,1 829,512" fill="none" />
        <path id="tgLamonganArc" d="M 252,512 A 260,260 0 0,0 760,512" fill="none" />
        <path id="tgTanfirulArc" d="M 195,512 A 317,317 0 0,0 829,512" fill="none" />
      </defs>

      {/* 1. KEMBANG BINTANG 12 KUNING (12 Kelopak Bulat + 12 Pucuk Runcing Berselang-seling) */}
      <path
        d="M 461.4,127.3 Q 512.0,40.0 562.6,127.3 L 639.9,34.8 L 660.5,153.5 Q 748.0,103.2 748.2,204.2 L 861.3,162.7 L 819.8,275.8 Q 920.8,276.0 870.5,363.5 L 989.2,384.1 L 896.7,461.4 Q 984.0,512.0 896.7,562.6 L 989.2,639.9 L 870.5,660.5 Q 920.8,748.0 819.8,748.2 L 861.3,861.3 L 748.2,819.8 Q 748.0,920.8 660.5,870.5 L 639.9,989.2 L 562.6,896.7 Q 512.0,984.0 461.4,896.7 L 384.1,989.2 L 363.5,870.5 Q 276.0,920.8 275.8,819.8 L 162.7,861.3 L 204.2,748.2 Q 103.2,748.0 153.5,660.5 L 34.8,639.9 L 127.3,562.6 Q 40.0,512.0 127.3,461.4 L 34.8,384.1 L 153.5,363.5 Q 103.2,276.0 204.2,275.8 L 162.7,162.7 L 275.8,204.2 Q 276.0,103.2 363.5,153.5 L 384.1,34.8 Z"
        fill="#FEF08A"
        stroke="#000000"
        strokeWidth="12"
        strokeLinejoin="round"
      />

      {/* 12 Lubang Lingkaran di setiap kelopak bulat */}
      <circle cx="512.0" cy="74.0" r="22" fill="#FEF08A" stroke="#000000" strokeWidth="8" />
      <circle cx="731.0" cy="132.7" r="22" fill="#FEF08A" stroke="#000000" strokeWidth="8" />
      <circle cx="891.3" cy="293.0" r="22" fill="#FEF08A" stroke="#000000" strokeWidth="8" />
      <circle cx="950.0" cy="512.0" r="22" fill="#FEF08A" stroke="#000000" strokeWidth="8" />
      <circle cx="891.3" cy="731.0" r="22" fill="#FEF08A" stroke="#000000" strokeWidth="8" />
      <circle cx="731.0" cy="891.3" r="22" fill="#FEF08A" stroke="#000000" strokeWidth="8" />
      <circle cx="512.0" cy="950.0" r="22" fill="#FEF08A" stroke="#000000" strokeWidth="8" />
      <circle cx="293.0" cy="891.3" r="22" fill="#FEF08A" stroke="#000000" strokeWidth="8" />
      <circle cx="132.7" cy="731.0" r="22" fill="#FEF08A" stroke="#000000" strokeWidth="8" />
      <circle cx="74.0" cy="512.0" r="22" fill="#FEF08A" stroke="#000000" strokeWidth="8" />
      <circle cx="132.7" cy="293.0" r="22" fill="#FEF08A" stroke="#000000" strokeWidth="8" />
      <circle cx="293.0" cy="132.7" r="22" fill="#FEF08A" stroke="#000000" strokeWidth="8" />

      {/* 2. LINGKARAN HIJAU BESAR */}
      <circle cx="512" cy="512" r="388" fill="#008A45" stroke="#000000" strokeWidth="14" />
      <circle cx="512" cy="512" r="380" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.6" />

      {/* Teks Melengkung Atas: SEKOLAH MENENGAH KEJURUAN ISLAM */}
      <text
        fill="#FFFFFF"
        fontSize="44"
        fontWeight="900"
        fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
        letterSpacing="4"
      >
        <textPath href="#tgTopTextArc" xlinkHref="#tgTopTextArc" startOffset="50%" textAnchor="middle">
          SEKOLAH MENENGAH KEJURUAN ISLAM
        </textPath>
      </text>

      {/* Dua Titik Putih Pemisah di Posisi Jam 9 dan Jam 3 */}
      <circle cx="178" cy="512" r="18" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
      <circle cx="846" cy="512" r="18" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />

      {/* Teks Melengkung Bawah Dalam: LAMONGAN (Hitam) */}
      <text
        fill="#000000"
        fontSize="42"
        fontWeight="900"
        fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
        letterSpacing="6"
      >
        <textPath href="#tgLamonganArc" xlinkHref="#tgLamonganArc" startOffset="50%" textAnchor="middle">
          LAMONGAN
        </textPath>
      </text>

      {/* Teks Melengkung Bawah Luar: “TANFIRUL GHOYYI” (Putih) */}
      <text
        fill="#FFFFFF"
        fontSize="47"
        fontWeight="900"
        fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
        letterSpacing="5"
      >
        <textPath href="#tgTanfirulArc" xlinkHref="#tgTanfirulArc" startOffset="50%" textAnchor="middle">
          &ldquo;TANFIRUL GHOYYI&rdquo;
        </textPath>
      </text>

      {/* 3. BIDANG LINGKARAN PUTIH SENTRAL */}
      <circle cx="512" cy="512" r="238" fill="#FFFFFF" stroke="#000000" strokeWidth="12" />

      {/* 4. BINTANG SUDUT LIMA (☆) DI PUNCAK */}
      <polygon
        points="512,286 525,324 566,324 533,348 546,388 512,364 478,388 491,348 458,324 499,324"
        fill="#FFFFFF"
        stroke="#000000"
        strokeWidth="8"
        strokeLinejoin="round"
      />

      {/* 5. AL-QUR'AN TERBUKA DI ATAS REHAL KAYU */}
      <path d="M 452,434 L 572,434 L 482,464 L 542,464" stroke="#451A03" strokeWidth="10" strokeLinecap="round" />
      <path
        d="M 420,388 Q 470,366 512,384 Q 554,366 604,388 L 600,432 Q 554,410 512,428 Q 470,410 424,432 Z"
        fill="#FDE047"
        stroke="#451A03"
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <line x1="512" y1="384" x2="512" y2="428" stroke="#451A03" strokeWidth="6" />
      <line x1="438" y1="398" x2="494" y2="394" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
      <line x1="438" y1="412" x2="494" y2="408" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
      <line x1="530" y1="394" x2="586" y2="398" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
      <line x1="530" y1="408" x2="586" y2="412" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />

      {/* 6. BOLA DUNIA BIRU (JAGAT MAYAPADA) */}
      <circle cx="512" cy="530" r="92" fill="#38BDF8" stroke="#0369A1" strokeWidth="6" />
      <ellipse cx="512" cy="530" rx="92" ry="40" fill="none" stroke="#0284C7" strokeWidth="4" opacity="0.8" />
      <ellipse cx="512" cy="530" rx="46" ry="92" fill="none" stroke="#0284C7" strokeWidth="4" opacity="0.8" />
      <line x1="512" y1="438" x2="512" y2="622" stroke="#0284C7" strokeWidth="4" opacity="0.8" />

      {/* 7. SEPASANG SAYAP PUTIH MENGAPIT BOLA DUNIA */}
      <path
        d="
          M 440,592 
          C 410,560 380,500 390,440 
          C 405,450 425,490 435,520 
          C 415,480 415,445 425,430 
          C 440,450 450,490 455,520 
          C 445,480 450,440 465,420 
          C 470,440 475,485 465,540 Z
        "
        fill="#FFFFFF"
        stroke="#000000"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <path
        d="
          M 584,592 
          C 614,560 644,500 634,440 
          C 619,450 599,490 589,520 
          C 609,480 609,445 599,430 
          C 584,450 574,490 569,520 
          C 579,480 574,440 559,420 
          C 554,440 549,485 559,540 Z
        "
        fill="#FFFFFF"
        stroke="#000000"
        strokeWidth="6"
        strokeLinejoin="round"
      />

      {/* 8. OBOR ILMU (Cahaya Penerang Kegelapan) */}
      <path
        d="
          M 512,420 
          C 528,440 544,456 534,476 
          C 524,492 500,492 490,476 
          C 480,456 496,440 512,420 Z
        "
        fill="#EF4444"
        stroke="#DC2626"
        strokeWidth="2"
      />
      <path
        d="
          M 512,435 
          C 520,450 528,462 522,472 
          C 516,478 506,478 502,472 
          C 496,462 504,450 512,435 Z
        "
        fill="#FBBF24"
      />
      <path d="M 482,482 L 542,482 L 526,502 L 498,502 Z" fill="#78350F" stroke="#000000" strokeWidth="5" />

      {/* 9. PITA HIJAU DENGAN 9 BINTANG KUNING DAN KALIGRAFI ARAB */}
      <path
        d="M 388,572 Q 512,638 636,572 L 631,618 Q 512,674 393,618 Z"
        fill="#008A45"
        stroke="#000000"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <circle cx="422" cy="588" r="5" fill="#FDE047" stroke="#000000" strokeWidth="1.5" />
      <circle cx="447" cy="598" r="5" fill="#FDE047" stroke="#000000" strokeWidth="1.5" />
      <circle cx="472" cy="605" r="5" fill="#FDE047" stroke="#000000" strokeWidth="1.5" />
      <circle cx="497" cy="610" r="5" fill="#FDE047" stroke="#000000" strokeWidth="1.5" />
      <circle cx="512" cy="611" r="5.5" fill="#FDE047" stroke="#000000" strokeWidth="1.5" />
      <circle cx="527" cy="610" r="5" fill="#FDE047" stroke="#000000" strokeWidth="1.5" />
      <circle cx="552" cy="605" r="5" fill="#FDE047" stroke="#000000" strokeWidth="1.5" />
      <circle cx="577" cy="598" r="5" fill="#FDE047" stroke="#000000" strokeWidth="1.5" />
      <circle cx="602" cy="588" r="5" fill="#FDE047" stroke="#000000" strokeWidth="1.5" />

      {/* Kaligrafi Arab: المعهد الإسلامي تنفير الغيي */}
      <text
        x="512"
        y="647"
        fill="#FFFFFF"
        fontSize="26"
        fontWeight="bold"
        textAnchor="middle"
        fontFamily="'Amiri', 'Traditional Arabic', serif"
      >
        المعهد الإسلامي تنفير الغيي
      </text>

      {/* 10. EMPAT KITAB / PILAR BERTINGKAT BIRU */}
      <rect x="482" y="642" width="60" height="92" fill="#1E3A8A" stroke="#000000" strokeWidth="5" />
      <line x1="482" y1="665" x2="542" y2="665" stroke="#93C5FD" strokeWidth="4" />
      <line x1="482" y1="688" x2="542" y2="688" stroke="#93C5FD" strokeWidth="4" />
      <line x1="482" y1="711" x2="542" y2="711" stroke="#93C5FD" strokeWidth="4" />
      <line x1="512" y1="642" x2="512" y2="734" stroke="#93C5FD" strokeWidth="4" />
    </svg>
  );
};
