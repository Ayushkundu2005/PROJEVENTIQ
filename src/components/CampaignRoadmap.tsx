import React, { useState } from 'react';
import { EventData } from '../types';
import {
  CAMPAIGN_PHASE_CONFIGS,
  CampaignPhaseId,
  calculatePhaseDates,
  calculateCampaignReadiness,
  CampaignMilestone,
} from '../utils/campaign';
import {
  Milestone,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Share2,
  Mail,
  Search,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface CampaignRoadmapProps {
  event: EventData;
}

export const CampaignRoadmap: React.FC<CampaignRoadmapProps> = ({ event }) => {
  const [viewMode, setViewMode] = useState<'timeline' | 'checklist'>('timeline');
  const phaseDates = calculatePhaseDates(event.startDate);

  // Active milestone tasks across 5 phases
  const [milestones, setMilestones] = useState<CampaignMilestone[]>([
    {
      id: 'm-1',
      phaseId: 'phase_1_awareness',
      name: 'Launch Official Key Visual & Teaser Reel',
      description: 'Post high-impact lineup teaser on Instagram and TikTok using Editorial Swiss theme',
      daysOffsetFromEvent: -45,
      suggestedChannels: ['Instagram', 'TikTok'],
      suggestedContentType: '3-Sec Hook Reel & Square Post',
      defaultStatus: 'completed',
    },
    {
      id: 'm-2',
      phaseId: 'phase_1_awareness',
      name: 'Publish AP-Style Press Release & Schema.org Event JSON-LD',
      description: 'Distribute press release to South Indian entertainment desks and index Google rich snippets',
      daysOffsetFromEvent: -40,
      suggestedChannels: ['PR Desks', 'Google SERP'],
      suggestedContentType: 'Press Release & JSON-LD',
      defaultStatus: 'completed',
    },
    {
      id: 'm-3',
      phaseId: 'phase_2_presale',
      name: 'Deploy Exclusive Presale Code Blast',
      description: `Send 48-hour presale code ${event.presaleCode || 'VIPACCESS'} to VIP loyalty subscribers for Phase 1 tickets`,
      daysOffsetFromEvent: -30,
      suggestedChannels: ['Email', 'SMS'],
      suggestedContentType: 'Email Drip Sequence 1',
      defaultStatus: 'in_progress',
    },
    {
      id: 'm-4',
      phaseId: 'phase_2_presale',
      name: 'Influencer Experience Angle & Cost Comparison Video',
      description: 'Highlight ₹2,499 value vs standard pub nights with local Bangalore creators',
      daysOffsetFromEvent: -20,
      suggestedChannels: ['Instagram Reels', 'YouTube Shorts'],
      suggestedContentType: 'Short-Form Script',
      defaultStatus: 'in_progress',
    },
    {
      id: 'm-5',
      phaseId: 'phase_3_surge',
      name: '48-Hour Price Surge & Scarcity Countdown Blast',
      description: 'Alert cart abandoners and Instagram followers of imminent +30% price rise at midnight',
      daysOffsetFromEvent: -7,
      suggestedChannels: ['Email', 'SMS', 'Instagram Stories'],
      suggestedContentType: 'Countdown Stories & SMS Alert',
      defaultStatus: 'scheduled',
    },
    {
      id: 'm-6',
      phaseId: 'phase_4_day_of',
      name: 'Gate Entry & Parking Logistics Broadcast',
      description: 'Send Gate 1 & Gate 3 entry map and activate verified AI Attendee Concierge on portal',
      daysOffsetFromEvent: 0,
      suggestedChannels: ['SMS Broadcast', 'AI Concierge'],
      suggestedContentType: 'Arrival Guide & Interactive Q&A',
      defaultStatus: 'scheduled',
    },
    {
      id: 'm-7',
      phaseId: 'phase_5_post_event',
      name: 'Aftermovie Highlights Reel & 2027 Priority List Drop',
      description: 'Post high-energy festival recap reel and open waitlist for next year’s edition',
      daysOffsetFromEvent: 2,
      suggestedChannels: ['Instagram', 'YouTube', 'Email'],
      suggestedContentType: 'Recap Video & NPS Survey',
      defaultStatus: 'scheduled',
    },
  ]);

  const readinessScore = calculateCampaignReadiness(
    milestones.map(m => ({ status: m.defaultStatus }))
  );

  const toggleMilestoneStatus = (id: string) => {
    setMilestones(prev =>
      prev.map(m => {
        if (m.id !== id) return m;
        const nextStatus = m.defaultStatus === 'completed' ? 'in_progress' : m.defaultStatus === 'in_progress' ? 'scheduled' : 'completed';
        return { ...m, defaultStatus: nextStatus };
      })
    );
  };

  const phasesList: CampaignPhaseId[] = [
    'phase_1_awareness',
    'phase_2_presale',
    'phase_3_surge',
    'phase_4_day_of',
    'phase_5_post_event',
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E6E1]">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#252525]">Unified 5-Phase Campaign Roadmap</h1>
          <p className="text-xs text-[#968A7C] mt-1">
            Master lifecycle orchestrating multi-channel momentum from initial awareness to post-event retention
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-[#F4F2ED] p-1 rounded-xl border border-[#E8E6E1]">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'timeline' ? 'bg-[#252525] text-[#FAF9F6]' : 'text-[#615a51]'
              }`}
            >
              Timeline View
            </button>
            <button
              onClick={() => setViewMode('checklist')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'checklist' ? 'bg-[#252525] text-[#FAF9F6]' : 'text-[#615a51]'
              }`}
            >
              Milestone Checklist
            </button>
          </div>
        </div>
      </div>

      {/* Progress & Budget Distribution Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Readiness progress */}
        <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-[#252525]">Total Roadmap Execution</span>
            <span className="font-mono font-bold text-emerald-800">{readinessScore}% Complete</span>
          </div>
          <div className="w-full bg-[#E8E6E1] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#252525] h-full rounded-full transition-all duration-500"
              style={{ width: `${readinessScore}%` }}
            />
          </div>
          <p className="text-[11px] text-[#968A7C]">
            {milestones.filter(m => m.defaultStatus === 'completed').length} of {milestones.length} milestones checked
          </p>
        </div>

        {/* Coordinated synchronization notice */}
        <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-5 space-y-2 md:col-span-2 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-xs font-medium text-[#252525]">
            <ShieldCheck className="w-4 h-4 text-[#968A7C]" />
            <span>Cross-Channel Synchronization Rule</span>
          </div>
          <p className="text-xs text-[#615a51] leading-relaxed">
            Every phase harmonizes Instagram content with direct marketing drip sequences, SMS bursts, and on-ground logistics. Content generated in the Social Engine automatically populates the appropriate phase.
          </p>
        </div>

      </div>

      {/* Main Roadmap Timeline */}
      <div className="space-y-6">
        {phasesList.map((phaseKey, index) => {
          const cfg = CAMPAIGN_PHASE_CONFIGS[phaseKey];
          const dates = phaseDates[phaseKey];
          const phaseMilestones = milestones.filter(m => m.phaseId === phaseKey);

          return (
            <div
              key={phaseKey}
              className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-6 space-y-4 hover:border-[#968A7C]/60 transition-all"
            >
              {/* Phase Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E8E6E1]">
                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-full text-white text-xs font-mono font-bold flex items-center justify-center shrink-0"
                    style={{ backgroundColor: cfg.color }}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-medium text-[#252525]">{cfg.name}</h3>
                    <p className="text-xs text-[#968A7C]">{cfg.tagline}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-[#615a51] bg-[#F4F2ED] px-2.5 py-1 rounded-lg border border-[#E8E6E1]">
                    {dates.startDate} → {dates.endDate}
                  </span>
                  <span className="text-[#968A7C]">
                    Budget: {cfg.recommendedBudgetSplitPercent}%
                  </span>
                </div>
              </div>

              {/* Milestones inside Phase */}
              <div className="space-y-2.5 pt-1">
                {phaseMilestones.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-start justify-between p-3.5 rounded-xl bg-[#F4F2ED] border border-[#E8E6E1] hover:bg-white transition-all cursor-pointer"
                    onClick={() => toggleMilestoneStatus(m.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {m.defaultStatus === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : m.defaultStatus === 'in_progress' ? (
                          <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-[#968A7C]" />
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <div className={`text-xs font-medium ${m.defaultStatus === 'completed' ? 'line-through text-[#968A7C]' : 'text-[#252525]'}`}>
                          {m.name}
                        </div>
                        <p className="text-[11px] text-[#615a51]">{m.description}</p>
                        <div className="flex items-center gap-2 pt-1 text-[10px] font-mono text-[#968A7C]">
                          <span>Channels: {m.suggestedChannels.join(', ')}</span>
                          <span>•</span>
                          <span>Format: {m.suggestedContentType}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full font-medium shrink-0 ${
                        m.defaultStatus === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.defaultStatus === 'in_progress'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-[#E8E6E1] text-[#615a51]'
                      }`}
                    >
                      {m.defaultStatus.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
