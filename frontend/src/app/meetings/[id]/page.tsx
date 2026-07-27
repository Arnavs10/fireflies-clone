'use client';

import { useState, useEffect, useRef, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import type { MeetingDetail, ActionItemCreate } from '@/lib/types';
import {
  getMeeting,
  updateActionItem,
  createActionItem,
  deleteActionItem,
  formatDuration,
  formatTime,
  formatDateTime,
  getInitials,
  getAvatarColor,
} from '@/lib/api';
import { useToast } from '@/components/Toast';

export default function MeetingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addToast } = useToast();

  const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Transcript
  const [transcriptSearch, setTranscriptSearch] = useState('');
  const [activeSegmentId, setActiveSegmentId] = useState<number | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  // Media player
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const playerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Action items
  const [newActionText, setNewActionText] = useState('');
  const [newActionAssignee, setNewActionAssignee] = useState('');
  const [showAddAction, setShowAddAction] = useState(false);
  const [editingActionId, setEditingActionId] = useState<number | null>(null);
  const [editActionText, setEditActionText] = useState('');

  // Export
  const [showExportMenu, setShowExportMenu] = useState(false);

  const meetingId = parseInt(resolvedParams.id);

  const fetchMeeting = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMeeting(meetingId);
      setMeeting(data);
    } catch {
      addToast('Failed to load meeting', 'error');
    } finally {
      setLoading(false);
    }
  }, [meetingId, addToast]);

  useEffect(() => {
    fetchMeeting();
  }, [fetchMeeting]);

  // Player logic
  useEffect(() => {
    if (isPlaying && meeting) {
      playerIntervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.1 * playbackSpeed;
          if (next >= meeting.duration) {
            setIsPlaying(false);
            return meeting.duration;
          }
          return next;
        });
      }, 100);
    }
    return () => {
      if (playerIntervalRef.current) clearInterval(playerIntervalRef.current);
    };
  }, [isPlaying, playbackSpeed, meeting]);

  // Auto-highlight transcript segment based on current time
  useEffect(() => {
    if (!meeting) return;
    const activeSegment = meeting.transcript_segments.find(
      (seg) => currentTime >= seg.start_time && currentTime <= seg.end_time
    );
    if (activeSegment) {
      setActiveSegmentId(activeSegment.id);
    }
  }, [currentTime, meeting]);

  const seekTo = (time: number) => {
    setCurrentTime(time);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const cycleSpeed = () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const idx = speeds.indexOf(playbackSpeed);
    setPlaybackSpeed(speeds[(idx + 1) % speeds.length]);
  };

  const handleSegmentClick = (startTime: number, segId: number) => {
    seekTo(startTime);
    setActiveSegmentId(segId);
    if (!isPlaying) setIsPlaying(true);
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!meeting) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    seekTo(percent * meeting.duration);
  };

  // Action items
  const handleToggleAction = async (itemId: number, completed: boolean) => {
    try {
      await updateActionItem(itemId, { completed: !completed });
      fetchMeeting();
    } catch {
      addToast('Failed to update action item', 'error');
    }
  };

  const handleAddAction = async () => {
    if (!newActionText.trim()) return;
    try {
      const data: ActionItemCreate = {
        text: newActionText.trim(),
        assignee: newActionAssignee.trim() || undefined,
      };
      await createActionItem(meetingId, data);
      setNewActionText('');
      setNewActionAssignee('');
      setShowAddAction(false);
      addToast('Action item added');
      fetchMeeting();
    } catch {
      addToast('Failed to add action item', 'error');
    }
  };

  const handleDeleteAction = async (itemId: number) => {
    try {
      await deleteActionItem(itemId);
      addToast('Action item deleted');
      fetchMeeting();
    } catch {
      addToast('Failed to delete action item', 'error');
    }
  };

  const handleEditAction = async (itemId: number) => {
    if (!editActionText.trim()) return;
    try {
      await updateActionItem(itemId, { text: editActionText.trim() });
      setEditingActionId(null);
      addToast('Action item updated');
      fetchMeeting();
    } catch {
      addToast('Failed to update action item', 'error');
    }
  };

  // Export
  const exportTranscript = (format: 'txt' | 'md') => {
    if (!meeting) return;
    let content = '';

    if (format === 'md') {
      content += `# ${meeting.title}\n\n`;
      content += `**Date:** ${formatDateTime(meeting.date)}\n`;
      content += `**Duration:** ${formatDuration(meeting.duration)}\n`;
      content += `**Participants:** ${meeting.participants.join(', ')}\n\n`;
      if (meeting.summary) {
        content += `## Summary\n\n${meeting.summary}\n\n`;
      }
      if (meeting.key_topics?.length) {
        content += `## Key Topics\n\n${meeting.key_topics.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\n`;
      }
      content += `## Transcript\n\n`;
      meeting.transcript_segments.forEach((seg) => {
        content += `**${seg.speaker}** *(${formatTime(seg.start_time)})*: ${seg.text}\n\n`;
      });
      if (meeting.action_items.length) {
        content += `## Action Items\n\n`;
        meeting.action_items.forEach((item) => {
          content += `- [${item.completed ? 'x' : ' '}] ${item.text}${item.assignee ? ` — *${item.assignee}*` : ''}\n`;
        });
      }
    } else {
      content += `${meeting.title}\n${'='.repeat(meeting.title.length)}\n\n`;
      content += `Date: ${formatDateTime(meeting.date)}\n`;
      content += `Duration: ${formatDuration(meeting.duration)}\n`;
      content += `Participants: ${meeting.participants.join(', ')}\n\n`;
      if (meeting.summary) {
        content += `Summary\n-------\n${meeting.summary}\n\n`;
      }
      content += `Transcript\n----------\n`;
      meeting.transcript_segments.forEach((seg) => {
        content += `[${formatTime(seg.start_time)}] ${seg.speaker}: ${seg.text}\n`;
      });
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meeting.title.replace(/[^a-zA-Z0-9]/g, '_')}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
    addToast(`Exported as ${format.toUpperCase()}`);
  };

  // Filter transcript
  const filteredSegments = meeting?.transcript_segments.filter((seg) => {
    if (!transcriptSearch) return true;
    return (
      seg.text.toLowerCase().includes(transcriptSearch.toLowerCase()) ||
      seg.speaker.toLowerCase().includes(transcriptSearch.toLowerCase())
    );
  }) || [];

  const matchCount = transcriptSearch
    ? meeting?.transcript_segments.filter(
        (seg) =>
          seg.text.toLowerCase().includes(transcriptSearch.toLowerCase()) ||
          seg.speaker.toLowerCase().includes(transcriptSearch.toLowerCase())
      ).length || 0
    : 0;

  // Highlight search matches in text
  const highlightText = (text: string) => {
    if (!transcriptSearch) return text;
    const regex = new RegExp(`(${transcriptSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? <mark key={i}>{part}</mark> : part
    );
  };

  if (loading) {
    return (
      <>
        <div className="navbar">
          <div className="navbar-left">
            <div className="skeleton" style={{ width: 200, height: 20 }} />
          </div>
        </div>
        <div style={{ display: 'flex', flex: 1 }}>
          <div style={{ width: '55%', padding: 28 }}>
            <div className="skeleton skeleton-title" style={{ width: '80%' }} />
            <div className="skeleton skeleton-text" />
            <div className="skeleton skeleton-text" style={{ width: '60%' }} />
          </div>
          <div style={{ width: '45%', padding: 20 }}>
            <div className="skeleton skeleton-title" style={{ width: '40%' }} />
            <div className="skeleton skeleton-text" />
            <div className="skeleton skeleton-text" />
          </div>
        </div>
      </>
    );
  }

  if (!meeting) {
    return (
      <div className="empty-state" style={{ marginTop: 100 }}>
        <h3 className="empty-state-title">Meeting not found</h3>
        <button className="btn btn-primary" onClick={() => router.push('/')}>Back to Meetings</button>
      </div>
    );
  }

  return (
    <>
      {/* Navbar */}
      <div className="navbar">
        <div className="navbar-left">
          <div className="navbar-breadcrumb">
            <a href="/" onClick={(e) => { e.preventDefault(); router.push('/'); }}>Meetings</a>
            <span>/</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{meeting.title}</span>
          </div>
        </div>
        <div className="navbar-right">
          <div style={{ position: 'relative' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowExportMenu(!showExportMenu)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export
            </button>
            {showExportMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 4,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 10,
                minWidth: 160,
                animation: 'slideDown 0.15s ease',
              }}>
                <button
                  onClick={() => exportTranscript('md')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 14px',
                    width: '100%',
                    fontSize: 13,
                    color: 'var(--text-primary)',
                    transition: 'background 150ms',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  Export as Markdown
                </button>
                <button
                  onClick={() => exportTranscript('txt')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 14px',
                    width: '100%',
                    fontSize: 13,
                    color: 'var(--text-primary)',
                    transition: 'background 150ms',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  Export as Text
                </button>
              </div>
            )}
          </div>
          <button className="btn btn-primary btn-sm" style={{ opacity: 0.6, cursor: 'default' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            Share
          </button>
        </div>
      </div>

      <div className="meeting-detail">
        {/* Header */}
        <div className="meeting-detail-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h1 className="meeting-detail-title">{meeting.title}</h1>
            <span className={`meeting-card-type type-${meeting.meeting_type}`}>
              {meeting.meeting_type}
            </span>
          </div>
          <div className="meeting-detail-meta">
            <span className="meeting-detail-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {formatDateTime(meeting.date)}
            </span>
            <span className="meeting-detail-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {formatDuration(meeting.duration)}
            </span>
            <span className="meeting-detail-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
              {meeting.participants.join(', ')}
            </span>
          </div>
        </div>

        {/* Split Panel Body */}
        <div className="meeting-detail-body">
          {/* Left: Summary Panel */}
          <div className="summary-panel">
            {/* AI Summary */}
            {meeting.summary && (
              <div className="summary-section">
                <div className="summary-section-header">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  AI Summary
                </div>
                <p className="summary-text">{meeting.summary}</p>
              </div>
            )}

            {/* Key Topics */}
            {meeting.key_topics && meeting.key_topics.length > 0 && (
              <div className="summary-section">
                <div className="summary-section-header">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                  Key Topics
                </div>
                <div className="key-topics-list">
                  {meeting.key_topics.map((topic, i) => (
                    <div key={i} className="key-topic-item">
                      <span className="topic-number">{i + 1}</span>
                      {topic}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Items */}
            <div className="summary-section">
              <div className="summary-section-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Action Items
                <span style={{
                  fontSize: 11,
                  fontWeight: 600,
                  background: 'var(--primary-100)',
                  color: 'var(--primary-600)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                }}>
                  {meeting.action_items.filter((a) => a.completed).length}/{meeting.action_items.length}
                </span>
              </div>
              <div className="action-items-list">
                {meeting.action_items.map((item) => (
                  <div key={item.id} className="action-item">
                    <button
                      className={`action-item-checkbox ${item.completed ? 'checked' : ''}`}
                      onClick={() => handleToggleAction(item.id, item.completed)}
                    >
                      {item.completed && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                    </button>
                    <div className="action-item-content">
                      {editingActionId === item.id ? (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <input
                            className="form-input"
                            value={editActionText}
                            onChange={(e) => setEditActionText(e.target.value)}
                            style={{ height: 32, fontSize: 13 }}
                            onKeyDown={(e) => e.key === 'Enter' && handleEditAction(item.id)}
                            autoFocus
                          />
                          <button className="btn btn-primary btn-sm" onClick={() => handleEditAction(item.id)}>Save</button>
                          <button className="btn btn-ghost btn-sm" onClick={() => setEditingActionId(null)}>Cancel</button>
                        </div>
                      ) : (
                        <>
                          <p className={`action-item-text ${item.completed ? 'completed' : ''}`}>
                            {item.text}
                          </p>
                          <div className="action-item-meta">
                            {item.assignee && (
                              <span className="action-item-assignee">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                {item.assignee}
                              </span>
                            )}
                            {item.due_date && (
                              <span>Due: {item.due_date}</span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                    <div className="action-item-actions">
                      <button
                        className="action-item-action-btn"
                        title="Edit"
                        onClick={() => { setEditingActionId(item.id); setEditActionText(item.text); }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button
                        className="action-item-action-btn danger"
                        title="Delete"
                        onClick={() => handleDeleteAction(item.id)}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {showAddAction ? (
                <div style={{ marginTop: 10, padding: '12px 14px', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
                  <input
                    className="form-input"
                    placeholder="What needs to be done?"
                    value={newActionText}
                    onChange={(e) => setNewActionText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddAction()}
                    style={{ marginBottom: 8, height: 36, fontSize: 13 }}
                    autoFocus
                  />
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      className="form-input"
                      placeholder="Assignee (optional)"
                      value={newActionAssignee}
                      onChange={(e) => setNewActionAssignee(e.target.value)}
                      style={{ height: 36, fontSize: 13, flex: 1 }}
                    />
                    <button className="btn btn-primary btn-sm" onClick={handleAddAction}>Add</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setShowAddAction(false)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button className="add-action-item" onClick={() => setShowAddAction(true)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Add action item
                </button>
              )}
            </div>
          </div>

          {/* Right: Transcript Panel */}
          <div className="transcript-panel">
            <div className="transcript-header">
              <h3>Transcript</h3>
              <div className="transcript-search">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  placeholder="Search transcript..."
                  value={transcriptSearch}
                  onChange={(e) => setTranscriptSearch(e.target.value)}
                />
              </div>
              {transcriptSearch && (
                <span className="transcript-search-count">
                  {matchCount} match{matchCount !== 1 ? 'es' : ''}
                </span>
              )}
            </div>
            <div className="transcript-body" ref={transcriptRef}>
              {filteredSegments.length === 0 ? (
                <div className="empty-state" style={{ padding: '40px 20px' }}>
                  <p className="empty-state-text">
                    {transcriptSearch ? 'No matching segments found' : 'No transcript available'}
                  </p>
                </div>
              ) : (
                filteredSegments.map((seg) => (
                  <div
                    key={seg.id}
                    className={`transcript-segment ${activeSegmentId === seg.id ? 'active' : ''} ${transcriptSearch && (seg.text.toLowerCase().includes(transcriptSearch.toLowerCase()) || seg.speaker.toLowerCase().includes(transcriptSearch.toLowerCase())) ? 'highlight' : ''}`}
                    onClick={() => handleSegmentClick(seg.start_time, seg.id)}
                  >
                    <div
                      className="transcript-avatar"
                      style={{ backgroundColor: getAvatarColor(seg.speaker) }}
                    >
                      {getInitials(seg.speaker)}
                    </div>
                    <div className="transcript-segment-content">
                      <div className="transcript-segment-header">
                        <span className="transcript-speaker">{seg.speaker}</span>
                        <span className="transcript-time" onClick={(e) => { e.stopPropagation(); seekTo(seg.start_time); }}>
                          {formatTime(seg.start_time)}
                        </span>
                      </div>
                      <p className="transcript-text">
                        {highlightText(seg.text)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Media Player */}
        <div className="media-player">
          <div className="player-controls">
            <button className="player-btn" onClick={() => seekTo(Math.max(0, currentTime - 10))}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>
            </button>
            <button className="player-btn play" onClick={togglePlayback}>
              {isPlaying ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              )}
            </button>
            <button className="player-btn" onClick={() => seekTo(Math.min(meeting.duration, currentTime + 10))}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>
            </button>
          </div>

          <div className="player-progress">
            <span className="player-time">{formatTime(currentTime)}</span>
            <div className="player-track" onClick={handleTrackClick}>
              <div
                className="player-track-fill"
                style={{ width: `${(currentTime / meeting.duration) * 100}%` }}
              />
            </div>
            <span className="player-time">{formatTime(meeting.duration)}</span>
          </div>

          <button className="player-speed" onClick={cycleSpeed}>
            {playbackSpeed}x
          </button>
        </div>
      </div>
    </>
  );
}
