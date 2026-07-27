'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { SearchResult } from '@/lib/types';
import { globalSearch, formatTime, getInitials, getAvatarColor } from '@/lib/api';

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      setHasSearched(true);
      try {
        const data = await globalSearch(query);
        setResults(data);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const getMatchBadge = (type: string) => {
    const styles: Record<string, { bg: string; color: string }> = {
      title: { bg: 'var(--success-light)', color: '#065F46' },
      summary: { bg: 'var(--info-light)', color: '#1E40AF' },
      transcript: { bg: 'var(--primary-50)', color: 'var(--primary-600)' },
      action_item: { bg: 'var(--warning-light)', color: '#92400E' },
    };
    return styles[type] || styles.title;
  };

  // Group results by meeting
  const groupedResults = results.reduce<Record<number, { title: string; items: SearchResult[] }>>((acc, r) => {
    if (!acc[r.meeting_id]) {
      acc[r.meeting_id] = { title: r.meeting_title, items: [] };
    }
    acc[r.meeting_id].items.push(r);
    return acc;
  }, {});

  return (
    <>
      <div className="navbar">
        <div className="navbar-left">
          <h1 className="navbar-title">Search</h1>
        </div>
      </div>

      <div className="page-content">
        {/* Search Input */}
        <div style={{
          maxWidth: 720,
          margin: '0 auto 32px',
        }}>
          <div className="search-input-wrapper" style={{ minWidth: 'unset' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search across all meetings, transcripts, and action items..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              style={{ height: 52, fontSize: 16, paddingLeft: 48, borderRadius: 'var(--radius-lg)' }}
            />
          </div>
          {!query && (
            <p style={{ textAlign: 'center', marginTop: 12, fontSize: 13, color: 'var(--text-tertiary)' }}>
              Search across meeting titles, summaries, transcripts, and action items
            </p>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <p style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>Searching...</p>
          </div>
        )}

        {/* Results */}
        {!loading && hasSearched && results.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <h3 className="empty-state-title">No results found</h3>
            <p className="empty-state-text">
              No matches for &quot;{query}&quot;. Try a different search term.
            </p>
          </div>
        )}

        {!loading && Object.keys(groupedResults).length > 0 && (
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
              {results.length} result{results.length !== 1 ? 's' : ''} across {Object.keys(groupedResults).length} meeting{Object.keys(groupedResults).length !== 1 ? 's' : ''}
            </p>

            {Object.entries(groupedResults).map(([meetingId, group]) => (
              <div key={meetingId} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: 16,
                overflow: 'hidden',
              }}>
                {/* Meeting header */}
                <div
                  onClick={() => router.push(`/meetings/${meetingId}`)}
                  style={{
                    padding: '14px 18px',
                    borderBottom: '1px solid var(--border-light)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    transition: 'background 150ms ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {group.title}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-tertiary)', marginLeft: 'auto' }}>
                    {group.items.length} match{group.items.length !== 1 ? 'es' : ''}
                  </span>
                </div>

                {/* Results within meeting */}
                {group.items.map((result, i) => {
                  const badgeStyle = getMatchBadge(result.match_type);
                  return (
                    <div
                      key={i}
                      onClick={() => router.push(`/meetings/${result.meeting_id}`)}
                      style={{
                        padding: '12px 18px',
                        cursor: 'pointer',
                        borderBottom: i < group.items.length - 1 ? '1px solid var(--border-light)' : 'none',
                        transition: 'background 150ms ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{
                          fontSize: 10,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          background: badgeStyle.bg,
                          color: badgeStyle.color,
                        }}>
                          {result.match_type.replace('_', ' ')}
                        </span>
                        {result.speaker && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-secondary)' }}>
                            <span style={{
                              width: 18,
                              height: 18,
                              borderRadius: '50%',
                              background: getAvatarColor(result.speaker),
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 8,
                              color: 'white',
                              fontWeight: 600,
                            }}>{getInitials(result.speaker)}</span>
                            {result.speaker}
                          </span>
                        )}
                        {result.timestamp !== undefined && result.timestamp !== null && (
                          <span style={{ fontSize: 11, color: 'var(--primary-500)', fontWeight: 500 }}>
                            {formatTime(result.timestamp)}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        {result.matched_text}
                      </p>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* Empty state when no query */}
        {!query && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <h3 className="empty-state-title">Global Search</h3>
            <p className="empty-state-text">
              Search across all your meetings, transcripts, summaries, and action items in one place.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
