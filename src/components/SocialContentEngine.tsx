import React, { useState } from 'react';
import { EventData, SocialPlatform, SocialContentItem, ConnectedInstagramAccount } from '../types';
import {
  Share2,
  Instagram,
  Youtube,
  Facebook,
  Video,
  Sparkles,
  Send,
  Calendar,
  Save,
  Check,
  Copy,
  Clock,
  AlertCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface SocialContentEngineProps {
  event: EventData;
  instagramAccount: ConnectedInstagramAccount;
  onOpenInstagramModal: () => void;
}

export const SocialContentEngine: React.FC<SocialContentEngineProps> = ({
  event,
  instagramAccount,
  onOpenInstagramModal,
}) => {
  const [platform, setPlatform] = useState<SocialPlatform>('instagram');
  const [contentType, setContentType] = useState<'caption' | 'carousel' | 'reel_hook' | 'video_script' | 'announcement'>('caption');
  const [campaignPhase, setCampaignPhase] = useState<'awareness' | 'presale' | 'price_surge' | 'day_of' | 'post_event'>('awareness');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Active generated draft
  const [activeDraft, setActiveDraft] = useState<SocialContentItem>({
    id: 'sc-1',
    eventId: event.id,
    platform: 'instagram',
    contentType: 'caption',
    title: `${event.name} Official Announcement`,
    hook: `The countdown begins. ${event.name} lands in ${event.city}.`,
    body: `South India's most anticipated weekend arrives at ${event.venueName}.\n\nFrom immersive stage design to an uncompromised sound system, this is where music history is written.\n\n🎟️ Phase 1 Early Bird passes live now.\n📍 ${event.venueName}, ${event.city}\n🗓️ ${new Date(event.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${new Date(event.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}\n\nStrictly limited ticket allocation. Don't wait for gate pricing.`,
    callToAction: 'Tap link in bio to secure your access before Phase 1 sells out.',
    hashtags: [
      `#${event.name.replace(/[^a-zA-Z0-9]/g, '')}`,
      `#${event.city}Nightlife`,
      `#LiveIn${event.city}`,
      '#EventIQ',
      '#IndianIndieScene',
    ],
    campaignPhase: 'awareness',
    status: 'draft',
    createdAt: new Date().toISOString(),
  });

  // Saved library of social posts
  const [savedPosts, setSavedPosts] = useState<SocialContentItem[]>([
    activeDraft,
    {
      id: 'sc-2',
      eventId: event.id,
      platform: 'instagram',
      contentType: 'reel_hook',
      title: '3-Second Reel Viral Hook',
      hook: `What does ₹${event.ticketTiers[0]?.priceInr || 2499} get you at ${event.name}?`,
      body: `[0:00 - 0:03]: Fast cut of crowd bass drop at ${event.venueName}.\n[0:03 - 0:08]: Text overlay "3 Stages, 40+ Artists, 72 Hours of Sound".\n[0:08 - 0:15]: Show VIP lounge & sunset view. Voiceover: "Phase 1 closes this Friday."`,
      callToAction: 'Save this reel & tag your concert crew.',
      hashtags: ['#ConcertVibes', `#${event.city}Events`, '#ReelTrends'],
      campaignPhase: 'presale',
      status: 'scheduled',
      scheduledDate: '2026-11-12 18:00',
      createdAt: '2026-11-01T12:00:00Z',
    },
  ]);

  // Instagram publishing state
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<{ success: boolean; message: string } | null>(null);

  // Trigger Gemini AI Content Generation via Backend
  const handleGenerate = async () => {
    setIsGenerating(true);
    setPublishResult(null);

    try {
      const res = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          platform,
          contentType,
          campaignPhase,
          customPrompt,
        }),
      });

      const data = await res.json();
      if (data.title) {
        setActiveDraft({
          id: `sc-${Date.now()}`,
          eventId: event.id,
          platform,
          contentType,
          title: data.title,
          hook: data.hook || '',
          body: data.body || '',
          callToAction: data.callToAction || '',
          hashtags: data.hashtags || [],
          campaignPhase,
          status: 'draft',
          createdAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error('Error generating AI content:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePost = () => {
    setSavedPosts([activeDraft, ...savedPosts.filter(p => p.id !== activeDraft.id)]);
  };

  const handleCopyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Official Instagram Publishing Workflow
  const handlePublishToInstagram = async () => {
    if (!instagramAccount.connected) {
      onOpenInstagramModal();
      return;
    }

    setPublishing(true);
    setPublishResult(null);

    try {
      const fullCaption = `${activeDraft.hook}\n\n${activeDraft.body}\n\n${activeDraft.callToAction}\n\n${activeDraft.hashtags.join(' ')}`;
      const res = await fetch('/api/instagram/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: event.bannerImage || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1080&q=80',
          caption: fullCaption,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setPublishResult({
          success: true,
          message: `Successfully published to @${data.account} via official Meta Graph API (Media ID: ${data.mediaId})`,
        });
        setActiveDraft({ ...activeDraft, status: 'published', metaMediaId: data.mediaId });
      } else {
        setPublishResult({
          success: false,
          message: data.guidance || data.error || 'Meta API returned an error during media publishing.',
        });
      }
    } catch (err: any) {
      setPublishResult({
        success: false,
        message: err.message || 'Network error attempting to reach Meta Graph API.',
      });
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E6E1]">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#252525]">Social Content Engine</h1>
          <p className="text-xs text-[#968A7C] mt-1">
            Generate platform-native captions, reel scripts, carousel hooks, and publish directly to verified Instagram Business accounts
          </p>
        </div>

        <div className="flex items-center gap-2">
          {instagramAccount.connected ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Publishing enabled for @{instagramAccount.username}</span>
            </div>
          ) : (
            <button
              onClick={onOpenInstagramModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F4F2ED] border border-[#E8E6E1] text-xs font-medium text-[#252525] hover:bg-[#E8E6E1]"
            >
              <Instagram className="w-3.5 h-3.5 text-pink-600" />
              <span>Connect Instagram for Auto-Publish</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Controls + Draft Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Platform Selector */}
          <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-5 space-y-3">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#968A7C] font-semibold">
              Select Target Channel
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-600' },
                { id: 'youtube_shorts', label: 'YouTube Shorts', icon: Youtube, color: 'text-red-600' },
                { id: 'tiktok', label: 'TikTok', icon: Video, color: 'text-black' },
                { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-600' },
              ].map((p) => {
                const Icon = p.icon;
                const isSelected = platform === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id as SocialPlatform)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-[#252525] bg-[#252525] text-[#FAF9F6]'
                        : 'border-[#E8E6E1] bg-[#F4F2ED] text-[#252525] hover:border-[#968A7C]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-[#FAF9F6]' : p.color}`} />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Type & Campaign Phase */}
          <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#615a51]">Content Format</label>
              <select
                value={contentType}
                onChange={e => setContentType(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525] focus:outline-none focus:ring-1 focus:ring-[#252525]"
              >
                <option value="caption">Feed Post Caption & Story Text</option>
                <option value="reel_hook">3-Second Viral Reel Hook & Visual Direction</option>
                <option value="video_script">Short-Form Video Script with Voiceover</option>
                <option value="carousel">Multi-Slide Carousel Copy Breakdown</option>
                <option value="announcement">Urgent Phase / Price Announcement</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#615a51]">Campaign Lifecycle Phase</label>
              <select
                value={campaignPhase}
                onChange={e => setCampaignPhase(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525] focus:outline-none focus:ring-1 focus:ring-[#252525]"
              >
                <option value="awareness">Phase 1: Awareness & Teasers</option>
                <option value="presale">Phase 2: Presale & Early Bird</option>
                <option value="price_surge">Phase 3: Price Surge & Scarcity</option>
                <option value="day_of">Phase 4: Day-Of Venue Logistics</option>
                <option value="post_event">Phase 5: Post-Event & Retention</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#615a51]">Custom Creative Angle (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Focus on VIP fast-track entry and backstage sunset bar"
                value={customPrompt}
                onChange={e => setCustomPrompt(e.target.value)}
                className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525]"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-2.5 rounded-xl bg-[#252525] text-[#FAF9F6] text-xs font-medium hover:bg-[#3a3530] transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Synthesizing with Gemini...' : 'Generate Platform Copy'}</span>
            </button>
          </div>

        </div>

        {/* Right Editor & Preview Pane (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E6E1]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium font-mono text-[#968A7C] uppercase tracking-wider">
                  {platform} • {activeDraft.contentType}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E8E6E1] text-[#252525] font-mono">
                  {activeDraft.campaignPhase}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyText(`${activeDraft.hook}\n\n${activeDraft.body}\n\n${activeDraft.callToAction}\n\n${activeDraft.hashtags.join(' ')}`, 1)}
                  className="px-2.5 py-1.5 rounded-lg border border-[#E8E6E1] text-xs font-medium text-[#615a51] hover:bg-[#F4F2ED] flex items-center gap-1"
                >
                  {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIndex === 1 ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleSavePost}
                  className="px-2.5 py-1.5 rounded-lg border border-[#E8E6E1] text-xs font-medium text-[#615a51] hover:bg-[#F4F2ED] flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Draft</span>
                </button>
              </div>
            </div>

            {/* Hook Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-[#968A7C]">Hook / Opening Sentence</label>
              <input
                type="text"
                value={activeDraft.hook}
                onChange={e => setActiveDraft({ ...activeDraft, hook: e.target.value })}
                className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs font-medium text-[#252525]"
              />
            </div>

            {/* Body / Script */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-[#968A7C]">Content Body & Scene Directions</label>
              <textarea
                rows={7}
                value={activeDraft.body}
                onChange={e => setActiveDraft({ ...activeDraft, body: e.target.value })}
                className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525] font-sans leading-relaxed"
              />
            </div>

            {/* CTA */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-[#968A7C]">Call to Action</label>
              <input
                type="text"
                value={activeDraft.callToAction}
                onChange={e => setActiveDraft({ ...activeDraft, callToAction: e.target.value })}
                className="w-full px-3 py-1.5 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525]"
              />
            </div>

            {/* Hashtags */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase text-[#968A7C]">Curated Hashtags</label>
              <div className="flex flex-wrap gap-1.5">
                {activeDraft.hashtags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-mono px-2 py-0.5 rounded-lg bg-[#F4F2ED] border border-[#E8E6E1] text-[#615a51]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Publishing Section */}
            <div className="pt-4 border-t border-[#E8E6E1] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-[#968A7C]">
                {platform === 'instagram' ? (
                  instagramAccount.connected ? (
                    <span className="text-emerald-700 font-medium">Ready for Meta Graph 2-step media publishing</span>
                  ) : (
                    <span>Requires Meta Instagram account connection to publish live</span>
                  )
                ) : (
                  <span>Export copy to publish directly on {platform}</span>
                )}
              </div>

              {platform === 'instagram' && (
                <button
                  onClick={handlePublishToInstagram}
                  disabled={publishing}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-700 to-rose-600 text-white text-xs font-medium hover:opacity-95 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>{publishing ? 'Publishing via Meta...' : 'Publish to Instagram'}</span>
                </button>
              )}
            </div>

            {publishResult && (
              <div
                className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                  publishResult.success ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
                }`}
              >
                {publishResult.success ? <Check className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />}
                <p className="leading-relaxed">{publishResult.message}</p>
              </div>
            )}

          </div>

          {/* Saved Posts Library */}
          <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-5 space-y-3">
            <h3 className="font-serif text-base font-normal text-[#252525]">Saved Content Bank</h3>
            <div className="space-y-2">
              {savedPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setActiveDraft(post)}
                  className="p-3 rounded-xl bg-[#F4F2ED] border border-[#E8E6E1] hover:border-[#252525] transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-medium text-[#252525]">{post.title}</div>
                    <div className="text-[10px] text-[#968A7C] font-mono capitalize">
                      {post.platform} • {post.contentType} • {post.status}
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#968A7C]" />
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
