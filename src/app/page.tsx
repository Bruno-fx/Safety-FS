'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLang } from '../context/LanguageContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { t } = useLang();
  const router = useRouter();

  // Array containing your four distinct background showcase graphics
  const backgroundSlides = [
    '/hero1.jpeg',
    '/hero2.jpeg',
    '/hero3.jpeg',
    '/hero4.jpeg'
  ];

  const [activeSlide, setActiveSlide] = useState(0);

  // Background rotater advancing every 4 seconds
  useEffect(() => {
    const loopInterval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % backgroundSlides.length);
    }, 4000);
    return () => clearInterval(loopInterval);
  }, [backgroundSlides.length]);

  // Highlight with Primary Corporate Blue (For Loan Cards)
  const handleLoanEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundColor = '#0b63b6';
    e.currentTarget.style.borderColor = '#0b63b6';
    const heading = e.currentTarget.querySelector('h3');
    const paragraph = e.currentTarget.querySelector('p');
    const numberBadge = e.currentTarget.querySelector('.num-badge') as HTMLDivElement;
    if (heading) heading.style.color = '#ffffff';
    if (paragraph) paragraph.style.color = '#e2e8f0';
    if (numberBadge) {
      numberBadge.style.backgroundColor = '#ffffff';
      numberBadge.style.color = '#0b63b6';
    }
  };

  const handleLoanLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundColor = '#ffffff';
    e.currentTarget.style.borderColor = '#e2e8f0';
    const heading = e.currentTarget.querySelector('h3');
    const paragraph = e.currentTarget.querySelector('p');
    const numberBadge = e.currentTarget.querySelector('.num-badge') as HTMLDivElement;
    if (heading) heading.style.color = '#0f172a';
    if (paragraph) paragraph.style.color = '#64748b';
    if (numberBadge) {
      numberBadge.style.backgroundColor = 'rgba(15, 23, 42, 0.05)';
      numberBadge.style.color = '#1e3a8a';
    }
  };

  // Highlight with Brand Action Orange (For Requirements Cards)
  const handleReqEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundColor = '#f05a28';
    e.currentTarget.style.borderColor = '#f05a28';
    const text = e.currentTarget.querySelector('p');
    const check = e.currentTarget.querySelector('.check-icon') as HTMLDivElement;
    if (text) text.style.color = '#ffffff';
    if (check) {
      check.style.backgroundColor = '#ffffff';
      check.style.color = '#f05a28';
    }
  };

  const handleReqLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    const text = e.currentTarget.querySelector('p');
    const check = e.currentTarget.querySelector('.check-icon') as HTMLDivElement;
    if (text) text.style.color = '#cbd5e1';
    if (check) {
      check.style.backgroundColor = '#rgba(240, 90, 40, 0.2)';
      check.style.color = '#ffffff';
    }
  };

  const handleLoanClick = (loanName: string) => {
    const encodedType = encodeURIComponent(loanName);
    router.push(`/apply?type=${encodedType}`);
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', color: '#1e293b', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      
      {/* 1. Full-Bleed Hero Wrapper with Integrated Background Slideshow */}
      <section style={{ 
        position: 'relative',
        padding: '160px 5%', 
        textAlign: 'center',
        width: '100%',
        boxSizing: 'border-box',
        minHeight: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f172a' // Solid backup while assets mount
      }}>
        {/* Style configurations enforcing full-bleed absolute slideshow stacks */}
        <style jsx>{`
          .hero-bg-slide {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0;
            z-index: 0;
            transition: opacity 1.2s ease-in-out, transform 4.5s ease-out;
          }
          .hero-bg-slide.active {
            opacity: 1;
            transform: scale(1.03);
          }
          .hero-overlay-shield {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(to bottom, rgba(15, 23, 42, 0.75) 0%, rgba(30, 58, 138, 0.85) 100%);
            z-index: 1;
          }
          .hero-content-vault {
            position: relative;
            z-index: 2;
            maxWidth: 850px;
            margin: 0 auto;
          }
        `}</style>

        {/* Dynamic Image Loop Rendering Stacked Sheets */}
        {backgroundSlides.map((src, idx) => (
          <img 
            key={src}
            src={src}
            alt="Safety Financial Background Element"
            className={`hero-bg-slide ${idx === activeSlide ? 'active' : ''}`}
          />
        ))}

        {/* Gradient dark mask protecting readability parameters */}
        <div className="hero-overlay-shield"></div>

        <div className="hero-content-vault">
          <span style={{ 
            backgroundColor: 'rgba(240, 90, 40, 0.2)', 
            color: '#f05a28', 
            padding: '6px 18px', 
            borderRadius: '20px', 
            fontSize: '0.85rem', 
            fontWeight: '700',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: '24px',
            border: '1px solid rgba(240, 90, 40, 0.3)'
          }}>
            {t('companyName')}
          </span>
          <h1 style={{ 
            fontSize: 'clamp(2.2rem, 5.5vw, 3.4rem)', 
            fontWeight: '800', 
            lineHeight: '1.25', 
            marginBottom: '24px',
            letterSpacing: '-1px',
            color: '#ffffff'
          }}>
            {t('heroTitle')}
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.25rem', lineHeight: '1.6', marginBottom: '40px', fontWeight: '400' }}>
            {t('heroDesc')}
          </p>
          <div>
            <Link href="/apply" style={{ 
              background: '#f05a28', 
              color: '#ffffff', 
              padding: '16px 38px', 
              borderRadius: '6px', 
              fontWeight: '700', 
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: '0 6px 20px rgba(240, 90, 40, 0.45)',
              display: 'inline-block',
              transition: 'transform 0.2s'
            }}>
              {t('applyNow')}
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Bar Container */}
      <section style={{ padding: '0 5%', marginTop: '-40px', position: 'relative', zIndex: 10, boxSizing: 'border-box' }}>
        <div style={{ 
          background: '#ffffff', 
          borderRadius: '12px', 
          padding: '30px', 
          boxShadow: '0 12px 35px rgba(15, 23, 42, 0.05)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '30px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ color: '#0f172a', fontSize: '1.4rem', fontWeight: '700', marginBottom: '4px' }}>2 Days</h4>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Fast Disbursal Guarantee</p>
          </div>
          <div style={{ textAlign: 'center', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>
            <h4 style={{ color: '#0f172a', fontSize: '1.4rem', fontWeight: '700', marginBottom: '4px' }}>Competitive</h4>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Highly Competitive & Low Interest Rates</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ color: '#f05a28', fontSize: '1.4rem', fontWeight: '700', marginBottom: '4px' }}>100%</h4>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Your Satisfaction is Our Priority</p>
          </div>
        </div>
      </section>

      {/* Strategic Solutions Grid Portfolio Section */}
      <section style={{ padding: '80px 5%', boxSizing: 'border-box', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>
            {t('loansTitle')}
          </h2>
          <div style={{ width: '50px', height: '4px', background: '#f05a28', margin: '0 auto', borderRadius: '2px' }}></div>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(250px, 100%, 350px), 1fr))',
          gap: '24px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {(t('loans') as string[]).map((loan, idx) => (
            <div 
              key={idx} 
              onMouseEnter={handleLoanEnter}
              onMouseLeave={handleLoanLeave}
              onClick={() => handleLoanClick(loan)}
              style={{ 
                background: '#ffffff', 
                padding: '32px', 
                borderRadius: '8px', 
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxSizing: 'border-box'
              }}
            >
              <div 
                className="num-badge"
                style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '6px', 
                  backgroundColor: 'rgba(15, 23, 42, 0.05)', 
                  color: '#1e3a8a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  marginBottom: '20px',
                  transition: 'all 0.2s ease'
                }}
              >
                0{idx + 1}
              </div>
              <h3 style={{ color: '#0f172a', fontSize: '1.25rem', fontWeight: '700', marginBottom: '12px', transition: 'all 0.2s ease' }}>
                {loan}
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.5', margin: 0, transition: 'all 0.2s ease' }}>
                Click to apply immediately for this package. Disbursed within just two days.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Premium Compliance & Underwriting Section with Integrated Blue Gradient Background */}
      <section style={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)', // Shifted the corporate gradient look here
        padding: '90px 5%', 
        boxSizing: 'border-box', 
        width: '100%' 
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', boxSizing: 'border-box' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#ffffff', marginBottom: '10px', letterSpacing: '-0.5px' }}>
            {t('reqTitle')}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '40px', fontWeight: '500' }}>
            {t('reqDesc')}
          </p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(240px, 100%, 500px), 1fr))', 
            gap: '20px',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            {(t('requirements') as string[]).map((req, idx) => (
              <div 
                key={idx} 
                onMouseEnter={handleReqEnter}
                onMouseLeave={handleReqLeave}
                style={{ 
                  display: 'flex', 
                  gap: '16px', 
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.06)', // Transparent overlay card look matching premium themes
                  padding: '24px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxSizing: 'border-box',
                  width: '100%',
                  overflow: 'hidden'
                }}
              >
                <div 
                  className="check-icon"
                  style={{ 
                    color: '#ffffff', 
                    backgroundColor: 'rgba(240, 90, 40, 0.2)',
                    fontWeight: 'bold', 
                    fontSize: '0.85rem',
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.2s ease',
                    border: '1px solid rgba(240, 90, 40, 0.4)'
                  }}
                >
                  ✓
                </div>
                <p style={{ color: '#cbd5e1', fontWeight: '600', fontSize: '0.95rem', margin: '0', transition: 'all 0.2s ease', wordBreak: 'break-word' }}>
                  {req}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
}