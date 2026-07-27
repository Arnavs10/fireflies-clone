'use client';

import { getInitials, getAvatarColor } from '@/lib/api';

const teamMembers = [
  { name: 'Arnav Shukla', email: 'arnav@fireflies.ai', role: 'Admin', status: 'active' },
  { name: 'Sarah Chen', email: 'sarah@fireflies.ai', role: 'Manager', status: 'active' },
  { name: 'Michael Torres', email: 'michael@fireflies.ai', role: 'Engineer', status: 'active' },
  { name: 'Priya Patel', email: 'priya@fireflies.ai', role: 'Designer', status: 'active' },
  { name: 'James Wilson', email: 'james@fireflies.ai', role: 'Engineer', status: 'invited' },
];

export default function TeamPage() {
  return (
    <>
      <div className="navbar">
        <div className="navbar-left">
          <h1 className="navbar-title">Team</h1>
        </div>
        <div className="navbar-right">
          <button className="btn btn-primary btn-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
            Invite Member
          </button>
        </div>
      </div>

      <div className="page-content">
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
            {teamMembers.length} team members · {teamMembers.filter((m) => m.status === 'active').length} active
          </p>

          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}>
            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 120px 100px',
              padding: '12px 20px',
              borderBottom: '1px solid var(--border-light)',
              background: 'var(--gray-50)',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              <span>Member</span>
              <span>Email</span>
              <span>Role</span>
              <span>Status</span>
            </div>

            {/* Team members */}
            {teamMembers.map((member) => (
              <div
                key={member.email}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 120px 100px',
                  padding: '14px 20px',
                  borderBottom: '1px solid var(--border-light)',
                  alignItems: 'center',
                  transition: 'background 150ms ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    className="participant-avatar"
                    style={{
                      backgroundColor: getAvatarColor(member.name),
                      width: 34,
                      height: 34,
                      fontSize: 12,
                      marginLeft: 0,
                    }}
                  >
                    {getInitials(member.name)}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>
                    {member.name}
                  </span>
                </div>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{member.email}</span>
                <span style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: member.role === 'Admin' ? 'var(--primary-500)' : 'var(--text-secondary)',
                }}>
                  {member.role}
                </span>
                <span style={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-full)',
                  background: member.status === 'active' ? 'var(--success-light)' : 'var(--warning-light)',
                  color: member.status === 'active' ? '#065F46' : '#92400E',
                  width: 'fit-content',
                }}>
                  {member.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
