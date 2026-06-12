'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useLang } from '../../context/LanguageContext';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../../utils/supabase';

function ApplicationForm() {
  const { t } = useLang();
  const searchParams = useSearchParams();
  
  const [formStep, setFormStep] = useState(1);
  const [status, setStatus] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '', idNumber: '', email: '', phone: '', loanType: '', loanAmount: '', collateralDetails: '', projectSummary: ''
  });

  const [attachments, setAttachments] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const typeFromUrl = searchParams.get('type');
    const defaultLoans = t('loans') as string[];
    
    setFormData((prev) => ({
      ...prev,
      loanType: typeFromUrl && defaultLoans.includes(typeFromUrl) ? typeFromUrl : defaultLoans[0] || ''
    }));
  }, [searchParams, t]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, reqKey: string) => {
    if (e.target.files && e.target.files[0]) {
      // NOTE: In a full production app, you would upload this file to Supabase Storage buckets here.
      // For now, we are storing the filename string to keep the workflow identical.
      setAttachments(prev => ({ ...prev, [reqKey]: e.target.files![0].name }));
      setUploadError('');
    }
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const requirementsList = t('requirements') as string[];
    const firstRequired = requirementsList[0];
    const secondRequired = requirementsList[1];
    
    if (!attachments[firstRequired] || !attachments[secondRequired]) {
      setUploadError(
        t('lang') === 'rw' 
          ? 'Nyamuneka shyiraho inyandiko zose zitegetswe (Ingwate na Kopi y\'irangamuntu) mbere yo gukomeza.' 
          : 'Please upload all mandatory documents (Collateral and Copy of National ID) before proceeding.'
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setUploadError('');
    setFormStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 🔥 UPDATED: Now an async function pushing to the global Supabase database
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    
    const formattedAmount = formData.loanAmount.toLowerCase().includes('rwf') 
      ? formData.loanAmount 
      : `${Number(formData.loanAmount.replace(/[^0-9]/g, '')).toLocaleString()} RWF`;

    const { data, error } = await supabase
      .from('loan_applications')
      .insert([
        {
          fullName: formData.fullName,
          idNumber: formData.idNumber,
          phone: formData.phone,
          email: formData.email,
          loanType: formData.loanType,
          loanAmount: formattedAmount,
          collateralDetails: formData.collateralDetails,
          projectSummary: formData.projectSummary,
          uploadedFiles: attachments,
          reviewed: false
        }
      ])
      .select();

    setIsSubmitting(false);

    if (error) {
      setUploadError("Database error: Could not submit application.");
      console.error(error);
      return;
    }
    
    setStatus(t('successMsg') + " #" + (data ? data[0].id : 'SYS'));
    setFormStep(1);
    setAttachments({});
    setFormData({ fullName: '', idNumber: '', email: '', phone: '', loanType: (t('loans') as string[])[0], loanAmount: '', collateralDetails: '', projectSummary: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)', padding: '60px 5%', minHeight: '90vh', boxSizing: 'border-box', position: 'relative', overflow: 'hidden', width: '100%' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', background: '#ffffff', padding: '40px', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)', position: 'relative', zIndex: 1 }}>
        
        <div style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '24px', marginBottom: '30px' }}>
          <h2 style={{ color: '#0f172a', fontSize: '2rem', fontWeight: '800', margin: '0', letterSpacing: '-0.5px' }}>{t('formTitle')}</h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '8px 0 0 0', lineHeight: '1.5' }}>{t('formSubtitle')}</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '35px', position: 'relative', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', backgroundColor: '#e2e8f0', zIndex: 1 }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', padding: '0 8px', zIndex: 2, position: 'relative' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#0b63b6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.85rem' }}>1</div>
            <span style={{ fontWeight: '700', fontSize: '0.85rem', color: formStep === 1 ? '#0b63b6' : '#64748b' }}>{t('step1')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', padding: '0 8px', zIndex: 2, position: 'relative' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: formStep >= 2 ? '#0b63b6' : '#e2e8f0', color: formStep >= 2 ? '#fff' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.85rem' }}>2</div>
            <span style={{ fontWeight: '700', fontSize: '0.85rem', color: formStep === 2 ? '#0b63b6' : '#64748b' }}>{t('step2')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', padding: '0 8px', zIndex: 2, position: 'relative' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: formStep === 3 ? '#f05a28' : '#e2e8f0', color: formStep === 3 ? '#fff' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.85rem' }}>3</div>
            <span style={{ fontWeight: '700', fontSize: '0.85rem', color: formStep === 3 ? '#f05a28' : '#64748b' }}>{t('step3')}</span>
          </div>
        </div>
        
        {status && <div style={{ background: '#dcfce7', color: '#15803d', padding: '16px', borderRadius: '8px', fontWeight: '600', marginBottom: '30px', border: '1px solid #bbf7d0' }}>{status}</div>}
        {uploadError && <div style={{ background: '#f8d7da', color: '#721c24', padding: '16px', borderRadius: '8px', fontWeight: '600', marginBottom: '30px', border: '1px solid #f5c6cb' }}>⚠ {uploadError}</div>}

        {formStep === 1 && (
          <form onSubmit={handleStep1Submit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '700', color: '#334155', fontSize: '0.9rem', marginBottom: '6px' }}>{t('labelName')}</label>
              <input type="text" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '700', color: '#334155', fontSize: '0.9rem', marginBottom: '6px' }}>{t('labelID')}</label>
              <input type="text" required value={formData.idNumber} onChange={e => setFormData({...formData, idNumber: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '700', color: '#334155', fontSize: '0.9rem', marginBottom: '6px' }}>{t('labelPhone')}</label>
                <input type="text" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '700', color: '#334155', fontSize: '0.9rem', marginBottom: '6px' }}>{t('labelEmail')}</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '700', color: '#334155', fontSize: '0.9rem', marginBottom: '6px' }}>{t('labelProduct')}</label>
                <select value={formData.loanType} onChange={e => setFormData({...formData, loanType: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', boxSizing: 'border-box', height: '45px' }}>
                  {(t('loans') as string[]).map((loan, idx) => <option key={idx} value={loan}>{loan}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '700', color: '#334155', fontSize: '0.9rem', marginBottom: '6px' }}>{t('labelAmount')}</label>
                <input type="text" required placeholder="E.g., 2,500,000" value={formData.loanAmount} onChange={e => setFormData({...formData, loanAmount: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '700', color: '#334155', fontSize: '0.9rem', marginBottom: '6px' }}>{t('labelCollateral')}</label>
              <input type="text" required value={formData.collateralDetails} onChange={e => setFormData({...formData, collateralDetails: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '700', color: '#334155', fontSize: '0.9rem', marginBottom: '6px' }}>{t('labelSummary')}</label>
              <textarea rows={3} required value={formData.projectSummary} onChange={e => setFormData({...formData, projectSummary: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontFamily: 'inherit', boxSizing: 'border-box' }}></textarea>
            </div>
            <button type="submit" style={{ background: '#0b63b6', color: '#ffffff', padding: '14px', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(11, 99, 182, 0.2)' }}>
              {t('btnContinue')}
            </button>
          </form>
        )}

        {formStep === 2 && (
          <form onSubmit={handleStep2Submit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569', fontWeight: '600' }}>{t('uploadDesc')}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {(t('requirements') as string[]).map((req, idx) => (
                <div key={idx} style={{ background: '#f8fafc', padding: '14px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ flex: '1', minWidth: '200px' }}>
                    <p style={{ margin: 0, fontWeight: '700', fontSize: '0.9rem', color: '#334155' }}>
                      {req} {idx < 2 && <span style={{ color: '#dc3545' }}>*</span>}
                    </p>
                    {attachments[req] && <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: '600' }}>✓ {t('fileAttached')}: {attachments[req]}</span>}
                  </div>
                  <label style={{ backgroundColor: attachments[req] ? '#e2e8f0' : 'rgba(240, 90, 40, 0.1)', color: attachments[req] ? '#475569' : '#f05a28', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '0.8rem', border: '1px dashed ' + (attachments[req] ? '#cbd5e1' : '#f05a28') }}>
                    {attachments[req] ? t('fileChange') : t('fileChoose')}
                    <input type="file" onChange={(e) => handleFileChange(e, req)} style={{ display: 'none' }} />
                  </label>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '14px', marginTop: '10px' }}>
              <button type="button" onClick={() => setFormStep(1)} style={{ background: '#fff', color: '#64748b', padding: '14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', flex: '1' }}>{t('btnBack')}</button>
              <button type="submit" style={{ background: '#0b63b6', color: '#fff', padding: '14px', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', flex: '2' }}>{t('btnNextSubmit')}</button>
            </div>
          </form>
        )}

        {formStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h3 style={{ color: '#0f172a', fontSize: '1.3rem', fontWeight: '800', margin: '0' }}>{t('reviewTitle')}</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '4px 0 0 0' }}>{t('reviewDesc')}</p>
            </div>

            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <p style={{ margin: 0 }}><strong>{t('labelName')}:</strong> {formData.fullName}</p>
              <p style={{ margin: 0 }}><strong>{t('labelID')}:</strong> {formData.idNumber}</p>
              <p style={{ margin: 0 }}><strong>{t('labelPhone')}:</strong> {formData.phone}</p>
              <p style={{ margin: 0 }}><strong>{t('labelEmail')}:</strong> {formData.email}</p>
              <p style={{ margin: 0 }}><strong>{t('labelProduct')}:</strong> {formData.loanType}</p>
              <p style={{ margin: 0 }}><strong>{t('labelAmount')}:</strong> {formData.loanAmount}</p>
              <p style={{ margin: 0 }}><strong>{t('labelCollateral')}:</strong> {formData.collateralDetails}</p>
              <p style={{ margin: 0 }}><strong>{t('labelSummary')}:</strong> {formData.projectSummary}</p>
            </div>

            <div>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', color: '#334155', fontWeight: '700' }}>{t('reviewFiles')}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.keys(attachments).length === 0 ? (
                  <p style={{ fontSize: '0.9rem', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>{t('reviewNoFiles')}</p>
                ) : (
                  Object.entries(attachments).map(([key, value]) => (
                    <div key={key} style={{ fontSize: '0.9rem', color: '#475569', background: '#f1f5f9', padding: '8px 12px', borderRadius: '4px' }}>
                      📎 <strong>{key}:</strong> {value}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', marginTop: '10px' }}>
              <button type="button" onClick={() => setFormStep(2)} style={{ background: '#fff', color: '#64748b', padding: '14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', flex: '1' }}>{t('btnBack')}</button>
              <button type="button" onClick={handleFinalSubmit} disabled={isSubmitting} style={{ background: isSubmitting ? '#cbd5e1' : '#f05a28', color: '#ffffff', padding: '14px', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: isSubmitting ? 'not-allowed' : 'pointer', flex: '2', boxShadow: '0 4px 14px rgba(240, 90, 40, 0.3)' }}>
                {isSubmitting ? 'Submitting...' : t('btnFinalSubmit')}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', fontWeight: 'bold' }}>Loading parameters...</div>}>
      <ApplicationForm />
    </Suspense>
  );
}