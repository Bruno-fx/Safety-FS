'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../utils/supabase';

interface Application {
  id: number;
  created_at?: string;
  fullName: string;
  idNumber: string;
  phone: string;
  email: string;
  loanType: string;
  loanAmount: string; 
  collateralDetails: string;
  projectSummary: string;
  reviewed: boolean;
  uploadedFiles?: { [key: string]: string };
}

export default function AdminDashboard() {
  const [apps, setApps] = useState<Application[]>([]);
  const [filterMode, setFilterMode] = useState<'All' | 'New' | 'Reviewed'>('All');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔥 UPDATED: Fetch applications from the global Supabase database
  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('loan_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching data:", error);
      } else if (data) {
        setApps(data);
      }
      setIsLoading(false);
    };

    fetchApplications();
  }, []);

  // 🔥 UPDATED: Update the reviewed status directly in Supabase
  const toggleReviewStatus = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Find the current app to toggle its state
    const targetApp = apps.find(app => app.id === id);
    if (!targetApp) return;

    const newReviewedStatus = !targetApp.reviewed;

    // 1. Optimistic UI update (feels instant)
    setApps(apps.map(app => app.id === id ? { ...app, reviewed: newReviewedStatus } : app));
    if (selectedApp && selectedApp.id === id) {
      setSelectedApp({ ...selectedApp, reviewed: newReviewedStatus });
    }

    // 2. Push change to Database
    const { error } = await supabase
      .from('loan_applications')
      .update({ reviewed: newReviewedStatus })
      .eq('id', id);

    if (error) {
      console.error("Failed to update status:", error);
      // Revert UI if database fails
      setApps(apps.map(app => app.id === id ? { ...app, reviewed: targetApp.reviewed } : app));
      if (selectedApp && selectedApp.id === id) setSelectedApp({ ...selectedApp, reviewed: targetApp.reviewed });
    }
  };

  const displayedApps = apps.filter(app => {
    if (filterMode === 'New') return !app.reviewed;
    if (filterMode === 'Reviewed') return app.reviewed;
    return true;
  });

  const pendingCount = apps.filter(a => !a.reviewed).length;

  const getSidebarItemStyle = (mode: 'All' | 'New' | 'Reviewed') => ({
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderRadius: '6px',
    color: filterMode === mode ? '#ffffff' : '#94a3b8',
    backgroundColor: filterMode === mode ? '#0b63b6' : 'transparent',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
    border: 'none',
    width: '100%',
    textAlign: 'left' as const,
    transition: 'all 0.15s ease'
  });

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', width: '100%', boxSizing: 'border-box' }}>
      
      <aside style={{ width: '260px', backgroundColor: '#0f172a', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '30px 16px', boxSizing: 'border-box', position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 8px' }}>
            <img src="/logo.png" alt="Safety Financial Logo" width="38" height="38" style={{ objectFit: 'contain' }} />
            <div>
              <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1rem', fontWeight: '800', letterSpacing: '-0.3px' }}>SAFETY FINANCIAL</h3>
              <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Management Portal</span>
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button onClick={() => setFilterMode('All')} style={getSidebarItemStyle('All')}>All Applications</button>
            <button onClick={() => setFilterMode('New')} style={getSidebarItemStyle('New')}>
              New / Action Required
              {pendingCount > 0 && (
                <span style={{ marginLeft: 'auto', backgroundColor: '#f05a28', color: '#fff', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>
                  {pendingCount}
                </span>
              )}
            </button>
            <button onClick={() => setFilterMode('Reviewed')} style={getSidebarItemStyle('Reviewed')}>Reviewed Archives</button>
          </nav>
        </div>

        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '16px', paddingLeft: '8px', paddingRight: '8px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ffffff', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '700', transition: 'opacity 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            ↩ Go to Home Website
          </Link>
        </div>
      </aside>

      <div style={{ flex: '1', paddingLeft: '260px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', width: '100%' }}>
        
        <div style={{ backgroundColor: '#ffffff', padding: '24px 5%', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ margin: '0', color: '#0f172a', fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
            {filterMode === 'All' ? 'All Received Files' : filterMode === 'New' ? 'New Files Requiring Action' : 'Reviewed Files Archive'}
          </h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.85rem', fontWeight: '500' }}>
            Click on any individual file row ledger below to check requirement parameters and project details.
          </p>
        </div>

        <div style={{ padding: '30px 5%', boxSizing: 'border-box', width: '100%' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto', width: '100%' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569', fontWeight: '700' }}>
                    <th style={{ padding: '16px 20px' }}>Name</th>
                    <th style={{ padding: '16px 20px' }}>Phone Number</th>
                    <th style={{ padding: '16px 20px' }}>Loan Type</th>
                    <th style={{ padding: '16px 20px' }}>Loan Amount</th>
                    <th style={{ padding: '16px 20px', textAlign: 'right' }}>Status Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontWeight: 'bold' }}>
                        Loading Global Pipeline Data...
                      </td>
                    </tr>
                  ) : displayedApps.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>
                        No portfolio files currently populate this filtered pipeline queue view.
                      </td>
                    </tr>
                  ) : (
                    displayedApps.map((app) => (
                      <tr 
                        key={app.id} 
                        onClick={() => setSelectedApp(app)}
                        style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background-color 0.15s ease' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <td style={{ padding: '16px 20px', fontWeight: '700', color: '#0f172a' }}>{app.fullName}</td>
                        <td style={{ padding: '16px 20px', color: '#475569' }}>{app.phone}</td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ border: '1px solid #0b63b6', color: '#0b63b6', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
                            {app.loanType}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px', fontWeight: '700', color: '#0f172a' }}>{app.loanAmount}</td>
                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                          <button
                            onClick={(e) => toggleReviewStatus(app.id, e)}
                            style={{
                              border: '1px solid',
                              borderColor: app.reviewed ? '#10b981' : '#cbd5e1',
                              backgroundColor: app.reviewed ? 'rgba(16, 185, 129, 0.05)' : '#ffffff',
                              color: app.reviewed ? '#10b981' : '#475569',
                              padding: '6px 14px',
                              borderRadius: '4px',
                              fontWeight: '700',
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {app.reviewed ? 'Reviewed' : 'Mark Reviewed'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {selectedApp && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }} onClick={() => setSelectedApp(null)}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '35px', width: '90%', maxWidth: '650px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '85vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8' }}>Dossier ID: #{selectedApp.id}</span>
                  <h3 style={{ margin: '4px 0 0 0', color: '#0f172a', fontSize: '1.4rem', fontWeight: '800' }}>{selectedApp.fullName}</h3>
                </div>
                <button onClick={() => setSelectedApp(null)} style={{ background: 'none', border: 'none', fontSize: '1.3rem', color: '#64748b', cursor: 'pointer', padding: 0 }}>×</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', fontSize: '0.9rem' }}>
                <p style={{ margin: 0 }}><strong>National ID:</strong> {selectedApp.idNumber}</p>
                <p style={{ margin: 0 }}><strong>Email:</strong> {selectedApp.email}</p>
                <p style={{ margin: 0 }}><strong>Phone Vector:</strong> {selectedApp.phone}</p>
                <p style={{ margin: 0 }}><strong>Product Group:</strong> {selectedApp.loanType}</p>
                <p style={{ margin: 0 }}><strong>Requested Capital:</strong> <span style={{ color: '#0b63b6', fontWeight: '700' }}>{selectedApp.loanAmount}</span></p>
                <p style={{ margin: 0, gridColumn: '1 / -1' }}><strong>Collateral Spec:</strong> {selectedApp.collateralDetails}</p>
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '6px', border: '1px solid #f1f5f9' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Project Summary:</span>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#334155', lineHeight: '1.5' }}>{selectedApp.projectSummary}</p>
              </div>

              {selectedApp.uploadedFiles && Object.keys(selectedApp.uploadedFiles).length > 0 && (
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Submitted Verification Files:</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {Object.entries(selectedApp.uploadedFiles).map(([label, name]) => (
                      <div key={label} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '10px 14px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                        <div>
                          <p style={{ margin: '0 0 2px 0', fontWeight: '700', color: '#475569', fontSize: '0.8rem' }}>{label}</p>
                          <span style={{ color: '#0b63b6', fontWeight: '500' }}>📄 {name}</span>
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#10b981', backgroundColor: '#d1fae5', padding: '2px 8px', borderRadius: '4px' }}>Logged</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                <button 
                  onClick={(e) => { toggleReviewStatus(selectedApp.id, e); }}
                  style={{ flex: '1', padding: '12px', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', background: selectedApp.reviewed ? '#f3f4f6' : '#0b63b6', color: selectedApp.reviewed ? '#475569' : '#ffffff' }}
                >
                  {selectedApp.reviewed ? 'Revert to New Action' : 'Mark File as Reviewed'}
                </button>
                <button onClick={() => setSelectedApp(null)} style={{ background: '#ffffff', color: '#475569', border: '1px solid #cbd5e1', padding: '12px 20px', borderRadius: '6px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>Close Review</button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}