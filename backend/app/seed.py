"""
Seed script to populate the database with 5 realistic meetings,
each with full transcripts and action items.
"""
from datetime import datetime
from .database import SessionLocal
from .models import Meeting, TranscriptSegment, ActionItem


SEED_MEETINGS = [
    {
        "title": "Q3 Product Roadmap Planning",
        "date": "2024-07-15T10:00:00",
        "duration": 2520,  # 42 min
        "participants": ["Sarah Chen", "Michael Torres", "Priya Patel", "James Wilson"],
        "meeting_type": "standup",
        "tags": ["product", "roadmap", "Q3", "planning"],
        "summary": "The team reviewed the Q3 product roadmap, focusing on three key initiatives: the AI-powered meeting summarization feature, the new integrations marketplace, and performance optimizations. Sarah outlined the timeline for the AI feature launch, targeting early August. Michael raised concerns about API rate limits that could affect the summarization pipeline. Priya presented the design mockups for the integrations marketplace, which received positive feedback. James committed to delivering the database migration plan by end of week. The team agreed to do a mid-quarter checkpoint on August 1st.",
        "key_topics": [
            "AI summarization feature timeline",
            "Integrations marketplace design",
            "Performance optimization targets",
            "Database migration planning",
            "Mid-quarter review scheduling",
            "API rate limit concerns"
        ],
        "transcript": [
            {"speaker": "Sarah Chen", "text": "Good morning everyone. Let's dive into the Q3 roadmap. I want to make sure we're all aligned on priorities before the quarter gets too far along.", "start_time": 0, "end_time": 12},
            {"speaker": "Michael Torres", "text": "Sounds good. I've been looking at the AI summarization feature and I think we need to address the API rate limits before we can scale it.", "start_time": 15, "end_time": 28},
            {"speaker": "Sarah Chen", "text": "That's a great point, Michael. What kind of limits are we looking at?", "start_time": 30, "end_time": 35},
            {"speaker": "Michael Torres", "text": "Currently we're capped at 100 requests per minute. For the volume we're expecting, we'll need at least 500. I've already reached out to the provider about upgrading our tier.", "start_time": 37, "end_time": 52},
            {"speaker": "Priya Patel", "text": "While Michael works on the API side, I wanted to share the integrations marketplace mockups. I think you'll like what we've come up with.", "start_time": 55, "end_time": 65},
            {"speaker": "James Wilson", "text": "Oh nice, I've been looking forward to seeing these. How are we handling the plugin architecture?", "start_time": 67, "end_time": 74},
            {"speaker": "Priya Patel", "text": "We're going with a modular approach. Each integration will be a self-contained package with its own configuration panel. The marketplace will allow users to browse, install, and manage integrations from a single dashboard.", "start_time": 76, "end_time": 95},
            {"speaker": "Sarah Chen", "text": "This looks fantastic, Priya. I love the card-based layout for browsing integrations. Very clean and intuitive.", "start_time": 98, "end_time": 107},
            {"speaker": "James Wilson", "text": "Agreed. On my end, I need to finalize the database migration plan. We're moving from the legacy schema to support the new features. I should have a detailed plan by Friday.", "start_time": 110, "end_time": 126},
            {"speaker": "Sarah Chen", "text": "Perfect. Let's also set up a mid-quarter checkpoint. How does August 1st work for everyone?", "start_time": 130, "end_time": 138},
            {"speaker": "Michael Torres", "text": "Works for me. By then I should have the rate limit issue resolved and initial benchmarks for the AI pipeline.", "start_time": 140, "end_time": 150},
            {"speaker": "Priya Patel", "text": "August 1st works. I'll have the first interactive prototype of the marketplace ready by then.", "start_time": 153, "end_time": 162},
            {"speaker": "James Wilson", "text": "I'm in. The migration should be well underway by that point. I'll prepare a progress report.", "start_time": 165, "end_time": 175},
            {"speaker": "Sarah Chen", "text": "Great. Let's also talk about performance targets. We need the dashboard to load in under 2 seconds, even with 1000+ meetings.", "start_time": 178, "end_time": 192},
            {"speaker": "Michael Torres", "text": "I've been profiling the current queries. The main bottleneck is the transcript search. I think we can optimize it with full-text indexing.", "start_time": 195, "end_time": 210},
            {"speaker": "Sarah Chen", "text": "Excellent. Let's wrap up here. Everyone knows their priorities. Let's make Q3 our best quarter yet.", "start_time": 215, "end_time": 225},
        ],
        "action_items": [
            {"text": "Upgrade API tier to support 500+ requests/minute", "assignee": "Michael Torres", "due_date": "2024-07-22"},
            {"text": "Complete integrations marketplace interactive prototype", "assignee": "Priya Patel", "due_date": "2024-08-01"},
            {"text": "Deliver database migration plan document", "assignee": "James Wilson", "due_date": "2024-07-19"},
            {"text": "Schedule mid-quarter checkpoint for August 1st", "assignee": "Sarah Chen", "due_date": "2024-07-16"},
            {"text": "Implement full-text search indexing for transcripts", "assignee": "Michael Torres", "due_date": "2024-07-29"},
        ],
    },
    {
        "title": "Sales Kickoff — Acme Corp",
        "date": "2024-07-12T14:00:00",
        "duration": 1680,  # 28 min
        "participants": ["Alex Rivera", "Dana Kim", "Jordan Blake"],
        "meeting_type": "sales",
        "tags": ["sales", "acme", "enterprise", "deal"],
        "summary": "Alex led the kickoff call with Acme Corp, introducing our platform capabilities and addressing their specific needs around meeting transcription for their 200-person sales team. Dana walked through the enterprise pricing model and custom onboarding support. Jordan demonstrated the CRM integration features that Acme specifically requested. Acme's team expressed strong interest, particularly in the Salesforce integration and custom AI summary templates. Next steps include sending a detailed proposal and scheduling a technical deep-dive with their IT team.",
        "key_topics": [
            "Enterprise platform overview",
            "Salesforce CRM integration",
            "Custom AI summary templates",
            "Enterprise pricing and onboarding",
            "Technical requirements review"
        ],
        "transcript": [
            {"speaker": "Alex Rivera", "text": "Welcome everyone to the kickoff call. We're excited to explore how our platform can support Acme's sales organization.", "start_time": 0, "end_time": 10},
            {"speaker": "Dana Kim", "text": "Thanks Alex. Before we dive in, I'd like to understand your current workflow. How is your team handling meeting notes today?", "start_time": 13, "end_time": 23},
            {"speaker": "Alex Rivera", "text": "Great question. Most of our reps are taking manual notes during calls, which means they're not fully present in the conversation. We lose a lot of valuable insights.", "start_time": 26, "end_time": 40},
            {"speaker": "Jordan Blake", "text": "That's exactly the problem we solve. Let me show you how our automatic transcription works. Every meeting is captured, transcribed, and summarized without any manual effort.", "start_time": 43, "end_time": 58},
            {"speaker": "Dana Kim", "text": "And for your team size of 200 reps, we have an enterprise plan that includes dedicated support, custom onboarding, and priority access to new features.", "start_time": 61, "end_time": 75},
            {"speaker": "Alex Rivera", "text": "That sounds promising. One of our key requirements is Salesforce integration. Can your platform push meeting summaries and action items directly into Salesforce?", "start_time": 78, "end_time": 93},
            {"speaker": "Jordan Blake", "text": "Absolutely. Our Salesforce integration is one of our most popular features. After each meeting, summaries, action items, and key topics are automatically synced to the relevant opportunity record.", "start_time": 96, "end_time": 115},
            {"speaker": "Alex Rivera", "text": "Impressive. What about custom summary templates? Our sales methodology uses MEDDIC, and we'd want the AI to extract information aligned with that framework.", "start_time": 118, "end_time": 135},
            {"speaker": "Jordan Blake", "text": "We support custom AI templates. You can define exactly what fields and insights you want the AI to extract. MEDDIC, BANT, SPIN — we've got templates for all major frameworks, and you can create your own.", "start_time": 138, "end_time": 160},
            {"speaker": "Dana Kim", "text": "I'll send over a detailed proposal by end of week with enterprise pricing, implementation timeline, and references from similar-sized deployments.", "start_time": 163, "end_time": 178},
            {"speaker": "Alex Rivera", "text": "That would be great. Can we also schedule a technical deep-dive with our IT team? They'll want to review security and data handling.", "start_time": 181, "end_time": 195},
            {"speaker": "Dana Kim", "text": "Of course. I'll coordinate with your team to find a time next week. We're SOC 2 compliant and can share our security whitepaper in advance.", "start_time": 198, "end_time": 213},
        ],
        "action_items": [
            {"text": "Send detailed enterprise proposal to Acme Corp", "assignee": "Dana Kim", "due_date": "2024-07-19"},
            {"text": "Schedule technical deep-dive with Acme IT team", "assignee": "Dana Kim", "due_date": "2024-07-17"},
            {"text": "Prepare MEDDIC custom template demo environment", "assignee": "Jordan Blake", "due_date": "2024-07-18"},
            {"text": "Share SOC 2 security whitepaper with Acme", "assignee": "Dana Kim", "due_date": "2024-07-15"},
        ],
    },
    {
        "title": "Engineering Sprint Retrospective",
        "date": "2024-07-11T16:00:00",
        "duration": 2100,  # 35 min
        "participants": ["Kai Nakamura", "Emma Watson", "Raj Gupta", "Lisa Chen", "Tom Hardy"],
        "meeting_type": "standup",
        "tags": ["engineering", "retro", "sprint", "agile"],
        "summary": "The engineering team held their bi-weekly sprint retrospective covering Sprint 14. The team successfully delivered the real-time collaboration feature and resolved 23 bug tickets. Kai highlighted that the deployment pipeline improvements reduced release time by 40%. Emma raised a concern about test coverage declining from 85% to 78% due to the fast pace of development. The team agreed to implement a 'no merge without tests' policy going forward. Raj presented metrics showing API response times improved by 30% after the caching layer was implemented. Lisa suggested adopting pair programming for complex features, which the team agreed to trial in Sprint 15.",
        "key_topics": [
            "Sprint 14 accomplishments",
            "Deployment pipeline improvements",
            "Test coverage concerns",
            "API performance metrics",
            "Pair programming proposal",
            "Sprint 15 planning"
        ],
        "transcript": [
            {"speaker": "Kai Nakamura", "text": "Alright team, let's start our Sprint 14 retro. First, let's celebrate what went well. We shipped the real-time collaboration feature on time!", "start_time": 0, "end_time": 12},
            {"speaker": "Emma Watson", "text": "Yes, and we also closed 23 bug tickets this sprint. The team really stepped up on quality.", "start_time": 15, "end_time": 24},
            {"speaker": "Raj Gupta", "text": "I want to highlight the API performance improvements. After implementing the Redis caching layer, our average response time dropped from 450ms to 310ms. That's a 30% improvement.", "start_time": 27, "end_time": 45},
            {"speaker": "Tom Hardy", "text": "Nice work, Raj. I also noticed the deployment pipeline improvements. How much time are we saving now?", "start_time": 48, "end_time": 57},
            {"speaker": "Kai Nakamura", "text": "Great question. We reduced our deployment time from 25 minutes to about 15 minutes. That's a 40% reduction. The parallel test execution was the biggest win.", "start_time": 60, "end_time": 76},
            {"speaker": "Emma Watson", "text": "Now for the not-so-great news. Our test coverage has dropped from 85% to 78%. I know we've been moving fast, but we can't let this slide.", "start_time": 80, "end_time": 95},
            {"speaker": "Lisa Chen", "text": "I agree with Emma. I think we should adopt a 'no merge without tests' policy. Every PR should include tests for new functionality.", "start_time": 98, "end_time": 112},
            {"speaker": "Kai Nakamura", "text": "That's a fair point. Let's make it official starting Sprint 15. No PR gets merged without adequate test coverage.", "start_time": 115, "end_time": 127},
            {"speaker": "Tom Hardy", "text": "Makes sense. What about complex features where testing is harder? Like the real-time sync we just built?", "start_time": 130, "end_time": 140},
            {"speaker": "Lisa Chen", "text": "That actually brings up another suggestion I have. What if we try pair programming for complex features? Two engineers working together can catch issues earlier and write better tests.", "start_time": 143, "end_time": 162},
            {"speaker": "Raj Gupta", "text": "I'm open to trying it. We could do a trial in Sprint 15 and see how it affects both velocity and quality.", "start_time": 165, "end_time": 176},
            {"speaker": "Kai Nakamura", "text": "Love it. Let's plan for pair programming on the notification system feature next sprint. Emma and Tom, would you two be up for it?", "start_time": 180, "end_time": 195},
            {"speaker": "Emma Watson", "text": "I'm in! It'll be a good experiment.", "start_time": 198, "end_time": 203},
            {"speaker": "Tom Hardy", "text": "Count me in too. Looking forward to it.", "start_time": 206, "end_time": 211},
            {"speaker": "Kai Nakamura", "text": "Perfect. So to summarize: enforce test coverage policy, trial pair programming, and keep up the momentum on performance. Great sprint, everyone!", "start_time": 215, "end_time": 230},
        ],
        "action_items": [
            {"text": "Implement 'no merge without tests' policy in CI pipeline", "assignee": "Kai Nakamura", "due_date": "2024-07-15"},
            {"text": "Set up pair programming sessions for notification system feature", "assignee": "Emma Watson", "due_date": "2024-07-15"},
            {"text": "Create test coverage dashboard and weekly reports", "assignee": "Lisa Chen", "due_date": "2024-07-18"},
            {"text": "Document API caching architecture for team knowledge base", "assignee": "Raj Gupta", "due_date": "2024-07-19"},
            {"text": "Review and optimize remaining slow API endpoints", "assignee": "Raj Gupta", "due_date": "2024-07-25"},
        ],
    },
    {
        "title": "1:1 — Sarah & Michael",
        "date": "2024-07-10T11:00:00",
        "duration": 1320,  # 22 min
        "participants": ["Sarah Chen", "Michael Torres"],
        "meeting_type": "general",
        "tags": ["1:1", "career", "feedback", "growth"],
        "summary": "Sarah and Michael had their weekly 1:1 check-in. Michael shared his progress on the AI pipeline project and expressed interest in taking on more architectural decisions. Sarah provided positive feedback on his recent technical design document and suggested he present it at the next engineering all-hands. They discussed Michael's career growth path toward a senior engineer role, with Sarah recommending he focus on mentoring junior engineers and leading cross-team initiatives. Michael also raised a concern about workload balance, and they agreed to redistribute some tasks to the new team member joining next month.",
        "key_topics": [
            "AI pipeline project progress",
            "Career growth discussion",
            "Technical leadership opportunities",
            "Workload and task redistribution",
            "Engineering all-hands presentation"
        ],
        "transcript": [
            {"speaker": "Sarah Chen", "text": "Hey Michael, how's your week going? Let's start with how the AI pipeline project is coming along.", "start_time": 0, "end_time": 9},
            {"speaker": "Michael Torres", "text": "It's going well! I finished the initial architecture and have a working prototype. The accuracy is around 92% on our test dataset, which is above our 90% target.", "start_time": 12, "end_time": 27},
            {"speaker": "Sarah Chen", "text": "That's excellent progress. I read your technical design doc, by the way. Really well written. Have you considered presenting it at the next engineering all-hands?", "start_time": 30, "end_time": 44},
            {"speaker": "Michael Torres", "text": "Oh, I hadn't thought about that. That would be a great opportunity. When is the next one?", "start_time": 47, "end_time": 55},
            {"speaker": "Sarah Chen", "text": "It's on July 25th. I think the team would really benefit from understanding the AI architecture decisions you made. It's a good visibility opportunity for you too.", "start_time": 58, "end_time": 73},
            {"speaker": "Michael Torres", "text": "I'd love to do that. Speaking of growth, I wanted to talk about my path toward senior engineer. What areas should I focus on?", "start_time": 76, "end_time": 89},
            {"speaker": "Sarah Chen", "text": "Great question. Technically, you're already operating at a senior level. The areas to develop are around leadership and influence. I'd recommend starting to mentor some of the junior engineers.", "start_time": 92, "end_time": 112},
            {"speaker": "Michael Torres", "text": "That makes sense. I've been helping Aisha with the data pipeline stuff informally. Maybe I could make that more structured?", "start_time": 115, "end_time": 127},
            {"speaker": "Sarah Chen", "text": "Exactly. Set up regular check-ins with her and maybe one other junior engineer. Also, look for opportunities to lead cross-team initiatives. The API standardization project could be a good one.", "start_time": 130, "end_time": 148},
            {"speaker": "Michael Torres", "text": "I'll do that. One thing I wanted to raise — I'm feeling a bit stretched with the AI project plus my regular sprint work. Is there any way to redistribute some tasks?", "start_time": 152, "end_time": 168},
            {"speaker": "Sarah Chen", "text": "Absolutely. We have a new team member starting next month. Once they're onboarded, we can shift some of the maintenance tasks off your plate. For now, let me see what I can move to other team members.", "start_time": 172, "end_time": 192},
            {"speaker": "Michael Torres", "text": "That would be really helpful. Thanks, Sarah. I feel good about the direction we discussed.", "start_time": 195, "end_time": 205},
            {"speaker": "Sarah Chen", "text": "Great chat, Michael. Keep up the awesome work. Let's check in on these items next week.", "start_time": 208, "end_time": 217},
        ],
        "action_items": [
            {"text": "Prepare AI architecture presentation for July 25th all-hands", "assignee": "Michael Torres", "due_date": "2024-07-23"},
            {"text": "Set up structured mentoring sessions with Aisha and one other junior engineer", "assignee": "Michael Torres", "due_date": "2024-07-17"},
            {"text": "Identify tasks to redistribute from Michael's workload", "assignee": "Sarah Chen", "due_date": "2024-07-12"},
        ],
    },
    {
        "title": "Customer Onboarding — TechFlow Inc",
        "date": "2024-07-08T09:30:00",
        "duration": 3060,  # 51 min
        "participants": ["Rachel Adams", "Ben Cooper", "Yuki Tanaka", "Chris Lee"],
        "meeting_type": "general",
        "tags": ["onboarding", "customer", "techflow", "setup"],
        "summary": "Rachel led the onboarding session for TechFlow Inc, a 50-person startup adopting our platform. Ben walked through the initial account setup, workspace configuration, and team member invitations. Yuki demonstrated the integration setup process, connecting TechFlow's Google Meet and Slack instances to the platform. Chris from TechFlow asked detailed questions about data retention policies, which Rachel addressed with our standard 12-month retention with optional extended archiving. The team completed the initial setup and scheduled follow-up sessions for custom workflow configuration and admin training. TechFlow plans to roll out to their entire team by end of July.",
        "key_topics": [
            "Account setup and workspace configuration",
            "Google Meet and Slack integration",
            "Data retention and security policies",
            "Custom workflow configuration",
            "Team rollout timeline",
            "Admin training scheduling"
        ],
        "transcript": [
            {"speaker": "Rachel Adams", "text": "Welcome to the onboarding session, Chris! We're excited to get TechFlow set up on our platform. By the end of today, your team will be ready to start capturing meetings.", "start_time": 0, "end_time": 14},
            {"speaker": "Chris Lee", "text": "Thanks, Rachel. We've been looking forward to this. Our team has been manually taking notes for months, so this will be a huge time saver.", "start_time": 17, "end_time": 30},
            {"speaker": "Ben Cooper", "text": "Let's start with the basics. I'll walk you through setting up your workspace. First, we'll configure your team settings and invitation process.", "start_time": 33, "end_time": 46},
            {"speaker": "Ben Cooper", "text": "You can invite team members via email or through your company's SSO provider. Since TechFlow uses Google Workspace, we can sync your directory automatically.", "start_time": 49, "end_time": 64},
            {"speaker": "Chris Lee", "text": "That's convenient. How does the Google Meet integration work? We use Meet for almost all our calls.", "start_time": 67, "end_time": 77},
            {"speaker": "Yuki Tanaka", "text": "Great question. The Google Meet integration is straightforward. Once you authorize our app in your Google Admin console, our bot will automatically join your scheduled meetings and begin transcribing.", "start_time": 80, "end_time": 98},
            {"speaker": "Chris Lee", "text": "Does it work for ad-hoc meetings too, or only scheduled ones?", "start_time": 101, "end_time": 107},
            {"speaker": "Yuki Tanaka", "text": "Both! For scheduled meetings, the bot joins automatically. For ad-hoc meetings, team members can invite the bot manually or use our Chrome extension to add it with one click.", "start_time": 110, "end_time": 128},
            {"speaker": "Rachel Adams", "text": "Let's also set up your Slack integration. This way, meeting summaries and action items will be posted directly to your team channels.", "start_time": 132, "end_time": 145},
            {"speaker": "Chris Lee", "text": "Perfect. Before we continue, I have a question about data retention. What's your policy on storing meeting recordings and transcripts?", "start_time": 148, "end_time": 162},
            {"speaker": "Rachel Adams", "text": "Our standard plan includes 12 months of data retention. After that, data is automatically archived. You can also configure custom retention policies, and there's an option for extended archiving if needed.", "start_time": 165, "end_time": 185},
            {"speaker": "Chris Lee", "text": "And is all data encrypted? We deal with some sensitive client information in our meetings.", "start_time": 188, "end_time": 198},
            {"speaker": "Rachel Adams", "text": "Absolutely. All data is encrypted both in transit and at rest using AES-256 encryption. We're SOC 2 Type II certified and GDPR compliant. I can share our security documentation with you.", "start_time": 201, "end_time": 220},
            {"speaker": "Ben Cooper", "text": "Now let me show you the admin dashboard. From here, you can manage team members, view usage analytics, and configure notification preferences.", "start_time": 225, "end_time": 240},
            {"speaker": "Yuki Tanaka", "text": "One more thing — we should schedule follow-up sessions for custom workflow configuration and admin training. I'd recommend doing those next week.", "start_time": 245, "end_time": 260},
            {"speaker": "Chris Lee", "text": "Sounds good. We're planning to roll this out to our entire team by end of July. Can we have everything configured by then?", "start_time": 265, "end_time": 278},
            {"speaker": "Rachel Adams", "text": "Absolutely. We'll have you fully set up well before that deadline. Let me send you the follow-up schedule and some training resources for your team.", "start_time": 282, "end_time": 296},
        ],
        "action_items": [
            {"text": "Send security documentation and SOC 2 certification to TechFlow", "assignee": "Rachel Adams", "due_date": "2024-07-09"},
            {"text": "Schedule custom workflow configuration session for next week", "assignee": "Yuki Tanaka", "due_date": "2024-07-10"},
            {"text": "Configure Google Workspace directory sync for TechFlow", "assignee": "Ben Cooper", "due_date": "2024-07-10"},
            {"text": "Set up Slack integration for TechFlow team channels", "assignee": "Yuki Tanaka", "due_date": "2024-07-11"},
            {"text": "Prepare admin training materials and schedule session", "assignee": "Ben Cooper", "due_date": "2024-07-12"},
            {"text": "Complete team-wide rollout plan for end of July", "assignee": "Chris Lee", "due_date": "2024-07-15"},
        ],
    },
]


def seed_database():
    """Populate the database with sample meeting data."""
    db = SessionLocal()
    try:
        # Check if data already exists
        existing = db.query(Meeting).count()
        if existing > 0:
            print(f"Database already has {existing} meetings. Skipping seed.")
            return

        now = datetime.utcnow().isoformat()

        for meeting_data in SEED_MEETINGS:
            meeting = Meeting(
                title=meeting_data["title"],
                date=meeting_data["date"],
                duration=meeting_data["duration"],
                participants=meeting_data["participants"],
                summary=meeting_data["summary"],
                key_topics=meeting_data["key_topics"],
                meeting_type=meeting_data["meeting_type"],
                tags=meeting_data["tags"],
                created_at=now,
                updated_at=now,
            )
            db.add(meeting)
            db.flush()

            # Add transcript segments
            for i, seg in enumerate(meeting_data["transcript"]):
                segment = TranscriptSegment(
                    meeting_id=meeting.id,
                    speaker=seg["speaker"],
                    text=seg["text"],
                    start_time=seg["start_time"],
                    end_time=seg["end_time"],
                    segment_order=i,
                )
                db.add(segment)

            # Add action items
            for item in meeting_data["action_items"]:
                action = ActionItem(
                    meeting_id=meeting.id,
                    text=item["text"],
                    assignee=item["assignee"],
                    due_date=item["due_date"],
                    completed=False,
                    created_at=now,
                )
                db.add(action)

        db.commit()
        print(f"Successfully seeded {len(SEED_MEETINGS)} meetings with transcripts and action items.")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()
