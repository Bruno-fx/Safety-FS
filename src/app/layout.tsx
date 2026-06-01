'use client';
import { LanguageProvider, useLang } from '../context/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

function Navbar() {
  const { toggleLanguage, t } = useLang();
  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      padding: '20px 5%', 
      background: '#ffffff', 
      alignItems: 'center', 
      borderBottom: '1px solid #e2e8f0',
      flexWrap: 'wrap',
      gap: '20px'
    }}>
      <style jsx global>{`
        .navbar-brand-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .navbar-nav-links {
          display: flex;
          gap: 24px;
          align-items: center;
        }
        
        @media (max-width: 680px) {
          header {
            flex-direction: column !important;
            justify-content: center !important;
            text-align: center !important;
            padding: 20px 4% !important;
          }
          .navbar-brand-container {
            flex-direction: column !important;
            justify-content: center !important;
            margin-bottom: 5px;
          }
          .navbar-nav-links {
            flex-direction: column !important;
            width: 100% !important;
            gap: 16px !important;
            justify-content: center !important;
          }
        }
      `}</style>

      <div className="navbar-brand-container">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', flexDirection: 'inherit' }}>
          <Image 
            src="/logo.png" 
            alt="Safety Financial Solutions Logo" 
            width={52} 
            height={52} 
            style={{ objectFit: 'contain' }}
            priority
          />
          <div>
            <h1 style={{ margin: 0, fontWeight: '800', fontSize: '1.4rem', color: '#0b63b6', letterSpacing: '-0.5px', lineHeight: '1.2' }}>
              SAFETY FINANCIAL <span style={{ color: '#f05a28' }}>SOLUTIONS</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#666', margin: '4px 0 0 0', fontWeight: '500' }}>
              {t('tagline')}
            </p>
          </div>
        </Link>
      </div>

      <nav className="navbar-nav-links">
        <Link href="/" style={{ fontWeight: '600', color: '#334155', textDecoration: 'none', fontSize: '0.95rem' }}>
          {t('navHome')}
        </Link>
        <Link href="/apply" style={{ fontWeight: '600', color: '#f05a28', textDecoration: 'none', fontSize: '0.95rem' }}>
          {t('navApply')}
        </Link>
        <button onClick={toggleLanguage} style={{ 
          background: '#f05a28', 
          color: '#fff', 
          border: 'none', 
          padding: '10px 20px', 
          borderRadius: '20px', 
          cursor: 'pointer', 
          fontWeight: '700',
          fontSize: '0.8rem',
          boxShadow: '0 4px 10px rgba(240, 90, 40, 0.2)',
          transition: 'transform 0.2s, background-color 0.2s'
        }}>
          {t('switchBtn')}
        </button>
      </nav>
    </header>
  );
}

function Footer() {
  const { t } = useLang();
  return (
    <footer style={{ background: '#1a2b49', color: '#fff', padding: '50px 5% 40px', borderTop: '4px solid #0b63b6', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(240px, 100%, 400px), 1fr))', 
        gap: '40px', 
        textAlign: 'left', 
        marginBottom: '30px',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <Image 
              src="/logo.png" 
              alt="Safety Financial Solutions Logo" 
              width={40} 
              height={40} 
              style={{ objectFit: 'contain' }} 
            />
            <h3 style={{ color: '#ffffff', margin: 0, fontSize: '1.2rem', fontWeight: '700' }}>SAFETY FINANCIAL</h3>
          </div>
          <p style={{ lineHeight: '1.6', color: '#cbd5e1', fontSize: '0.9rem', margin: 0 }}>{t('footerDesc')}</p>
        </div>
        <div>
          <h3 style={{ color: '#f05a28', fontSize: '1rem', fontWeight: '700', marginBottom: '15px', textTransform: 'uppercase' }}>{t('footerSupport')}</h3>
          <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', wordBreak: 'break-all' }}><strong>Email:</strong> {t('email')}</p>
          <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem' }}><strong>Phone:</strong> {t('phone')}</p>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '12px', margin: 0 }}>{t('footerUrgent')}</p>
        </div>
      </div>
      <div style={{ textAlign: 'center', borderTop: '1px solid #2a3d5c', paddingTop: '20px', fontSize: '0.85rem', color: '#94a3b8' }}>
        &copy; 2026 Safety Financial Solution Ltd. {t('rightsReserved')}
      </div>
    </footer>
  );
}

// Upgraded Interactive Floating WhatsApp Component with Localized Interactive Card
function WhatsAppButton() {
  const { lang } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  
  const whatsappMsg = lang === 'rw' 
    ? "Mwaramutse! Nshaka kubaza ku nguzanyo mwatanga." 
    : "Hello Safety Financial Solutions! I would like to inquire about your loan services.";
    
  const whatsappUrl = `https://wa.me/250781453818?text=${encodeURIComponent(whatsappMsg)}`;

  // Translation sets for the custom widget card
  const cardTexts = {
    en: {
      title: "Do you need help?",
      subtitle: "Chat with our loan officer directly on WhatsApp.",
      action: "Contact us on WhatsApp"
    },
    rw: {
      title: "Ukeneye ubufasha?",
      subtitle: "Vugana n'ushinzwe gutanga inguzanyo ubu kuri WhatsApp.",
      action: "Twandikire kuri WhatsApp"
    }
  };

  const currentText = cardTexts[lang] || cardTexts['en'];

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
      
      {/* 1. Toggleable Interactive Pop-up Tab */}
      {isOpen && (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(15, 23, 42, 0.15)',
          border: '1px solid #e2e8f0',
          padding: '20px',
          width: '280px',
          boxSizing: 'border-box',
          position: 'relative',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {/* Close indicator button */}
          <button 
            onClick={() => setIsOpen(false)}
            style={{ position: 'absolute', top: '10px', right: '12px', background: 'none', border: 'none', fontSize: '1.1rem', color: '#94a3b8', cursor: 'pointer', fontWeight: 'bold', padding: 0 }}
          >
            ×
          </button>
          
          <h4 style={{ margin: '0 0 6px 0', color: '#0f172a', fontSize: '1rem', fontWeight: '800' }}>
            {currentText.title}
          </h4>
          <p style={{ margin: '0 0 16px 0', color: '#475569', fontSize: '0.85rem', lineHeight: '1.4', fontWeight: '500' }}>
            {currentText.subtitle}
          </p>
          
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)} // Closes tab upon successful click redirect
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: '#25D366',
              color: '#ffffff',
              textDecoration: 'none',
              padding: '10px 14px',
              borderRadius: '6px',
              fontWeight: '700',
              fontSize: '0.85rem',
              boxShadow: '0 4px 10px rgba(37, 211, 102, 0.2)',
              textAlign: 'center',
              transition: 'background-color 0.2s'
            }}
          >
            {/* Embedded WhatsApp Vector icon indicator inside the CTA button */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ fill: 'white', color: '#25D366' }}>
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            {currentText.action}
          </a>
        </div>
      )}

      {/* 2. Primary Floating Icon Trigger Button Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: '#25D366',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(37, 211, 102, 0.4)',
          cursor: 'pointer',
          transition: 'transform 0.2s ease',
          outline: 'none',
          padding: 0
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ fill: 'white', color: '#25D366' }}>
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>
      </button>
    </div>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <>
      {!isAdminPage && <Navbar />}
      <main style={{ minHeight: '80vh', width: '100%' }}>{children}</main>
      {!isAdminPage && <Footer />}
      {!isAdminPage && <WhatsAppButton />}
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ margin: 0, padding: 0, width: '100%', scrollBehavior: 'smooth' }}>
      <body style={{ margin: 0, padding: 0, width: '100%', overflowX: 'hidden' }}>
        <LanguageProvider>
          <LayoutContent>{children}</LayoutContent>
        </LanguageProvider>
      </body>
    </html>
  );
}