import React, { useState, useEffect } from 'react';
import { EventData, SeoIntelligenceResult } from '../types';
import {
  Search,
  Sparkles,
  Globe,
  HelpCircle,
  Copy,
  Check,
  AlertCircle,
  Smartphone,
  Monitor,
  ExternalLink,
  MapPin,
  TrendingUp,
} from 'lucide-react';

interface SeoIntelligenceProps {
  event: EventData;
}

export const SeoIntelligence: React.FC<SeoIntelligenceProps> = ({ event }) => {
  const [targetCity, setTargetCity] = useState(event.city);
  const [isLoading, setIsLoading] = useState(false);
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'mobile'>('desktop');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [seoData, setSeoData] = useState<SeoIntelligenceResult>({
    metaTitle: `${event.name} 2026 Tickets, Lineup & Venue Guide | ${event.city}`,
    metaDescription: `Book official passes for ${event.name} at ${event.venueName}, ${event.city}. Over 40 live artists, 3 stages. Phase 1 early bird tickets start at ₹${event.ticketTiers[0]?.priceInr || 2499}.`,
    primaryKeywords: [
      {
        keyword: `${event.name.toLowerCase()} tickets`,
        intent: 'transactional',
        cluster: 'Ticketing & Booking',
        difficultyScore: 36,
        estimatedMonthlySearches: 14200,
        isLocalIndianQuery: true,
        targetLocation: event.city,
        suggestedContentAnchor: 'Buy Phase 1 Early Bird Tickets',
      },
      {
        keyword: `${event.name.toLowerCase()} schedule ${event.city.toLowerCase()}`,
        intent: 'informational',
        cluster: 'Timings & Set Times',
        difficultyScore: 22,
        estimatedMonthlySearches: 9800,
        isLocalIndianQuery: true,
        targetLocation: event.city,
        suggestedContentAnchor: 'Official Set Times & Gates',
      },
    ],
    secondaryKeywords: [
      {
        keyword: `music festivals in ${event.city.toLowerCase()} 2026`,
        intent: 'commercial',
        cluster: 'City Lifestyle & Events',
        difficultyScore: 48,
        estimatedMonthlySearches: 22400,
        isLocalIndianQuery: true,
        targetLocation: event.city,
        suggestedContentAnchor: 'Best Upcoming Live Music Events in Bangalore',
      },
      {
        keyword: `${event.venueName.toLowerCase()} parking entry gate`,
        intent: 'informational',
        cluster: 'Venue Logistics',
        difficultyScore: 16,
        estimatedMonthlySearches: 3400,
        isLocalIndianQuery: true,
        targetLocation: event.city,
        suggestedContentAnchor: 'Parking & Gate Instructions',
      },
    ],
    headingStructure: {
      h1: `${event.name} 2026: Official Festival Guide, Passes & Schedule`,
      h2s: [
        'Complete Artist Lineup & Stage Breakdown',
        'Ticket Categories & Royal VIP Pass Inclusions',
        'Venue Map, Entry Gates & Parking Guidelines',
        'Frequently Asked Questions & Attendee Policies',
      ],
      h3s: [
        'Phase 1 vs Phase 2 Pricing Comparison',
        'Bag Policy & What You Can Bring Inside',
        'How to Reach Jayamahal Palace Ground via Namma Metro',
      ],
    },
    googleAnswerBoxFaqs: [
      {
        question: `When and where is ${event.name} taking place?`,
        answerSnippet: `${event.name} is scheduled from ${event.startDate.split('T')[0]} to ${event.endDate.split('T')[0]} at ${event.venueName} in ${event.city}. Gates open at 2:30 PM each day, with performances concluding at 11:30 PM.`,
      },
      {
        question: `How much are passes for ${event.name}?`,
        answerSnippet: `Tickets start from ₹${event.ticketTiers[0]?.priceInr || 2499} for General Admission up to ₹${event.ticketTiers[event.ticketTiers.length - 1]?.priceInr || 7999} for the Royal VIP Lounge. Ticket pricing includes 18% GST.`,
      },
    ],
    localSeoTips: [
      `Deploy Schema.org Event JSON-LD structured markup with Indian Rupee (INR) and IST offset (+05:30).`,
      `Embed Google Maps with accurate geo-coordinates for ${event.venueName}.`,
      `Create dedicated landing pages targeting regional queries like "${event.city} festival parking" and "nearest metro to ${event.venueName}".`,
      `Verify the venue on Google Business Profile to capture local 'near me' mobile searches.`,
    ],
    isAiEstimated: true,
  });

  const handleFetchSeoIntelligence = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/seo-intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          targetCity,
        }),
      });

      const data = await res.json();
      if (data.metaTitle) {
        setSeoData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E6E1]">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#252525]">SEO & SERP Intelligence</h1>
          <p className="text-xs text-[#968A7C] mt-1">
            Search intent mapping, Google SERP snippet simulation, local Indian SEO recommendations, and keyword clustering
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Target City"
            value={targetCity}
            onChange={e => setTargetCity(e.target.value)}
            className="px-3 py-1.5 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525] w-32"
          />
          <button
            onClick={handleFetchSeoIntelligence}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-xl bg-[#252525] text-[#FAF9F6] text-xs font-medium hover:bg-[#3a3530] flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Analyzing SERP...' : 'Refresh SEO Intelligence'}</span>
          </button>
        </div>
      </div>

      {/* Notice regarding Search Estimates */}
      <div className="p-3.5 rounded-xl bg-[#F4F2ED] border border-[#E8E6E1] text-xs text-[#615a51] flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-[#968A7C] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-[#252525]">Data Transparency Note:</strong> Monthly search volume and difficulty scores are AI-estimated models grounded in historical Indian entertainment query trends. Real live SERP ranks require active Google Search Console or third-party SEO API integration.
        </p>
      </div>

      {/* Google SERP Preview Simulator */}
      <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#968A7C]" />
            <h3 className="font-serif text-lg font-medium text-[#252525]">Google Search Snippet Simulator</h3>
          </div>
          <div className="flex items-center gap-1 bg-[#F4F2ED] p-1 rounded-lg border border-[#E8E6E1]">
            <button
              onClick={() => setDevicePreview('desktop')}
              className={`p-1.5 rounded-md text-xs ${devicePreview === 'desktop' ? 'bg-[#252525] text-[#FAF9F6]' : 'text-[#968A7C]'}`}
              title="Desktop SERP"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDevicePreview('mobile')}
              className={`p-1.5 rounded-md text-xs ${devicePreview === 'mobile' ? 'bg-[#252525] text-[#FAF9F6]' : 'text-[#968A7C]'}`}
              title="Mobile SERP"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Realistic Google Search Card */}
        <div
          className={`p-4 bg-white border border-[#E8E6E1] rounded-xl shadow-xs transition-all ${
            devicePreview === 'mobile' ? 'max-w-md mx-auto' : 'w-full'
          }`}
        >
          <div className="flex items-center gap-2 text-[12px] text-[#202124]">
            <div className="w-4 h-4 rounded-full bg-[#252525] flex items-center justify-center text-[9px] text-white font-serif">
              E
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] text-[#202124] leading-tight font-medium">EventIQ Official</span>
              <span className="text-[10px] text-[#5f6368] leading-tight">https://eventiq.app › events › {event.city.toLowerCase()}</span>
            </div>
          </div>

          <h4 className="text-[18px] text-[#1a0dab] hover:underline cursor-pointer font-medium mt-1 leading-snug">
            {seoData.metaTitle}
          </h4>

          <p className="text-[13px] text-[#4d5156] leading-relaxed mt-1">
            {seoData.metaDescription}
          </p>

          {/* Sitelinks simulation */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#f1f3f4]">
            <div>
              <span className="text-xs text-[#1a0dab] hover:underline cursor-pointer font-medium">
                Lineup & Artists
              </span>
              <p className="text-[11px] text-[#5f6368] line-clamp-1">Explore all 40+ performers and stage schedules.</p>
            </div>
            <div>
              <span className="text-xs text-[#1a0dab] hover:underline cursor-pointer font-medium">
                Venue & Parking
              </span>
              <p className="text-[11px] text-[#5f6368] line-clamp-1">Gate 1 & Gate 3 entry map and two-wheeler parking.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Keywords & Google Answer Box */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Keyword Intelligence */}
        <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-medium text-[#252525]">Target Keyword Clusters</h3>
            <span className="text-xs font-mono text-[#968A7C]">Localized Intent</span>
          </div>

          <div className="space-y-3">
            {[...seoData.primaryKeywords, ...seoData.secondaryKeywords].map((kw, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-[#F4F2ED] border border-[#E8E6E1] space-y-2 hover:border-[#252525] transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[#252525]">{kw.keyword}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full font-mono uppercase bg-[#FAF9F6] text-[#615a51] border border-[#E8E6E1]">
                      {kw.intent}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-medium text-[#252525]">
                    ~{kw.estimatedMonthlySearches.toLocaleString()} /mo
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#968A7C]">
                  <span>Cluster: {kw.cluster}</span>
                  <span>Difficulty: {kw.difficultyScore}/100</span>
                </div>

                <div className="text-[11px] text-[#615a51] pt-1 border-t border-[#E8E6E1]/60">
                  <span className="font-medium text-[#252525]">Recommended Anchor:</span> "{kw.suggestedContentAnchor}"
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Google Answer Box FAQs & Local SEO Checklist */}
        <div className="space-y-6">
          
          {/* Answer Box Snippets */}
          <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#968A7C]" />
              <h3 className="font-serif text-lg font-medium text-[#252525]">Featured Answer Box Snippets</h3>
            </div>

            <div className="space-y-3">
              {seoData.googleAnswerBoxFaqs.map((faq, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#F4F2ED] border border-[#E8E6E1] space-y-1.5">
                  <div className="text-xs font-semibold text-[#252525]">Q: {faq.question}</div>
                  <p className="text-xs text-[#615a51] leading-relaxed">A: {faq.answerSnippet}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Local SEO Strategy Checklist */}
          <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <h3 className="font-serif text-lg font-medium text-[#252525]">India Local SEO Directives</h3>
            </div>

            <ul className="space-y-2 text-xs text-[#615a51]">
              {seoData.localSeoTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#252525] mt-1.5 shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
};
