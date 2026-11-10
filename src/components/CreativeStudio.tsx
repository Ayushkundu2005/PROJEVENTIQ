import React, { useState, useRef } from 'react';
import { EventData, CreativeFormat, AestheticTheme, CreativeAsset } from '../types';
import { formatINR } from '../utils/pricing';
import {
  Palette,
  Download,
  Sparkles,
  Layers,
  RefreshCw,
  Sliders,
  Type,
  Square,
  Smartphone,
  FileImage,
  CreditCard,
  Check,
  Share2,
} from 'lucide-react';

interface CreativeStudioProps {
  event: EventData;
  onSaveAsset?: (asset: CreativeAsset) => void;
}

export const CreativeStudio: React.FC<CreativeStudioProps> = ({ event, onSaveAsset }) => {
  const [selectedFormat, setSelectedFormat] = useState<CreativeFormat>('social_post');
  const [selectedTheme, setSelectedTheme] = useState<AestheticTheme>('editorial_swiss');

  // Editable canvas fields
  const [headline, setHeadline] = useState(event.name.toUpperCase());
  const [subheadline, setSubheadline] = useState(`${event.genre} • LIVE IN ${event.city.toUpperCase()}`);
  const [dateVenueText, setDateVenueText] = useState(
    `${new Date(event.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} — ${event.venueName}`
  );
  const [ticketPriceText, setTicketPriceText] = useState(
    `PASSES FROM ${formatINR(event.ticketTiers[0]?.priceInr || 999)}`
  );
  const [ctaText, setCtaText] = useState(`BOOK ON ${new Date().getFullYear()} • LIMITED ALLOCATION`);
  const [accentColor, setAccentColor] = useState('#B2533E');
  const [isExporting, setIsExporting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync default text when event changes
  React.useEffect(() => {
    setHeadline(event.name.toUpperCase());
    setSubheadline(`${event.genre} • LIVE IN ${event.city.toUpperCase()}`);
    setDateVenueText(
      `${new Date(event.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} — ${event.venueName}`
    );
    setTicketPriceText(`PASSES FROM ${formatINR(event.ticketTiers[0]?.priceInr || 999)}`);
  }, [event.id]);

  // Formats definition
  const formats: Array<{ id: CreativeFormat; label: string; aspect: string; icon: any; width: number; height: number }> = [
    { id: 'social_post', label: 'Social Post', aspect: '1:1 Square', icon: Square, width: 600, height: 600 },
    { id: 'story_vertical', label: 'Vertical Story', aspect: '9:16 Vertical', icon: Smartphone, width: 450, height: 800 },
    { id: 'event_poster', label: 'Event Poster', aspect: '4:5 Portrait', icon: FileImage, width: 480, height: 600 },
    { id: 'web_banner', label: 'Web Banner', aspect: '16:9 Landscape', icon: Layers, width: 800, height: 450 },
    { id: 'vip_pass', label: 'VIP Pass', aspect: '2:1 Credential', icon: CreditCard, width: 700, height: 350 },
  ];

  // Aesthetic Themes definition
  const themes: Array<{ id: AestheticTheme; name: string; bg: string; text: string; accent: string; font: string; desc: string }> = [
    {
      id: 'editorial_swiss',
      name: 'Editorial Swiss',
      bg: '#F4F2ED',
      text: '#252525',
      accent: '#B2533E',
      font: 'font-sans font-black tracking-tight',
      desc: 'Asymmetrical typographic grids & Swiss brutalist restraint',
    },
    {
      id: 'minimal_monochrome',
      name: 'Minimal Monochrome',
      bg: '#181818',
      text: '#FAF9F6',
      accent: '#968A7C',
      font: 'font-serif font-light tracking-wide',
      desc: 'Stark black-and-white elegance with hairline dividers',
    },
    {
      id: 'neon_underground',
      name: 'Neon Underground',
      bg: '#0F0F12',
      text: '#00F0FF',
      accent: '#FF0055',
      font: 'font-mono font-bold tracking-widest',
      desc: 'High-voltage cyberpunk nightlife with electric glows',
    },
    {
      id: 'luxury_black_gold',
      name: 'Luxury Black & Gold',
      bg: '#11100F',
      text: '#E5C07B',
      accent: '#D4AF37',
      font: 'font-serif italic font-medium',
      desc: 'Opulent obsidian and regal gilded metallic typography',
    },
    {
      id: 'warm_contemporary',
      name: 'Warm Contemporary',
      bg: '#FAF9F6',
      text: '#3D352E',
      accent: '#8C5E48',
      font: 'font-sans font-semibold tracking-normal',
      desc: 'Terracotta, warm taupe, and organic bohemian warmth',
    },
    {
      id: 'retro_futuristic',
      name: 'Retro Futuristic',
      bg: '#1B1429',
      text: '#FDE24F',
      accent: '#FF4181',
      font: 'font-mono uppercase font-black',
      desc: 'Analog synthwave neon typography with 80s concert grids',
    },
    {
      id: 'elegant_classical',
      name: 'Elegant Classical',
      bg: '#202421',
      text: '#F5F5F0',
      accent: '#9EA896',
      font: 'font-serif font-normal tracking-wider',
      desc: 'Fine heritage framing with regal editorial hierarchy',
    },
    {
      id: 'festival_energy',
      name: 'Festival Energy',
      bg: '#FFFCF0',
      text: '#1C1917',
      accent: '#E11D48',
      font: 'font-sans font-extrabold uppercase',
      desc: 'High-impact diagonal banners and vibrant festival energy',
    },
  ];

  const currentThemeObj = themes.find(t => t.id === selectedTheme) || themes[0];
  const currentFormatObj = formats.find(f => f.id === selectedFormat) || formats[0];

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Export creative as SVG or PNG
  const handleExport = (format: 'png' | 'svg') => {
    if (!svgRef.current) return;
    setIsExporting(true);

    try {
      const svgElement = svgRef.current;
      const svgString = new XMLSerializer().serializeToString(svgElement);

      if (format === 'svg') {
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `eventiq-${event.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${selectedFormat}.svg`;
        a.click();
        URL.revokeObjectURL(url);
        setIsExporting(false);
        return;
      }

      // Convert SVG to PNG via offscreen Canvas
      const img = new Image();
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const URLObj = window.URL || window.webkitURL || window;
      const blobURL = URLObj.createObjectURL(svgBlob);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = currentFormatObj.width * 2; // High-res 2x
        canvas.height = currentFormatObj.height * 2;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const pngUrl = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = pngUrl;
          a.download = `eventiq-${event.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${selectedFormat}.png`;
          a.click();
        }
        URLObj.revokeObjectURL(blobURL);
        setIsExporting(false);
      };
      img.src = blobURL;
    } catch (e) {
      console.error('Export error:', e);
      setIsExporting(false);
    }
  };

  const handleSaveAsset = () => {
    if (onSaveAsset) {
      onSaveAsset({
        id: `ast-${Date.now()}`,
        eventId: event.id,
        title: `${event.name} - ${selectedFormat} (${currentThemeObj.name})`,
        format: selectedFormat,
        theme: selectedTheme,
        headline,
        subheadline,
        eventDate: dateVenueText,
        venueText: event.venueName,
        ticketText: ticketPriceText,
        ctaText,
        accentColor,
        bgColor: currentThemeObj.bg,
        textColor: currentThemeObj.text,
        createdAt: new Date().toISOString(),
      });
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E6E1]">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#252525]">Post & Creative Studio</h1>
          <p className="text-xs text-[#968A7C] mt-1">
            Produce print-ready and multi-format promotional creatives across 5 dimensions and 8 aesthetic identities
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveAsset}
            className="px-3.5 py-2 rounded-xl border border-[#E8E6E1] text-xs font-medium text-[#252525] hover:bg-[#F4F2ED] flex items-center gap-1.5"
          >
            {savedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Sparkles className="w-3.5 h-3.5 text-[#968A7C]" />}
            <span>{savedSuccess ? 'Saved to Vault' : 'Save Asset'}</span>
          </button>
          <div className="relative inline-flex rounded-xl shadow-xs">
            <button
              onClick={() => handleExport('png')}
              disabled={isExporting}
              className="px-3.5 py-2 rounded-l-xl bg-[#252525] text-[#FAF9F6] text-xs font-medium hover:bg-[#3a3530] flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Exporting...' : 'Export PNG'}</span>
            </button>
            <button
              onClick={() => handleExport('svg')}
              title="Download vector SVG"
              className="px-2.5 py-2 rounded-r-xl bg-[#3a3530] text-[#FAF9F6] text-xs font-medium hover:bg-[#252525] border-l border-white/10"
            >
              SVG
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Toolbar: Formats, Themes & Typography Controls (4 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Step 1: Creative Formats */}
          <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-5 space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#968A7C] font-semibold">
              1. Creative Dimensions
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {formats.map((f) => {
                const Icon = f.icon;
                const isSelected = selectedFormat === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFormat(f.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#252525] bg-[#252525] text-[#FAF9F6]'
                        : 'border-[#E8E6E1] bg-[#F4F2ED] text-[#615a51] hover:border-[#968A7C]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-2 ${isSelected ? 'text-[#FAF9F6]' : 'text-[#968A7C]'}`} />
                    <div>
                      <div className="text-xs font-medium leading-tight">{f.label}</div>
                      <div className={`text-[9px] mt-0.5 font-mono ${isSelected ? 'text-white/70' : 'text-[#968A7C]'}`}>
                        {f.aspect}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Aesthetic Themes */}
          <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-5 space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#968A7C] font-semibold">
              2. Aesthetic Identity (8 Styles)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {themes.map((th) => {
                const isSelected = selectedTheme === th.id;
                return (
                  <button
                    key={th.id}
                    onClick={() => {
                      setSelectedTheme(th.id);
                      setAccentColor(th.accent);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#252525] bg-[#F4F2ED] ring-1 ring-[#252525]'
                        : 'border-[#E8E6E1] hover:border-[#968A7C] bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[#252525]">{th.name}</span>
                      <div className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full border border-black/10" style={{ backgroundColor: th.bg }} />
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: th.accent }} />
                      </div>
                    </div>
                    <p className="text-[10px] text-[#968A7C] mt-1 line-clamp-1">{th.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Typography & Copy Overrides */}
          <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-5 space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#968A7C] font-semibold">
              3. Live Content Elements
            </span>

            <div className="space-y-2.5">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[#615a51]">Headline / Event Title</label>
                <input
                  type="text"
                  value={headline}
                  onChange={e => setHeadline(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#F4F2ED] border border-[#E8E6E1] rounded-lg text-xs text-[#252525]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[#615a51]">Sub-Header / Genre</label>
                <input
                  type="text"
                  value={subheadline}
                  onChange={e => setSubheadline(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#F4F2ED] border border-[#E8E6E1] rounded-lg text-xs text-[#252525]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[#615a51]">Date & Venue</label>
                <input
                  type="text"
                  value={dateVenueText}
                  onChange={e => setDateVenueText(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#F4F2ED] border border-[#E8E6E1] rounded-lg text-xs text-[#252525]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-[#615a51]">Ticket Price</label>
                  <input
                    type="text"
                    value={ticketPriceText}
                    onChange={e => setTicketPriceText(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#F4F2ED] border border-[#E8E6E1] rounded-lg text-xs text-[#252525]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-[#615a51]">Call to Action</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={e => setCtaText(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#F4F2ED] border border-[#E8E6E1] rounded-lg text-xs text-[#252525]"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Canvas: Live SVG Renderer (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-[#F4F2ED] border border-[#E8E6E1] rounded-3xl p-6 sm:p-10 min-h-[620px] relative overflow-hidden">
          <div className="text-center mb-4">
            <span className="text-[11px] font-mono text-[#968A7C]">
              Interactive Artboard • {currentFormatObj.label} ({currentFormatObj.aspect}) — {currentThemeObj.name}
            </span>
          </div>

          {/* SVG Artboard Rendered Dynamically */}
          <div className="shadow-2xl rounded-xl overflow-hidden max-w-full transition-all">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${currentFormatObj.width} ${currentFormatObj.height}`}
              width={currentFormatObj.width}
              height={currentFormatObj.height}
              className="max-h-[500px] w-auto transition-all"
              style={{
                backgroundColor: currentThemeObj.bg,
                fontFamily: selectedTheme.includes('editorial') || selectedTheme.includes('minimal') ? "'Inter', sans-serif" : "'Cormorant Garamond', Georgia, serif",
              }}
            >
              {/* Background Accent Gradients / Geometric Shapes */}
              {selectedTheme === 'editorial_swiss' && (
                <>
                  <rect x="0" y="0" width={currentFormatObj.width} height={currentFormatObj.height} fill="#F4F2ED" />
                  <line x1="40" y1="40" x2={currentFormatObj.width - 40} y2="40" stroke="#252525" strokeWidth="2" />
                  <line x1="40" y1="40" x2="40" y2={currentFormatObj.height - 40} stroke="#252525" strokeWidth="2" />
                  <rect x="40" y="40" width="12" height="12" fill={accentColor} />
                  <circle cx={currentFormatObj.width - 90} cy="140" r="45" fill={accentColor} opacity="0.9" />
                </>
              )}

              {selectedTheme === 'minimal_monochrome' && (
                <>
                  <rect x="0" y="0" width={currentFormatObj.width} height={currentFormatObj.height} fill="#181818" />
                  <rect x="30" y="30" width={currentFormatObj.width - 60} height={currentFormatObj.height - 60} fill="none" stroke="#FAF9F6" strokeWidth="1" strokeDasharray="4 4" />
                </>
              )}

              {selectedTheme === 'neon_underground' && (
                <>
                  <rect x="0" y="0" width={currentFormatObj.width} height={currentFormatObj.height} fill="#0F0F12" />
                  <circle cx={currentFormatObj.width / 2} cy={currentFormatObj.height / 2} r="180" fill="none" stroke="#00F0FF" strokeWidth="2" opacity="0.3" />
                  <line x1="0" y1={currentFormatObj.height - 120} x2={currentFormatObj.width} y2={currentFormatObj.height - 120} stroke="#FF0055" strokeWidth="3" />
                </>
              )}

              {selectedTheme === 'luxury_black_gold' && (
                <>
                  <rect x="0" y="0" width={currentFormatObj.width} height={currentFormatObj.height} fill="#11100F" />
                  <rect x="25" y="25" width={currentFormatObj.width - 50} height={currentFormatObj.height - 50} fill="none" stroke="#D4AF37" strokeWidth="1.5" />
                  <rect x="32" y="32" width={currentFormatObj.width - 64} height={currentFormatObj.height - 64} fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.6" />
                </>
              )}

              {selectedTheme === 'warm_contemporary' && (
                <>
                  <rect x="0" y="0" width={currentFormatObj.width} height={currentFormatObj.height} fill="#FAF9F6" />
                  <circle cx="100" cy="100" r="140" fill="#EADBC8" opacity="0.5" />
                  <circle cx={currentFormatObj.width - 80} cy={currentFormatObj.height - 80} r="120" fill="#DBC4F0" opacity="0.3" />
                </>
              )}

              {selectedTheme === 'festival_energy' && (
                <>
                  <rect x="0" y="0" width={currentFormatObj.width} height={currentFormatObj.height} fill="#FFFCF0" />
                  <polygon points={`0,0 ${currentFormatObj.width},0 ${currentFormatObj.width},80 0,140`} fill="#E11D48" />
                  <polygon points={`0,${currentFormatObj.height - 100} ${currentFormatObj.width},${currentFormatObj.height - 160} ${currentFormatObj.width},${currentFormatObj.height} 0,${currentFormatObj.height}`} fill="#252525" />
                </>
              )}

              {selectedFormat === 'vip_pass' ? (
                <>
                  {/* VIP Pass Specimen Details */}
                  <rect x="40" y="40" width={currentFormatObj.width - 80} height={currentFormatObj.height - 80} rx="16" fill="#1C1917" stroke="#D4AF37" strokeWidth="2" />
                  <text x="80" y="90" fill="#D4AF37" fontSize="16" letterSpacing="3" fontWeight="bold" fontFamily="sans-serif">
                    ★ OFFICIAL ACCESS CREDENTIAL
                  </text>
                  <text x="80" y="140" fill="#FAF9F6" fontSize="28" fontWeight="bold" fontFamily="serif">
                    {headline}
                  </text>
                  <text x="80" y="175" fill="#E8E6E1" fontSize="14" letterSpacing="1" fontFamily="sans-serif">
                    {dateVenueText}
                  </text>
                  <line x1="80" y1="210" x2={currentFormatObj.width - 80} y2="210" stroke="#44403C" strokeWidth="1" strokeDasharray="6 6" />
                  <text x="80" y="250" fill="#A8A29E" fontSize="12" fontFamily="monospace">
                    TIER: ROYAL VIP ALL-ACCESS • SEC 01 • PASS #9420
                  </text>
                  <text x="80" y="280" fill="#D4AF37" fontSize="14" fontWeight="bold" fontFamily="monospace">
                    FAST TRACK ENTRY VIA GATE 3
                  </text>

                  {/* Simulated barcode */}
                  <g transform={`translate(${currentFormatObj.width - 200}, 90)`}>
                    <rect x="0" y="0" width="120" height="70" fill="#FAF9F6" rx="4" />
                    <line x1="15" y1="10" x2="15" y2="60" stroke="#000" strokeWidth="2" />
                    <line x1="22" y1="10" x2="22" y2="60" stroke="#000" strokeWidth="4" />
                    <line x1="32" y1="10" x2="32" y2="60" stroke="#000" strokeWidth="1" />
                    <line x1="40" y1="10" x2="40" y2="60" stroke="#000" strokeWidth="3" />
                    <line x1="50" y1="10" x2="50" y2="60" stroke="#000" strokeWidth="5" />
                    <line x1="65" y1="10" x2="65" y2="60" stroke="#000" strokeWidth="2" />
                    <line x1="75" y1="10" x2="75" y2="60" stroke="#000" strokeWidth="3" />
                    <line x1="85" y1="10" x2="85" y2="60" stroke="#000" strokeWidth="4" />
                    <line x1="95" y1="10" x2="95" y2="60" stroke="#000" strokeWidth="1" />
                    <line x1="105" y1="10" x2="105" y2="60" stroke="#000" strokeWidth="2" />
                  </g>
                </>
              ) : (
                <>
                  {/* Brand & EventIQ Watermark Tag */}
                  <text
                    x="50"
                    y="70"
                    fill={selectedTheme === 'festival_energy' ? '#FAF9F6' : currentThemeObj.text}
                    fontSize="11"
                    fontWeight="600"
                    letterSpacing="4"
                    fontFamily="sans-serif"
                    opacity="0.85"
                  >
                    EVENTIQ PRESENTATION • {event.city.toUpperCase()}
                  </text>

                  {/* Main Event Headline */}
                  <text
                    x="50"
                    y={currentFormatObj.height > 600 ? "260" : "190"}
                    fill={currentThemeObj.text}
                    fontSize={currentFormatObj.width > 650 ? "38" : "30"}
                    fontWeight="800"
                    letterSpacing={selectedTheme === 'neon_underground' ? '3' : '-0.5'}
                  >
                    {headline}
                  </text>

                  {/* Subheadline & Genre */}
                  <text
                    x="50"
                    y={currentFormatObj.height > 600 ? "310" : "235"}
                    fill={accentColor}
                    fontSize="15"
                    fontWeight="600"
                    letterSpacing="2"
                    fontFamily="sans-serif"
                  >
                    {subheadline}
                  </text>

                  {/* Date & Venue Bar */}
                  <text
                    x="50"
                    y={currentFormatObj.height > 600 ? "370" : "285"}
                    fill={currentThemeObj.text}
                    fontSize="18"
                    fontWeight="500"
                    letterSpacing="0.5"
                  >
                    {dateVenueText}
                  </text>

                  {/* Ticket Tier Pricing Callout */}
                  <rect
                    x="50"
                    y={currentFormatObj.height - 130}
                    width="230"
                    height="45"
                    rx="8"
                    fill={accentColor}
                  />
                  <text
                    x="65"
                    y={currentFormatObj.height - 102}
                    fill="#FAF9F6"
                    fontSize="12"
                    fontWeight="bold"
                    letterSpacing="1"
                    fontFamily="sans-serif"
                  >
                    {ticketPriceText}
                  </text>

                  {/* Call to action footer */}
                  <text
                    x="50"
                    y={currentFormatObj.height - 55}
                    fill={currentThemeObj.text}
                    fontSize="11"
                    fontWeight="500"
                    letterSpacing="2"
                    opacity="0.8"
                    fontFamily="sans-serif"
                  >
                    {ctaText}
                  </text>
                </>
              )}
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
};
