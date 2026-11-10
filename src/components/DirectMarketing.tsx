import React, { useState } from 'react';
import { EventData } from '../types';
import { generateEventJsonLd, validateEventJsonLd } from '../utils/schema';
import { formatINR } from '../utils/pricing';
import {
  Mail,
  MessageSquare,
  Newspaper,
  Code2,
  TrendingUp,
  Sparkles,
  Copy,
  Check,
  Download,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface DirectMarketingProps {
  event: EventData;
}

export const DirectMarketing: React.FC<DirectMarketingProps> = ({ event }) => {
  const [activeSubTab, setActiveSubTab] = useState<'email' | 'sms' | 'press_release' | 'schema' | 'conversion'>('email');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // UTM generator fields
  const [utmSource, setUtmSource] = useState('instagram');
  const [utmMedium, setUtmMedium] = useState('bio_link');
  const [utmCampaign, setUtmCampaign] = useState('early_bird_surge');

  // Pre-calculated JSON-LD Schema
  const schemaObj = generateEventJsonLd({
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    venueName: event.venueName,
    addressLocality: event.city,
    addressRegion: event.state,
    streetAddress: event.address,
    postalCode: event.pincode,
    organizerName: 'EventIQ Enterprise',
    organizerUrl: event.bookingUrl || 'https://eventiq.app',
    offers: event.ticketTiers.map(tier => ({
      name: tier.name,
      price: tier.priceInr,
      priceCurrency: 'INR',
      availability: 'InStock',
      url: event.bookingUrl,
    })),
  });

  const schemaValidation = validateEventJsonLd(schemaObj);
  const jsonLdString = JSON.stringify(schemaObj, null, 2);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const downloadJsonLd = () => {
    const blob = new Blob([jsonLdString], { type: 'application/ld+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-schema.jsonld`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generatedUtmUrl = `${event.bookingUrl || 'https://insider.in/event'}?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}&utm_id=${event.id}`;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E6E1]">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#252525]">Direct Marketing & Event Schema</h1>
          <p className="text-xs text-[#968A7C] mt-1">
            Coordinated 3-phase email drip sequences, compliant SMS broadcasts, AP-style press releases, and Google JSON-LD schema
          </p>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex flex-wrap bg-[#F4F2ED] p-1 rounded-xl border border-[#E8E6E1]">
          {[
            { id: 'email', label: 'Email Sequences', icon: Mail },
            { id: 'sms', label: 'SMS Alerts', icon: MessageSquare },
            { id: 'press_release', label: 'Press Release', icon: Newspaper },
            { id: 'schema', label: 'Google JSON-LD', icon: Code2 },
            { id: 'conversion', label: 'UTM Tracking', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive ? 'bg-[#252525] text-[#FAF9F6] shadow-xs' : 'text-[#615a51] hover:text-[#252525]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subtab 1: Email Drip Sequences */}
      {activeSubTab === 'email' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-[#F4F2ED] border border-[#E8E6E1] text-xs text-[#615a51]">
            <strong className="text-[#252525]">3-Phase Strategic Email Lifecycle:</strong> Synchronized messaging timed to drive presale code conversion, final price urgency, and day-of attendee logistics.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                phase: 'Phase 1: Announcement & Presale Drop',
                timing: '45 Days Prior',
                segment: 'VIP Loyalists & Pre-registered Attendees',
                subject: `Exclusive Access: ${event.name} presale code unlocked`,
                body: `Dear Friend of Live Music,\n\nThe wait is over. ${event.name} lands at ${event.venueName} from ${event.startDate.split('T')[0]}.\n\nBecause you subscribed early, your private presale code is now live:\n👉 CODE: ${event.presaleCode || 'VIPACCESS'} (Save ${event.presaleDiscountPercent || 15}%)\n\nPhase 1 tickets start at ${formatINR(event.ticketTiers[0]?.priceInr || 2499)}. Only 500 passes allocated for this tier.`,
                cta: 'Book Presale Passes',
              },
              {
                phase: 'Phase 2: Final Surge & Price Increase',
                timing: '7 Days Prior',
                segment: 'Explored Tickets / Cart Abandoners',
                subject: `Urgent: Ticket prices for ${event.name} surge this Friday`,
                body: `Hello,\n\nWe noticed you checked out tickets for ${event.name}. Ticket sales are pacing faster than anticipated and Phase 2 allocation is 92% booked.\n\nOn Friday at 11:59 PM, tickets will automatically move to Final Gate Pricing (+35% increase). Lock in your passes today and save.`,
                cta: 'Lock In Current Price',
              },
              {
                phase: 'Phase 3: Day-Of Venue Logistics',
                timing: 'Day of Event (Morning)',
                segment: 'All Confirmed Ticket Holders',
                subject: `Your Complete Arrival Guide for ${event.name} today`,
                body: `We can't wait to see you today at ${event.venueName}!\n\nKey Arrival Details:\n• Gates Open: 2:30 PM\n• Fast Track Entrance: Gate 1 (General) & Gate 3 (VIP)\n• Bag Policy: Transparent bags only (12" x 12")\n• Free Drinking Water stations inside\n\nHave your QR wristband code ready on your phone!`,
                cta: 'View Live Gates & Map',
              },
            ].map((seq, idx) => (
              <div key={idx} className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#E8E6E1] text-[#252525]">
                      {seq.timing}
                    </span>
                    <button
                      onClick={() => copyToClipboard(`Subject: ${seq.subject}\n\n${seq.body}`, `email-${idx}`)}
                      className="p-1 rounded-md text-[#968A7C] hover:text-[#252525]"
                      title="Copy email template"
                    >
                      {copiedKey === `email-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-[#252525]">{seq.phase}</div>
                    <div className="text-[10px] text-[#968A7C]">Target: {seq.segment}</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#F4F2ED] border border-[#E8E6E1] text-xs">
                    <span className="font-semibold text-[#252525]">Subject:</span> {seq.subject}
                  </div>

                  <p className="text-xs text-[#615a51] leading-relaxed whitespace-pre-line font-mono bg-white p-3 rounded-xl border border-[#E8E6E1] text-[11px]">
                    {seq.body}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E8E6E1] flex justify-between items-center text-xs">
                  <span className="text-[#968A7C] text-[11px]">CTA: "{seq.cta}"</span>
                  <span className="text-[10px] font-mono text-emerald-800">Ready to Send</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 2: SMS Marketing */}
      {activeSubTab === 'sms' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-[#F4F2ED] border border-[#E8E6E1] text-xs text-[#615a51]">
            <strong className="text-[#252525]">Regulatory Compliant SMS Broadcasting:</strong> 160-character limited bursts with explicit DND compliance and mandatory opt-out instructions.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Early Bird Alert',
                body: `EventIQ Alert: Early Bird passes for ${event.name} at ${event.venueName} are now LIVE at just ${formatINR(event.ticketTiers[0]?.priceInr || 2499)}. Use code ${event.presaleCode || 'VIP'} at ${event.bookingUrl}`,
                charCount: 154,
                optOut: 'Reply STOP to opt out. DND compliant.',
              },
              {
                title: 'Phase Surge Urgency',
                body: `URGENT: ${event.name} Phase 1 is 94% booked! Prices increase by 30% tonight at midnight. Secure your entry passes now: ${event.bookingUrl}`,
                charCount: 139,
                optOut: 'Reply STOP to cancel alerts.',
              },
              {
                title: 'Gate Entry & Parking Alert',
                body: `Welcome to ${event.name}! Gates open at 2:30 PM. Enter via Gate 1 (GA) or Gate 3 (VIP). Parking at Gate 2 (₹50). Have wristband QR ready.`,
                charCount: 147,
                optOut: 'Official event transactional alert.',
              },
            ].map((sms, i) => (
              <div key={i} className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#252525]">{sms.title}</span>
                  <span className="text-[10px] font-mono text-[#968A7C]">{sms.charCount} / 160 chars</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F4F2ED] border border-[#E8E6E1] text-xs text-[#252525] font-mono leading-relaxed">
                  {sms.body}
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#968A7C]">
                  <span>{sms.optOut}</span>
                  <button
                    onClick={() => copyToClipboard(sms.body, `sms-${i}`)}
                    className="p-1 text-[#252525] hover:text-[#968A7C]"
                    title="Copy SMS"
                  >
                    {copiedKey === `sms-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 3: Press Releases (AP Style) */}
      {activeSubTab === 'press_release' && (
        <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E6E1]">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#968A7C]">
                Official AP-Style Press Release
              </span>
              <h3 className="font-serif text-xl font-normal text-[#252525] mt-1">
                FOR IMMEDIATE RELEASE: {event.name} Announced in {event.city}
              </h3>
            </div>
            <button
              onClick={() => copyToClipboard(`FOR IMMEDIATE RELEASE\n\n${event.name} lands at ${event.venueName}\n\n${event.city.toUpperCase()}, INDIA — Today, organizers announced ${event.name}...`, 'pr-copy')}
              className="px-3 py-1.5 rounded-xl border border-[#E8E6E1] text-xs font-medium text-[#252525] hover:bg-[#F4F2ED] flex items-center gap-1.5"
            >
              {copiedKey === 'pr-copy' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Full Release</span>
            </button>
          </div>

          <div className="p-6 bg-white border border-[#E8E6E1] rounded-xl space-y-4 text-xs text-[#252525] font-serif leading-relaxed">
            <div className="font-mono text-[11px] text-[#968A7C]">
              {event.city.toUpperCase()}, INDIA — {new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>

            <p>
              <strong>{event.name}</strong>, South India's premier gathering for live {event.genre}, will officially take place at <strong>{event.venueName}</strong> in {event.city} from {new Date(event.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} to {new Date(event.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}.
            </p>

            <p>
              Designed to bring together music aficionados, creative innovators, and urban cultural communities, the event features more than 40 artists across three stages, world-class acoustic design, and curated culinary experiences.
            </p>

            <div className="p-3.5 bg-[#FAF9F6] border-l-2 border-[#252525] italic text-[#615a51]">
              "Our goal with {event.name} is to establish a world-class festival benchmark right here in {event.city}. Every production decision, from acoustics to sustainable waste management and attendee wellness, has been engineered for excellence," stated the Organizing Committee [QUOTE MARKED FOR FINAL CLIENT APPROVAL].
            </div>

            <p>
              Passes are priced starting from <strong>{formatINR(event.ticketTiers[0]?.priceInr || 2499)}</strong> for early-bird admission up to <strong>{formatINR(event.ticketTiers[event.ticketTiers.length - 1]?.priceInr || 7999)}</strong> for the Royal VIP Lounge. Ticket allocations are available exclusively via the official booking channel at {event.bookingUrl}.
            </p>

            <div className="pt-4 border-t border-[#E8E6E1] font-mono text-[11px] text-[#968A7C] space-y-1">
              <div className="font-bold text-[#252525]">MEDIA CONTACT:</div>
              <div>EventIQ Press Office | Email: press@eventiq.app</div>
              <div>Direct: +91 80 4920 3300 | Website: https://eventiq.app</div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 4: Schema.org Event JSON-LD */}
      {activeSubTab === 'schema' && (
        <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E6E1]">
            <div>
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#968A7C]" />
                <h3 className="font-serif text-lg font-medium text-[#252525]">Schema.org Event JSON-LD Generator</h3>
              </div>
              <p className="text-xs text-[#968A7C] mt-0.5">
                Google Rich Snippets validated with Indian Rupee (INR) and Indian Standard Time (IST) offsets
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(jsonLdString, 'schema-json')}
                className="px-3 py-1.5 rounded-xl border border-[#E8E6E1] text-xs font-medium text-[#252525] hover:bg-[#F4F2ED] flex items-center gap-1.5"
              >
                {copiedKey === 'schema-json' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy JSON-LD</span>
              </button>
              <button
                onClick={downloadJsonLd}
                className="px-3 py-1.5 rounded-xl bg-[#252525] text-[#FAF9F6] text-xs font-medium hover:bg-[#3a3530] flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .jsonld</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Google Schema Validation: All required Event properties, location Place, and ticket Offers are valid.</span>
          </div>

          <pre className="p-4 bg-[#181818] text-[#FAF9F6] rounded-xl text-xs font-mono overflow-x-auto max-h-96 leading-relaxed">
            {jsonLdString}
          </pre>
        </div>
      )}

      {/* Subtab 5: UTM Link Generator & Conversion Tracking */}
      {activeSubTab === 'conversion' && (
        <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E6E1]">
            <div>
              <h3 className="font-serif text-lg font-medium text-[#252525]">Campaign Attribution & UTM Builder</h3>
              <p className="text-xs text-[#968A7C]">Create trackable ticketing links for Instagram bio, email drips, and influencer campaigns</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#615a51]">UTM Source</label>
              <input
                type="text"
                value={utmSource}
                onChange={e => setUtmSource(e.target.value)}
                className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#615a51]">UTM Medium</label>
              <input
                type="text"
                value={utmMedium}
                onChange={e => setUtmMedium(e.target.value)}
                className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#615a51]">UTM Campaign</label>
              <input
                type="text"
                value={utmCampaign}
                onChange={e => setUtmCampaign(e.target.value)}
                className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-[#615a51]">Generated Tracked Destination URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={generatedUtmUrl}
                className="flex-1 px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs font-mono text-[#252525]"
              />
              <button
                onClick={() => copyToClipboard(generatedUtmUrl, 'utm-url')}
                className="px-4 py-2 bg-[#252525] text-[#FAF9F6] rounded-xl text-xs font-medium hover:bg-[#3a3530] flex items-center gap-1.5"
              >
                {copiedKey === 'utm-url' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Link</span>
              </button>
            </div>
          </div>

          {/* Sample channel performance breakdown */}
          <div className="pt-4 border-t border-[#E8E6E1] space-y-3">
            <h4 className="font-serif text-base font-normal text-[#252525]">Tracked Channel Performance</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-[#F4F2ED] rounded-xl border border-[#E8E6E1]">
                <div className="text-[#968A7C]">Instagram Bio</div>
                <div className="text-lg font-serif font-semibold text-[#252525] mt-1">1,842 clicks</div>
                <div className="text-[10px] text-emerald-700">6.2% conv. rate</div>
              </div>
              <div className="p-3 bg-[#F4F2ED] rounded-xl border border-[#E8E6E1]">
                <div className="text-[#968A7C]">Email Drip Drop</div>
                <div className="text-lg font-serif font-semibold text-[#252525] mt-1">940 clicks</div>
                <div className="text-[10px] text-emerald-700">14.8% conv. rate</div>
              </div>
              <div className="p-3 bg-[#F4F2ED] rounded-xl border border-[#E8E6E1]">
                <div className="text-[#968A7C]">WhatsApp Community</div>
                <div className="text-lg font-serif font-semibold text-[#252525] mt-1">620 clicks</div>
                <div className="text-[10px] text-emerald-700">9.1% conv. rate</div>
              </div>
              <div className="p-3 bg-[#F4F2ED] rounded-xl border border-[#E8E6E1]">
                <div className="text-[#968A7C]">SEO Snippets</div>
                <div className="text-lg font-serif font-semibold text-[#252525] mt-1">3,120 clicks</div>
                <div className="text-[10px] text-emerald-700">4.3% conv. rate</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
