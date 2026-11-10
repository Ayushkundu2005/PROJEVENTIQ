import React, { useState, useEffect } from 'react';
import { EventData, KnowledgeDocument, ConciergeMessage, LanguageCode } from '../types';
import {
  BotMessageSquare,
  Sparkles,
  Upload,
  FileText,
  Trash2,
  Send,
  Languages,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface AiConciergeProps {
  event: EventData;
}

export const AiConcierge: React.FC<AiConciergeProps> = ({ event }) => {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'knowledge_base'>('chat');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('en');

  // Chat conversation
  const [inputQuestion, setInputQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [messages, setMessages] = useState<ConciergeMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'concierge',
      text: `Hello! I am the verified AI Attendee Concierge for ${event.name} at ${event.venueName}, ${event.city}. I provide instant, grounded answers on gate timings, bag policies, parking, and ticket rules in English, Hindi, Tamil, or Telugu. How can I assist you today?`,
      language: 'en',
      confidenceScore: 98,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Document upload state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<'logistics' | 'schedule' | 'security' | 'ticketing' | 'vip' | 'general'>('security');
  const [docContent, setDocContent] = useState('');

  // Fetch verified knowledge docs
  useEffect(() => {
    fetch('/api/knowledge/documents')
      .then(r => r.json())
      .then(data => {
        if (data.documents) setDocuments(data.documents);
      })
      .catch(console.error);
  }, []);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuestion.trim() || isAsking) return;

    const userText = inputQuestion.trim();
    setInputQuestion('');

    const attendeeMsg: ConciergeMessage = {
      id: `msg-${Date.now()}`,
      sender: 'attendee',
      text: userText,
      language: selectedLanguage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, attendeeMsg]);
    setIsAsking(true);

    try {
      const res = await fetch('/api/ai/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userText,
          language: selectedLanguage,
          eventId: event.id,
        }),
      });

      const data = await res.json();

      const conciergeReply: ConciergeMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'concierge',
        text: data.answer || 'Information could not be processed.',
        language: data.language || selectedLanguage,
        confidenceScore: data.confidenceScore,
        sources: data.sources || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, conciergeReply]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'concierge',
          text: 'We encountered a connection issue reaching the knowledge engine. Please try again.',
          language: selectedLanguage,
          confidenceScore: 0,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  const handleUploadDocument = async () => {
    if (!docTitle || !docContent) return;

    try {
      const res = await fetch('/api/knowledge/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: docTitle,
          category: docCategory,
          content: docContent,
          sourceType: 'text',
        }),
      });

      const data = await res.json();
      if (data.document) {
        setDocuments([data.document, ...documents]);
        setShowUploadModal(false);
        setDocTitle('');
        setDocContent('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDoc = async (id: string) => {
    try {
      await fetch(`/api/knowledge/documents/${id}`, { method: 'DELETE' });
      setDocuments(documents.filter(d => d.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E6E1]">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#252525]">AI Concierge & Knowledge Hub</h1>
          <p className="text-xs text-[#968A7C] mt-1">
            Grounded attendee support assistant powered by indexed event rules, policies, and schedules with verifiable citations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-[#F4F2ED] p-1 rounded-xl border border-[#E8E6E1]">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'chat' ? 'bg-[#252525] text-[#FAF9F6]' : 'text-[#615a51]'
              }`}
            >
              Interactive Simulator
            </button>
            <button
              onClick={() => setActiveTab('knowledge_base')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'knowledge_base' ? 'bg-[#252525] text-[#FAF9F6]' : 'text-[#615a51]'
              }`}
            >
              Knowledge Vault ({documents.length})
            </button>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#252525] text-[#FAF9F6] text-xs font-medium hover:bg-[#3a3530] flex items-center gap-1.5 shadow-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Ingest Document</span>
          </button>
        </div>
      </div>

      {activeTab === 'chat' ? (
        /* Attendee Chat Simulator */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Language & Quick Prompts (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Multilingual Selector */}
            <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-medium text-[#252525]">
                <Languages className="w-4 h-4 text-[#968A7C]" />
                <span>Multilingual Support</span>
              </div>
              <p className="text-xs text-[#615a51]">
                Switch languages to simulate attendee queries in Indian regional languages:
              </p>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { code: 'en', label: 'English', native: 'English' },
                  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
                  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
                  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setSelectedLanguage(l.code as LanguageCode)}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      selectedLanguage === l.code
                        ? 'border-[#252525] bg-[#252525] text-[#FAF9F6]'
                        : 'border-[#E8E6E1] bg-[#F4F2ED] text-[#252525] hover:border-[#968A7C]'
                    }`}
                  >
                    <div className="text-xs font-medium">{l.label}</div>
                    <div className="text-[10px] opacity-75">{l.native}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Sample Questions */}
            <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-5 space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#968A7C] font-semibold">
                Test Ingested Policies
              </span>
              <div className="space-y-2">
                {[
                  'What is the bag policy and what size bag can I bring?',
                  'Can I park my four-wheeler at the venue and what is the fee?',
                  'What time do gates open on Friday and Saturday?',
                  'Are ticket cancellations or refunds allowed?',
                  'Where is the VIP entrance gate located?',
                ].map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputQuestion(q);
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-[#F4F2ED] border border-[#E8E6E1] text-xs text-[#252525] hover:border-[#252525] transition-all line-clamp-2"
                  >
                    "{q}"
                  </button>
                ))}
              </div>
            </div>

            {/* Trust & Hallucination Guard Indicator */}
            <div className="p-4 rounded-2xl bg-[#F4F2ED] border border-[#E8E6E1] space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-[#252525]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero Hallucination Guard</span>
              </div>
              <p className="text-[11px] text-[#615a51] leading-relaxed">
                The concierge is strictly constrained to the official knowledge base. If an unverified question is asked, it disclaims and directs the attendee to the physical Gate 1 help kiosk.
              </p>
            </div>

          </div>

          {/* Right Column: Interactive Chat Interface (8 cols) */}
          <div className="lg:col-span-8 bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl overflow-hidden shadow-xs flex flex-col h-[600px]">
            
            {/* Chat header */}
            <div className="p-4 border-b border-[#E8E6E1] bg-[#F4F2ED] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#252525] text-white flex items-center justify-center">
                  <BotMessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#252525]">
                    {event.name} • Official AI Concierge
                  </div>
                  <div className="text-[10px] text-[#968A7C]">
                    Grounding: {documents.length} ingested policy documents • Lang: {selectedLanguage.toUpperCase()}
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Live Knowledge Ingested
              </span>
            </div>

            {/* Message thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m) => {
                const isUser = m.sender === 'attendee';
                return (
                  <div key={m.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs space-y-2 shadow-xs ${
                        isUser
                          ? 'bg-[#252525] text-[#FAF9F6] rounded-tr-xs'
                          : 'bg-[#F4F2ED] text-[#252525] border border-[#E8E6E1] rounded-tl-xs'
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-line">{m.text}</p>

                      {/* Confidence & Citations Block */}
                      {!isUser && m.sources && m.sources.length > 0 && (
                        <div className="pt-2 border-t border-[#E8E6E1] space-y-1.5 mt-2">
                          <div className="flex items-center justify-between text-[10px] font-mono text-[#968A7C]">
                            <span className="flex items-center gap-1 font-semibold text-emerald-700">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Confidence: {m.confidenceScore}%
                            </span>
                            <span>{m.sources.length} Verified Sources</span>
                          </div>

                          <div className="space-y-1">
                            {m.sources.map((src, i) => (
                              <div key={i} className="text-[10px] text-[#615a51] bg-[#FAF9F6] p-2 rounded-lg border border-[#E8E6E1]">
                                <div className="font-semibold text-[#252525]">
                                  📄 {src.documentTitle} ({src.section})
                                </div>
                                <div className="italic text-[#968A7C] mt-0.5 font-mono line-clamp-2">
                                  "{src.excerpt}"
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-[#968A7C] font-mono mt-1 px-1">{m.timestamp}</span>
                  </div>
                );
              })}

              {isAsking && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-[#F4F2ED] border border-[#E8E6E1] w-fit text-xs text-[#968A7C]">
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-[#252525]" />
                  <span>Searching verified knowledge chunks & formulating grounded response...</span>
                </div>
              )}
            </div>

            {/* Query input footer */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-[#E8E6E1] bg-[#FAF9F6] flex gap-2">
              <input
                type="text"
                placeholder="Ask any attendee question (e.g. Can I re-enter after leaving? Where is VIP parking?)..."
                value={inputQuestion}
                onChange={e => setInputQuestion(e.target.value)}
                disabled={isAsking}
                className="flex-1 px-4 py-2.5 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525] focus:outline-none focus:ring-1 focus:ring-[#252525]"
              />
              <button
                type="submit"
                disabled={isAsking || !inputQuestion.trim()}
                className="px-4 py-2.5 rounded-xl bg-[#252525] text-[#FAF9F6] text-xs font-medium hover:bg-[#3a3530] disabled:opacity-40 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ask</span>
              </button>
            </form>

          </div>

        </div>
      ) : (
        /* Knowledge Vault Documents List */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-5 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#968A7C]" />
                      <span className="text-xs font-medium text-[#252525]">{doc.title}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteDoc(doc.id)}
                      className="p-1 text-[#968A7C] hover:text-red-600 transition-colors"
                      title="Delete document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#968A7C]">
                    <span className="uppercase bg-[#F4F2ED] px-2 py-0.5 rounded border border-[#E8E6E1]">
                      {doc.category}
                    </span>
                    <span>Uploaded: {doc.uploadDate}</span>
                  </div>

                  <p className="text-xs text-[#615a51] leading-relaxed line-clamp-4 whitespace-pre-line font-mono bg-[#F4F2ED] p-3 rounded-xl border border-[#E8E6E1]">
                    {doc.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Ingest New Document */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-xl">
            <h4 className="font-serif text-xl font-normal text-[#252525]">Ingest Event Guide or Policy</h4>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#615a51]">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. Artist Re-Entry & Backstage Pass Rules"
                  value={docTitle}
                  onChange={e => setDocTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#615a51]">Category</label>
                <select
                  value={docCategory}
                  onChange={e => setDocCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525]"
                >
                  <option value="security">Security & Bag Policy</option>
                  <option value="logistics">Logistics, Gates & Parking</option>
                  <option value="ticketing">Ticketing, Box Office & Refunds</option>
                  <option value="schedule">Artist Schedule & Set Times</option>
                  <option value="vip">VIP Amenities</option>
                  <option value="general">Medical, Wellness & General</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#615a51]">Document Text or Extracted PDF Content</label>
                <textarea
                  rows={8}
                  placeholder="Paste rules, timings, prohibited items, or FAQ text here. The system will automatically chunk, index, and cite this content."
                  value={docContent}
                  onChange={e => setDocContent(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525] font-mono leading-relaxed"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E6E1]">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 rounded-xl border border-[#E8E6E1] text-xs font-medium text-[#615a51] hover:bg-[#F4F2ED]"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadDocument}
                disabled={!docTitle || !docContent}
                className="px-4 py-2 rounded-xl bg-[#252525] text-[#FAF9F6] text-xs font-medium hover:bg-[#3a3530] disabled:opacity-50"
              >
                Ingest & Index
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
