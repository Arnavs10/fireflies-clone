'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/Toast';

export default function SettingsPage() {
  const { addToast } = useToast();
  const [name, setName] = useState('Arnav Shukla');
  const [email, setEmail] = useState('arnav@fireflies.ai');
  const [notifications, setNotifications] = useState(true);
  const [autoJoin, setAutoJoin] = useState(true);
  const [language, setLanguage] = useState('en');
  const [retention, setRetention] = useState('12');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (saved) setTheme(saved);
  }, []);

  const handleSave = () => {
    addToast('Settings saved successfully');
  };

  const toggleAppTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <>
      <div className="navbar">
        <div className="navbar-left">
          <h1 className="navbar-title">Settings</h1>
        </div>
        <div className="navbar-right">
          <button className="btn btn-primary btn-sm" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>

      <div className="page-content">
        <div style={{ maxWidth: 640, margin: '0 auto' }}>

          {/* Profile Section */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: 24,
            marginBottom: 20,
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Profile</h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary-400), #E879A8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 22,
                fontWeight: 700,
              }}>AS</div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>{name}</p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{email}</p>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          {/* Appearance */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: 24,
            marginBottom: 20,
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Appearance</h2>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => toggleAppTheme('light')}
                style={{
                  flex: 1,
                  padding: 16,
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${theme === 'light' ? 'var(--primary-500)' : 'var(--border-light)'}`,
                  background: theme === 'light' ? 'var(--primary-50)' : 'var(--bg-card)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 150ms ease',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={theme === 'light' ? 'var(--primary-500)' : 'var(--text-tertiary)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 8px', display: 'block' }}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                <span style={{ fontSize: 13, fontWeight: 600, color: theme === 'light' ? 'var(--primary-500)' : 'var(--text-secondary)' }}>Light</span>
              </button>
              <button
                onClick={() => toggleAppTheme('dark')}
                style={{
                  flex: 1,
                  padding: 16,
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${theme === 'dark' ? 'var(--primary-500)' : 'var(--border-light)'}`,
                  background: theme === 'dark' ? 'var(--primary-50)' : 'var(--bg-card)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 150ms ease',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={theme === 'dark' ? 'var(--primary-500)' : 'var(--text-tertiary)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 8px', display: 'block' }}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                <span style={{ fontSize: 13, fontWeight: 600, color: theme === 'dark' ? 'var(--primary-500)' : 'var(--text-secondary)' }}>Dark</span>
              </button>
            </div>
          </div>

          {/* Preferences */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: 24,
            marginBottom: 20,
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Preferences</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>Email Notifications</p>
                  <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Get notified when meetings are transcribed</p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  style={{
                    width: 44,
                    height: 24,
                    borderRadius: 12,
                    background: notifications ? 'var(--primary-500)' : 'var(--gray-300)',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background 200ms ease',
                    border: 'none',
                  }}
                >
                  <span style={{
                    position: 'absolute',
                    top: 2,
                    left: notifications ? 22 : 2,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: 'white',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    transition: 'left 200ms ease',
                  }} />
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>Auto-join Meetings</p>
                  <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Automatically join scheduled meetings</p>
                </div>
                <button
                  onClick={() => setAutoJoin(!autoJoin)}
                  style={{
                    width: 44,
                    height: 24,
                    borderRadius: 12,
                    background: autoJoin ? 'var(--primary-500)' : 'var(--gray-300)',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background 200ms ease',
                    border: 'none',
                  }}
                >
                  <span style={{
                    position: 'absolute',
                    top: 2,
                    left: autoJoin ? 22 : 2,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: 'white',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    transition: 'left 200ms ease',
                  }} />
                </button>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Transcript Language</label>
                <select
                  className="filter-select"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="hi">Hindi</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Data Retention (months)</label>
                <select
                  className="filter-select"
                  value={retention}
                  onChange={(e) => setRetention(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="6">6 months</option>
                  <option value="12">12 months</option>
                  <option value="24">24 months</option>
                  <option value="unlimited">Unlimited</option>
                </select>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--danger)',
            borderRadius: 'var(--radius-lg)',
            padding: 24,
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: 'var(--danger)' }}>Danger Zone</h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
              Permanently delete your account and all associated data.
            </p>
            <button className="btn btn-danger btn-sm">Delete Account</button>
          </div>

        </div>
      </div>
    </>
  );
}
