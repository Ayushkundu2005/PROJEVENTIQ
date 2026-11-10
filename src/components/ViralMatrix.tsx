import React, { useState } from 'react';
import { EventData, ViralMatrixRow, SocialPlatform } from '../types';
import {
  Flame,
  Sparkles,
  Share2,
  TrendingUp,
  Target,
  Zap,
  CheckCircle,
  Copy,
  Clock,
  Filter,
} from 'lucide-react';

interface ViralMatrixProps {
  event: EventData;
}

export const ViralMatrix: React.FC<ViralMatrixProps> = ({ event }) => {
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Initial event-grounded viral matrix rows
  const [matrixRows, setMatrixRows] = useState<ViralMatrixRow[]>([
    {
      id: 'vm-1',
      eventId: event.id,
      platform: 'instagram',
      campaignPhase: 'Phase 1: Awareness',
      targetAudienceSegment: 'Bangalore Indie Music Enthusiasts (18-28)',
      angle: 'Nostalgia & Heritage Meet Modern Bass',
      hook: 'They said Bangalore lost its live festival soul. Then this happened.',
      contentConcept: 'B-roll transition showing vintage Jayamahal Palace heritage walls cutting into laser-illuminated stage crowds.',
      suggestedCta: 'Comment "LINEUP" for secret artist drop link.',
      estimatedViralityScore: 92,
      publishingStatus: 'ready',
    },
    {
      id: 'vm-2',
      eventId: event.id,
      platform: 'tiktok',
      campaignPhase: 'Phase 2: Presale',
      targetAudienceSegment: 'College Students & Early-Career Techies',
      angle: 'Price Comparison / Cost-per-Experience',
      hook: `One pub night in Indiranagar costs ₹3,500. Or 3 full days of ${event.name} for ₹${event.ticketTiers[0]?.priceInr || 2499}.`,
      contentConcept: 'Side-by-side cost breakdown showing food bills vs 40+ artists and 72 hours of open-air music.',
      suggestedCta: 'Tag the friend who always overspends on weekends.',
      estimatedViralityScore: 88,
      publishingStatus: 'scripted',
    },
    {
      id: 'vm-3',
      eventId: event.id,
      platform: 'youtube_shorts',
      campaignPhase: 'Phase 3: Surge',
      targetAudienceSegment: 'Electronic & Synthwave Fans',
      angle: 'Sound Production & Audio Nerdery',
      hook: 'Why 120,000 Watts of French L-Acoustics sound will shake Jayamahal Ground.',
      contentConcept: 'Sound technician walkthrough demonstrating acoustic simulation maps and line-array rigging.',
      suggestedCta: 'Subscribe for the behind-the-scenes stage build vlog.',
      estimatedViralityScore: 84,
      publishingStatus: 'idea',
    },
    {
      id: 'vm-4',
      eventId: event.id,
      platform: 'instagram',
      campaignPhase: 'Phase 4: Day-Of',
      targetAudienceSegment: 'VIP Ticket Seekers & Creatives',
      angle: 'Exclusive Backstage Access Privilege',
      hook: 'What does the Royal VIP wristband actually unlock at Gate 3?',
      contentConcept: 'POV walk-through arriving via valet, skipping the 200-meter GA line, and sipping welcome mocktails.',
      suggestedCta: 'Last 15 VIP passes remaining on Insider.',
      estimatedViralityScore: 94,
      publishingStatus: 'ready',
    },
  ]);

  const handleCopyHook = (row: ViralMatrixRow) => {
    navigator.clipboard.writeText(`${row.hook}\n\n${row.contentConcept}\nCTA: ${row.suggestedCta}`);
    setCopiedId(row.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerateViralAngles = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          platform: 'instagram',
          contentType: 'reel_hook',
          campaignPhase: 'presale',
          customPrompt: `Generate 2 new viral reel concepts and hooks specifically targeted at ${event.targetAudience} in ${event.city}.`,
        }),
      });

      const data = await res.json();
      if (data.hook) {
        const newRow: ViralMatrixRow = {
          id: `vm-${Date.now()}`,
          eventId: event.id,
          platform: 'instagram',
          campaignPhase: 'Phase 2: Presale',
          targetAudienceSegment: event.targetAudience,
          angle: data.title || 'Dynamic Viral Angle',
          hook: data.hook,
          contentConcept: data.body,
          suggestedCta: data.callToAction,
          estimatedViralityScore: 89,
          publishingStatus: 'idea',
        };
        setMatrixRows([newRow, ...matrixRows]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const filtered = filterPlatform === 'all' ? matrixRows : matrixRows.filter(r => r.platform === filterPlatform);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E6E1]">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#252525]">Viral Matrix & Campaign Strategy</h1>
          <p className="text-xs text-[#968A7C] mt-1">
            Structured social campaign hooks, psychological angles, and audience segmentation matrices
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-[#968A7C]" />
            <select
              value={filterPlatform}
              onChange={e => setFilterPlatform(e.target.value)}
              className="bg-transparent text-xs text-[#252525] focus:outline-none cursor-pointer"
            >
              <option value="all">All Channels</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="youtube_shorts">YouTube Shorts</option>
            </select>
          </div>

          <button
            onClick={handleGenerateViralAngles}
            disabled={isGenerating}
            className="px-3.5 py-2 rounded-xl bg-[#252525] text-[#FAF9F6] text-xs font-medium hover:bg-[#3a3530] flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Analyzing Virality...' : 'Generate New Angles'}</span>
          </button>
        </div>
      </div>

      {/* Strategic Framework Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#F4F2ED] border border-[#E8E6E1] space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-[#252525]">
            <Target className="w-4 h-4 text-[#968A7C]" />
            <span>Target Audience Focus</span>
          </div>
          <p className="text-xs text-[#615a51] leading-relaxed">
            {event.targetAudience} ({event.targetAgeGroup} yrs)
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#F4F2ED] border border-[#E8E6E1] space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-[#252525]">
            <Zap className="w-4 h-4 text-amber-600" />
            <span>Conversion Catalyst</span>
          </div>
          <p className="text-xs text-[#615a51] leading-relaxed">
            T-minus 14 days price surge + Royal VIP lounge scarcity allocation
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#F4F2ED] border border-[#E8E6E1] space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-[#252525]">
            <Flame className="w-4 h-4 text-rose-600" />
            <span>Algorithmic Save Trigger</span>
          </div>
          <p className="text-xs text-[#615a51] leading-relaxed">
            Local logistics guides, set time schedules, and "how to reach" reels
          </p>
        </div>
      </div>

      {/* Structured Content Matrix Table */}
      <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#E8E6E1] flex items-center justify-between">
          <h3 className="font-serif text-lg font-medium text-[#252525]">Coordinated Social Angle Matrix</h3>
          <span className="text-xs font-mono text-[#968A7C]">{filtered.length} Structured Concepts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F4F2ED] border-b border-[#E8E6E1] text-[11px] font-mono uppercase text-[#968A7C]">
                <th className="py-3 px-4">Channel & Phase</th>
                <th className="py-3 px-4">Audience & Angle</th>
                <th className="py-3 px-4">Viral 3-Sec Hook</th>
                <th className="py-3 px-4">Concept & Call to Action</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E6E1] text-xs">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-[#F4F2ED]/60 transition-colors">
                  <td className="py-3.5 px-4 align-top">
                    <div className="font-medium text-[#252525] capitalize">{row.platform.replace('_', ' ')}</div>
                    <div className="text-[10px] text-[#968A7C] font-mono mt-0.5">{row.campaignPhase}</div>
                  </td>

                  <td className="py-3.5 px-4 align-top max-w-xs">
                    <div className="font-medium text-[#252525]">{row.angle}</div>
                    <div className="text-[10px] text-[#615a51] mt-0.5 line-clamp-1">{row.targetAudienceSegment}</div>
                  </td>

                  <td className="py-3.5 px-4 align-top max-w-sm">
                    <div className="font-serif italic font-medium text-[#252525]">"{row.hook}"</div>
                  </td>

                  <td className="py-3.5 px-4 align-top max-w-xs">
                    <p className="text-[11px] text-[#615a51] line-clamp-2">{row.contentConcept}</p>
                    <div className="text-[10px] font-mono text-[#968A7C] mt-1">CTA: {row.suggestedCta}</div>
                  </td>

                  <td className="py-3.5 px-4 align-top">
                    <span className="inline-flex items-center gap-1 font-mono font-bold text-xs text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      <Flame className="w-3 h-3" />
                      {row.estimatedViralityScore}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 align-top">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#E8E6E1] text-[#252525]">
                      {row.publishingStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 align-top text-right">
                    <button
                      onClick={() => handleCopyHook(row)}
                      className="p-1.5 rounded-lg border border-[#E8E6E1] text-[#615a51] hover:bg-[#FAF9F6] hover:text-[#252525] transition-colors"
                      title="Copy hook and concept"
                    >
                      {copiedId === row.id ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
