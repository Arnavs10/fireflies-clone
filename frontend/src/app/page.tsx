'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { MeetingListItem, MeetingCreate, SearchResult } from '@/lib/types';
import {
  getMeetings,
  createMeeting,
  deleteMeeting,
  updateMeeting,
  globalSearch,
  formatDuration,
  formatDate,
  getInitials,
  getAvatarColor,
} from '@/lib/api';
import { useToast } from '@/components/Toast';
import CreateMeetingModal from '@/components/CreateMeetingModal';

export default function DashboardPage() {
  const router = useRouter();
  const { addToast } = useToast();

  const [meetings, setMeetings] = useState<MeetingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<MeetingListItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MeetingListItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editParticipants, setEditParticipants] = useState('');

  // Global search state
  const [globalSearchMode, setGlobalSearchMode] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const fetchMeetings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMeetings({
        search: search || undefined,
        meeting_type: typeFilter || undefined,
        sort_by: sortBy,
        sort_order: 'desc',
      });
      setMeetings(data);
    } catch {
      addToast('Failed to load meetings', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter, sortBy, addToast]);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  // Debounced global search
  useEffect(() => {
    if (!globalSearchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const results = await globalSearch(globalSearchQuery);
        setSearchResults(results);
      } catch {
        // silently fail
      } finally {
        setSearchLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [globalSearchQuery]);

  const handleCreate = async (data: MeetingCreate) => {
    try {
      await createMeeting(data);
      addToast('Meeting created successfully');
      setShowCreateModal(false);
      fetchMeetings();
    } catch {
      addToast('Failed to create meeting', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMeeting(deleteTarget.id);
      addToast('Meeting deleted');
      setDeleteTarget(null);
      fetchMeetings();
    } catch {
      addToast('Failed to delete meeting', 'error');
    }
  };

  const handleEdit = async () => {
    if (!editingMeeting) return;
    try {
      await updateMeeting(editingMeeting.id, {
        title: editTitle,
        participants: editParticipants.split(',').map((p) => p.trim()).filter(Boolean),
      });
      addToast('Meeting updated');
      setEditingMeeting(null);
      fetchMeetings();
    } catch {
      addToast('Failed to update meeting', 'error');
    }
  };

  const openEdit = (m: MeetingListItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingMeeting(m);
    setEditTitle(m.title);
    setEditParticipants(m.participants.join(', '));
  };

  return (
    <>
      {/* Navbar */}
      <div className="navbar">
        <div className="navbar-left">
          <h1 className="navbar-title">Meetings</h1>
        </div>
        <div className="navbar-right">
          <button
            className="navbar-icon-btn"
            title="Global Search"
            onClick={() => setGlobalSearchMode(!globalSearchMode)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
          <button className="navbar-icon-btn" title="Notifications">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowCreateModal(true)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Meeting
          </button>
        </div>
      </div>

      <div className="page-content">
        {/* Global Search Panel */}
        {globalSearchMode && (
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            padding: 20,
            marginBottom: 24,
            animation: 'slideDown 0.2s ease',
          }}>
            <div style={{ position: 'relative' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search across all meetings, transcripts, and action items..."
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                autoFocus
                style={{ fontSize: 15, height: 48 }}
              />
            </div>

            {searchLoading && (
              <p style={{ padding: '16px 0', color: 'var(--text-tertiary)', fontSize: 13 }}>Searching...</p>
            )}

            {searchResults.length > 0 && (
              <div style={{ marginTop: 16, maxHeight: 400, overflowY: 'auto' }}>
                {searchResults.map((result, i) => (
                  <div
                    key={i}
                    onClick={() => router.push(`/meetings/${result.meeting_id}`)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'background 150ms ease',
                      borderBottom: '1px solid var(--border-light)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{
                        fontSize: 10,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-full)',
                        background: result.match_type === 'transcript' ? 'var(--primary-50)' : result.match_type === 'title' ? 'var(--success-light)' : 'var(--warning-light)',
                        color: result.match_type === 'transcript' ? 'var(--primary-600)' : result.match_type === 'title' ? '#065F46' : '#92400E',
                      }}>
                        {result.match_type}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                        {result.meeting_title}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {result.speaker && <strong>{result.speaker}: </strong>}
                      {result.matched_text}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {!searchLoading && globalSearchQuery && searchResults.length === 0 && (
              <p style={{ padding: '16px 0', color: 'var(--text-tertiary)', fontSize: 13, textAlign: 'center' }}>
                No results found for &quot;{globalSearchQuery}&quot;
              </p>
            )}
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="search-filter-bar">
          <div className="search-input-wrapper">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search meetings by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="general">General</option>
            <option value="standup">Standup</option>
            <option value="sales">Sales</option>
            <option value="interview">Interview</option>
          </select>

          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
            <option value="duration">Sort by Duration</option>
          </select>
        </div>

        {/* Meetings Count */}
        <p className="meetings-count">
          {loading ? 'Loading...' : `${meetings.length} meeting${meetings.length !== 1 ? 's' : ''}`}
        </p>

        {/* Meeting Cards */}
        {loading ? (
          <div className="meetings-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="meeting-card" style={{ opacity: 0.6 }}>
                <div className="skeleton skeleton-title" />
                <div className="skeleton skeleton-text" style={{ width: '80%' }} />
                <div className="skeleton skeleton-text" style={{ width: '40%' }} />
              </div>
            ))}
          </div>
        ) : meetings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <h3 className="empty-state-title">No meetings found</h3>
            <p className="empty-state-text">
              {search || typeFilter
                ? 'Try adjusting your filters or search terms'
                : 'Create your first meeting to get started'}
            </p>
            {!search && !typeFilter && (
              <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                New Meeting
              </button>
            )}
          </div>
        ) : (
          <div className="meetings-grid">
            {meetings.map((meeting) => (
              <div
                key={meeting.id}
                className="meeting-card"
                onClick={() => router.push(`/meetings/${meeting.id}`)}
              >
                <div className="meeting-card-header">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <h3 className="meeting-card-title">{meeting.title}</h3>
                      <span className={`meeting-card-type type-${meeting.meeting_type}`}>
                        {meeting.meeting_type}
                      </span>
                    </div>
                    <div className="meeting-card-meta">
                      <span className="meeting-card-meta-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        {formatDate(meeting.date)}
                      </span>
                      <span className="meeting-card-meta-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {formatDuration(meeting.duration)}
                      </span>
                      <span className="meeting-card-meta-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        {meeting.completed_action_items}/{meeting.action_item_count} tasks
                      </span>
                    </div>
                  </div>
                </div>

                <div className="meeting-card-participants">
                  {meeting.participants.slice(0, 4).map((p, i) => (
                    <div
                      key={i}
                      className="participant-avatar"
                      style={{ backgroundColor: getAvatarColor(p) }}
                      title={p}
                    >
                      {getInitials(p)}
                    </div>
                  ))}
                  {meeting.participants.length > 4 && (
                    <div
                      className="participant-avatar"
                      style={{ backgroundColor: 'var(--gray-400)', fontSize: 10 }}
                    >
                      +{meeting.participants.length - 4}
                    </div>
                  )}
                </div>

                {meeting.tags && meeting.tags.length > 0 && (
                  <div className="meeting-card-tags">
                    {meeting.tags.slice(0, 4).map((tag, i) => (
                      <span key={i} className="tag">{tag}</span>
                    ))}
                    {meeting.tags.length > 4 && (
                      <span className="tag">+{meeting.tags.length - 4}</span>
                    )}
                  </div>
                )}

                <div className="meeting-card-actions">
                  <button
                    className="meeting-card-action-btn"
                    title="Edit"
                    onClick={(e) => openEdit(meeting, e)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button
                    className="meeting-card-action-btn danger"
                    title="Delete"
                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(meeting); }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Meeting Modal */}
      {showCreateModal && (
        <CreateMeetingModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreate}
        />
      )}

      {/* Edit Meeting Modal */}
      {editingMeeting && (
        <div className="modal-overlay" onClick={() => setEditingMeeting(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit Meeting</h2>
              <button className="modal-close" onClick={() => setEditingMeeting(null)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  className="form-input"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Participants</label>
                <input
                  className="form-input"
                  value={editParticipants}
                  onChange={(e) => setEditParticipants(e.target.value)}
                  placeholder="Comma-separated names"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setEditingMeeting(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <div className="modal-header">
              <h2 className="modal-title">Delete Meeting</h2>
              <button className="modal-close" onClick={() => setDeleteTarget(null)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Are you sure you want to delete <strong>&quot;{deleteTarget.title}&quot;</strong>? This will permanently remove the meeting, its transcript, and all action items. This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete Meeting</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
