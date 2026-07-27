'use client';

const integrations = [
  {
    name: 'Google Meet',
    description: 'Automatically join and transcribe Google Meet calls',
    icon: '🎥',
    status: 'connected',
    color: '#4285F4',
  },
  {
    name: 'Zoom',
    description: 'Record and transcribe Zoom meetings seamlessly',
    icon: '💻',
    status: 'available',
    color: '#2D8CFF',
  },
  {
    name: 'Slack',
    description: 'Post meeting summaries and action items to Slack channels',
    icon: '💬',
    status: 'connected',
    color: '#4A154B',
  },
  {
    name: 'Salesforce',
    description: 'Sync meeting notes and action items to CRM records',
    icon: '☁️',
    status: 'available',
    color: '#00A1E0',
  },
  {
    name: 'HubSpot',
    description: 'Log meeting activities and outcomes to HubSpot CRM',
    icon: '🧡',
    status: 'available',
    color: '#FF7A59',
  },
  {
    name: 'Microsoft Teams',
    description: 'Integrate with Teams for automatic meeting capture',
    icon: '🟣',
    status: 'coming_soon',
    color: '#6264A7',
  },
  {
    name: 'Notion',
    description: 'Export meeting notes and transcripts to Notion pages',
    icon: '📝',
    status: 'coming_soon',
    color: '#000000',
  },
  {
    name: 'Jira',
    description: 'Convert action items into Jira tickets automatically',
    icon: '🔷',
    status: 'coming_soon',
    color: '#0052CC',
  },
];

export default function IntegrationsPage() {
  return (
    <>
      <div className="navbar">
        <div className="navbar-left">
          <h1 className="navbar-title">Integrations</h1>
        </div>
      </div>

      <div className="page-content">
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>
            Connect your favorite tools to enhance your meeting workflow.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}>
            {integrations.map((integration) => (
              <div
                key={integration.name}
                className="card"
                style={{ padding: 20, cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 'var(--radius-md)',
                    background: `${integration.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    flexShrink: 0,
                  }}>
                    {integration.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 600 }}>{integration.name}</h3>
                      {integration.status === 'connected' && (
                        <span style={{
                          fontSize: 10,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          background: 'var(--success-light)',
                          color: '#065F46',
                        }}>Connected</span>
                      )}
                      {integration.status === 'coming_soon' && (
                        <span className="badge badge-coming-soon">Coming Soon</span>
                      )}
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {integration.description}
                    </p>
                  </div>
                </div>

                {integration.status === 'available' && (
                  <button className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                    Connect
                  </button>
                )}
                {integration.status === 'connected' && (
                  <button className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                    Configure
                  </button>
                )}
                {integration.status === 'coming_soon' && (
                  <button className="btn btn-ghost btn-sm" style={{ width: '100%', opacity: 0.5, cursor: 'default' }}>
                    Notify Me
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
