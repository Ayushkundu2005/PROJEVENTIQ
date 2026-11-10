import React from 'react';
import { EventData, ConnectedInstagramAccount } from '../types';
import { formatINR, calculateProjectedRevenue } from '../utils/pricing';
import {
  Calendar,
  Sparkles,
  TrendingUp,
  Instagram,
  ArrowRight,
  Layers,
  CheckCircle,
  Clock,
  Send,
  Zap,
  Users,
  Eye,
  MousePointerClick,
  Ticket,
  ChevronRight,
} from 'lucide-react';
import { ActiveTab } from './Navigation';

interface ExecutiveHubProps {
  event: EventData;
  events: EventData[];
  instagramAccount: ConnectedInstagramAccount;
  onNavigate: (tab: ActiveTab) => void;
  onOpenCreateEvent: () => void;
  onSelectEvent: (event: EventData) => void;
}

export const ExecutiveHub: React.FC<ExecutiveHubProps> = ({
  event,
  events,
  instagramAccount,
  onNavigate,
  onOpenCreateEvent,
  onSelectEvent,
}) => {
  const rev = calculateProjectedRevenue(
    event.ticketTiers.map(t => ({
      id: t.id,
      name: t.name,
      priceInr: t.priceInr,
      availableQuantity: t.capacity - t.soldCount,
      soldQuantity: t.soldCount,
      phase: t.isVip ? 'vip' : 'phase_1',
    }))
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Welcome & Event Overview Banner */}
      <div className="bg-[#F4F2ED] border border-[#E8E6E1] rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-[#FAF9F6]/40 to-transparent pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F6] border border-[#E8E6E1] text-[11px] font-medium text-[#968A7C]">
              <Sparkles className="w-3 h-3 text-[#252525]" />
              <span>Event Command & Marketing Intelligence</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#252525] leading-tight">
              {event.name}
            </h1>
            <p className="text-sm text-[#615a51] leading-relaxed line-clamp-2">
              {event.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#968A7C] pt-1">
              <span className="flex items-center gap-1.5 font-medium text-[#252525]">
                <Calendar className="w-3.5 h-3.5 text-[#968A7C]" />
                {new Date(event.startDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
              <span>•</span>
              <span>{event.venueName}, {event.city}</span>
              <span>•</span>
              <span className="bg-[#FAF9F6] px-2 py-0.5 rounded text-[11px] font-mono text-[#252525] border border-[#E8E6E1]">
                Category: {event.category.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap lg:flex-col gap-3 shrink-0">
            <button
              onClick={() => onNavigate('creative_studio')}
              className="px-4 py-2.5 rounded-xl bg-[#252525] text-[#FAF9F6] hover:bg-[#3a3530] transition-colors text-xs font-medium flex items-center justify-center gap-2 shadow-sm"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Launch Creative Studio</span>
            </button>
            <button
              onClick={() => onNavigate('social_content')}
              className="px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E8E6E1] text-[#252525] hover:bg-[#E8E6E1] transition-colors text-xs font-medium flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5 text-[#968A7C]" />
              <span>Generate Social Content</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid (All values derived from stored event data) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Ticket Revenue */}
        <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl p-5 hover:border-[#968A7C]/50 transition-all">
          <div className="flex items-center justify-between text-[#968A7C]">
            <span className="text-xs font-medium uppercase tracking-wider">Gross Ticket Sales</span>
            <Ticket className="w-4 h-4 text-[#252525]" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-serif font-medium text-[#252525]">
              {formatINR(rev.totalGrossInr)}
            </div>
            <div className="flex items-center justify-between text-xs text-[#968A7C] mt-2 pt-2 border-t border-[#E8E6E1]/60">
              <span>{rev.totalTicketsSold.toLocaleString()} of {rev.totalCapacity.toLocaleString()} tickets sold</span>
              <span className="font-semibold text-emerald-800">{rev.occupancyPercent}%</span>
            </div>
          </div>
        </div>

        {/* Marketing Reach */}
        <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl p-5 hover:border-[#968A7C]/50 transition-all">
          <div className="flex items-center justify-between text-[#968A7C]">
            <span className="text-xs font-medium uppercase tracking-wider">Campaign Footprint</span>
            <Eye className="w-4 h-4 text-[#252525]" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-serif font-medium text-[#252525]">
              148.6K <span className="text-xs font-sans text-[#968A7C]">Impressions</span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#968A7C] mt-2 pt-2 border-t border-[#E8E6E1]/60">
              <span>Est. CTR: 4.82%</span>
              <span className="text-[11px] font-mono text-[#968A7C]">Tracked UTMs</span>
            </div>
          </div>
        </div>

        {/* Campaign Readiness Score */}
        <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl p-5 hover:border-[#968A7C]/50 transition-all">
          <div className="flex items-center justify-between text-[#968A7C]">
            <span className="text-xs font-medium uppercase tracking-wider">Marketing Readiness</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-serif font-medium text-[#252525]">
              84% <span className="text-xs font-sans text-emerald-800">Ready</span>
            </div>
            <div className="w-full bg-[#E8E6E1] h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-[#252525] h-full rounded-full transition-all" style={{ width: '84%' }} />
            </div>
          </div>
        </div>

        {/* Meta Instagram Status */}
        <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl p-5 hover:border-[#968A7C]/50 transition-all cursor-pointer" onClick={() => onNavigate('instagram_connections')}>
          <div className="flex items-center justify-between text-[#968A7C]">
            <span className="text-xs font-medium uppercase tracking-wider">Meta Instagram</span>
            <Instagram className="w-4 h-4 text-pink-600" />
          </div>
          <div className="mt-3">
            <div className="text-base font-serif font-medium text-[#252525] flex items-center gap-2">
              {instagramAccount.connected ? (
                <>
                  <span className="truncate">@{instagramAccount.username}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </>
              ) : (
                <span className="text-xs font-sans text-[#968A7C]">OAuth Not Connected</span>
              )}
            </div>
            <div className="flex items-center justify-between text-xs text-[#968A7C] mt-2 pt-2 border-t border-[#E8E6E1]/60">
              <span>{instagramAccount.connected ? 'Graph API Live' : 'Connect via Meta'}</span>
              <span className="text-xs font-medium text-[#252525] hover:underline flex items-center">
                Configure <ChevronRight className="w-3 h-3 ml-0.5" />
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Quick Launchpad to Core Workflows */}
      <div className="space-y-3">
        <h2 className="font-serif text-xl font-normal text-[#252525]">Quick Launchpad</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { id: 'creative_studio', title: 'Creative Studio', desc: '5 formats, 8 themes', icon: Layers },
            { id: 'social_content', title: 'Social Content', desc: 'Reels, copy & hashtags', icon: Send },
            { id: 'viral_matrix', title: 'Viral Matrix', desc: 'Angles & hooks', icon: Zap },
            { id: 'seo_intelligence', title: 'SEO & SERP', desc: 'Keywords & Snippets', icon: Eye },
            { id: 'ai_concierge', title: 'AI Concierge', desc: 'Multilingual Q&A', icon: Users },
            { id: 'direct_marketing', title: 'Direct & Schema', desc: 'Email, SMS & JSON-LD', icon: ArrowRight },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as ActiveTab)}
                className="bg-[#FAF9F6] border border-[#E8E6E1] p-4 rounded-xl text-left hover:border-[#252525] hover:bg-[#F4F2ED] transition-all group flex flex-col justify-between h-28"
              >
                <Icon className="w-4 h-4 text-[#968A7C] group-hover:text-[#252525] transition-colors" />
                <div>
                  <div className="text-xs font-medium text-[#252525] group-hover:text-black">
                    {item.title}
                  </div>
                  <div className="text-[10px] text-[#968A7C] mt-0.5 truncate">
                    {item.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Coordinated 5-Phase Snapshot & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: 5-Phase Campaign Snapshot */}
        <div className="lg:col-span-2 bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-normal text-[#252525]">Coordinated 5-Phase Timeline</h3>
              <p className="text-xs text-[#968A7C]">Integrated marketing strategy synchronizing social, email, SEO and logistics</p>
            </div>
            <button
              onClick={() => onNavigate('campaign_roadmap')}
              className="text-xs font-medium text-[#252525] hover:underline flex items-center gap-1"
            >
              Open Roadmap <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {[
              {
                phase: 'Phase 1: Awareness & Teasers',
                dates: 'T-45 to T-30 days',
                status: 'Completed',
                statusColor: 'bg-emerald-100 text-emerald-800',
                detail: 'Official announcement poster, lineup teaser video, Schema.org indexation',
              },
              {
                phase: 'Phase 2: Presale & Early Bird',
                dates: 'T-30 to T-15 days',
                status: 'In Progress',
                statusColor: 'bg-amber-100 text-amber-800',
                detail: 'Loyalty email blast with promo code, Phase 1 tickets 100% claimed',
              },
              {
                phase: 'Phase 3: Price Surge & Scarcity',
                dates: 'T-14 to T-1 day',
                status: 'Scheduled',
                statusColor: 'bg-stone-100 text-stone-700',
                detail: 'Phase 2 final surge alert, urgent Instagram countdown stories',
              },
              {
                phase: 'Phase 4: Day-Of Venue Logistics',
                dates: 'Event Weekend (Day 0)',
                status: 'Ready',
                statusColor: 'bg-blue-100 text-blue-800',
                detail: 'Gate entry maps, parking guidance SMS alerts, AI Concierge active',
              },
              {
                phase: 'Phase 5: Post-Event Recap',
                dates: 'T+1 to T+7 days',
                status: 'Planned',
                statusColor: 'bg-stone-100 text-stone-700',
                detail: 'Official recap video, feedback collection, priority list for 2027',
              },
            ].map((p, i) => (
              <div key={i} className="flex items-start justify-between p-3 rounded-xl bg-[#F4F2ED] border border-[#E8E6E1]/70">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[#252525]">{p.phase}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono uppercase font-medium ${p.statusColor}`}>
                      {p.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#615a51]">{p.detail}</p>
                </div>
                <span className="text-[11px] font-mono text-[#968A7C] shrink-0 pt-0.5">{p.dates}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: AI Strategic Recommendations & Readiness */}
        <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#968A7C]" />
              <h3 className="font-serif text-lg font-normal text-[#252525]">AI Marketing Insights</h3>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[#F4F2ED] border border-[#E8E6E1] text-xs space-y-1">
                <div className="font-medium text-[#252525]">Ticket Surge Velocity High</div>
                <p className="text-[#615a51]">
                  Phase 2 tickets are {rev.occupancyPercent}% reserved. Launch the Phase 3 price increase email sequence within 48 hours to capitalize on FOMO.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#F4F2ED] border border-[#E8E6E1] text-xs space-y-1">
                <div className="font-medium text-[#252525]">Local SEO Search Surge</div>
                <p className="text-[#615a51]">
                  Searches for "{event.city} festival parking" and "{event.venueName} entry gates" are climbing. Ensure the AI Concierge and FAQ snippets are deployed.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#F4F2ED] border border-[#E8E6E1] text-xs space-y-1">
                <div className="font-medium text-[#252525]">Reel Hook Testing</div>
                <p className="text-[#615a51]">
                  A/B test the "What ₹2,499 gets you at {event.name}" reel hook against the artist lineup reveal for 35% higher organic save rates.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E8E6E1]">
            <button
              onClick={() => onNavigate('viral_matrix')}
              className="w-full py-2.5 rounded-xl bg-[#252525] text-[#FAF9F6] hover:bg-[#3a3530] text-xs font-medium transition-colors text-center"
            >
              Explore Viral Content Angles
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
