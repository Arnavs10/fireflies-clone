'use client';

import { useState } from 'react';
import type { MeetingCreate, TranscriptSegmentCreate } from '@/lib/types';

interface CreateMeetingModalProps {
  onClose: () => void;
  onCreate: (data: MeetingCreate) => void;
}

export default function CreateMeetingModal({ onClose, onCreate }: CreateMeetingModalProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [duration, setDuration] = useState('30');
  const [participants, setParticipants] = useState('');
  const [meetingType, setMeetingType] = useState('general');
  const [tags, setTags] = useState('');
  const [transcriptText, setTranscriptText] = useState('');
  const [activeTab, setActiveTab] = useState<'form' | 'transcript'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parseTranscript = (text: string): TranscriptSegmentCreate[] => {
    if (!text.trim()) return [];
    const lines = text.split('\n').filter((l) => l.trim());
    const segments: TranscriptSegmentCreate[] = [];
    let currentTime = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      // Try to match "Speaker: text" or "Speaker Name: text"
      const match = line.match(/^([^:]+):\s*(.+)$/);
      if (match) {
        const speaker = match[1].trim();
        const segText = match[2].trim();
        const segDuration = Math.max(5, Math.ceil(segText.split(' ').length * 0.4));
        segments.push({
          speaker,
          text: segText,
          start_time: currentTime,
          end_time: currentTime + segDuration,
          segment_order: i,
        });
        currentTime += segDuration + 2;
      }
    }
    return segments;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    const participantList = participants
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);
    const tagList = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const transcriptSegments = parseTranscript(transcriptText);

    const data: MeetingCreate = {
      title: title.trim(),
      date: new Date(date).toISOString(),
      duration: parseInt(duration) * 60,
      participants: participantList.length > 0 ? participantList : ['You'],
      meeting_type: meetingType,
      tags: tagList.length > 0 ? tagList : undefined,
      transcript_segments: transcriptSegments.length > 0 ? transcriptSegments : undefined,
    };

    onCreate(data);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 620 }}>
        <div className="modal-header">
          <h2 className="modal-title">New Meeting</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)' }}>
          <button
            onClick={() => setActiveTab('form')}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '13px',
              fontWeight: 600,
              color: activeTab === 'form' ? 'var(--primary-500)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'form' ? '2px solid var(--primary-500)' : '2px solid transparent',
              transition: 'all 150ms ease',
            }}
          >
            Meeting Details
          </button>
          <button
            onClick={() => setActiveTab('transcript')}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '13px',
              fontWeight: 600,
              color: activeTab === 'transcript' ? 'var(--primary-500)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'transcript' ? '2px solid var(--primary-500)' : '2px solid transparent',
              transition: 'all 150ms ease',
            }}
          >
            Paste Transcript
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {activeTab === 'form' ? (
              <>
                <div className="form-group">
                  <label className="form-label">Meeting Title *</label>
                  <input
                    className="form-input"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Weekly Team Standup"
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Date & Time</label>
                    <input
                      className="form-input"
                      type="datetime-local"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ width: 120 }}>
                    <label className="form-label">Duration (min)</label>
                    <input
                      className="form-input"
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      min={1}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Participants</label>
                  <input
                    className="form-input"
                    type="text"
                    value={participants}
                    onChange={(e) => setParticipants(e.target.value)}
                    placeholder="Comma-separated names, e.g., Sarah, Michael"
                  />
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Type</label>
                    <select
                      className="filter-select"
                      value={meetingType}
                      onChange={(e) => setMeetingType(e.target.value)}
                      style={{ width: '100%', height: 42 }}
                    >
                      <option value="general">General</option>
                      <option value="standup">Standup</option>
                      <option value="sales">Sales</option>
                      <option value="interview">Interview</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Tags</label>
                    <input
                      className="form-input"
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="Comma-separated tags"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="form-group">
                <label className="form-label">Paste Transcript</label>
                <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 8 }}>
                  Format: &quot;Speaker Name: What they said&quot; — one line per segment
                </p>
                <textarea
                  className="form-textarea"
                  value={transcriptText}
                  onChange={(e) => setTranscriptText(e.target.value)}
                  placeholder={`Sarah Chen: Good morning everyone, let's get started.\nMichael Torres: Sounds good, I have some updates to share.\nSarah Chen: Great, go ahead Michael.`}
                  style={{ minHeight: 200 }}
                />
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!title.trim() || isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Meeting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
