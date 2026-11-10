import React from 'react';
import { EventData, ConnectedInstagramAccount, User } from '../types';
import { Sparkles, Calendar, Plus, Instagram, ShieldCheck, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { formatINR } from '../utils/pricing';

interface HeaderProps {
  events: EventData[];
  selectedEvent: EventData | null;
  onSelectEvent: (event: EventData) => void;
  onOpenCreateEvent: () => void;
  instagramAccount: ConnectedInstagramAccount;
  onOpenInstagramModal: () => void;
  user: User;
}

export const Header: React.FC<HeaderProps> = ({
  events,
  selectedEvent,
  onSelectEvent,
  onOpenCreateEvent,
  instagramAccount,
  onOpenInstagramModal,
  user,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-[#E8E6E1] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Brand identity */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 rounded-lg bg-[#252525] flex items-center justify-center text-[#FAF9F6] shadow-sm">
              <span className="font-serif italic font-bold text-xl tracking-tight">E</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-semibold tracking-tight text-[#252525]">
                Event<span className="text-[#968A7C]">IQ</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase font-mono text-[#968A7C] -mt-1 font-medium">
                SaaS Marketing Platform
              </span>
            </div>
          </div>

          <div className="hidden md:block h-6 w-[1px] bg-[#E8E6E1]" />

          {/* Global Event Selector */}
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-xs text-[#968A7C] font-medium uppercase tracking-wider">Active Event:</span>
            <div className="relative">
              <select
                value={selectedEvent?.id || ''}
                aria-label="Active Event Selection"
                onChange={(e) => {
                  const ev = events.find(x => x.id === e.target.value);
                  if (ev) onSelectEvent(ev);
                }}
                className="bg-[#F4F2ED] hover:bg-[#E8E6E1]/70 transition-colors border border-[#E8E6E1] rounded-lg px-3 py-1.5 text-xs font-medium text-[#252525] focus:outline-none focus:ring-1 focus:ring-[#252525] cursor-pointer max-w-xs truncate"
              >
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.name} ({ev.city})
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={onOpenCreateEvent}
              className="p-1.5 rounded-lg border border-dashed border-[#968A7C]/50 hover:border-[#252525] hover:bg-[#F4F2ED] transition-colors text-[#968A7C] hover:text-[#252525]"
              title="Create new event"
              aria-label="Create new event"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-3">
          
          {/* Prominent Genuine Instagram OAuth Connection Button */}
          <button
            onClick={onOpenInstagramModal}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shadow-sm ${
              instagramAccount.connected
                ? 'bg-[#F4F2ED] text-[#252525] border border-[#968A7C]/40 hover:bg-[#E8E6E1]'
                : 'bg-gradient-to-r from-[#252525] to-[#3a3530] text-[#FAF9F6] hover:opacity-95'
            }`}
            title="Manage genuine Meta Instagram Connection"
            aria-label="Connect Instagram"
          >
            <Instagram className={`w-3.5 h-3.5 ${instagramAccount.connected ? 'text-pink-600' : 'text-pink-300'}`} />
            {instagramAccount.connected ? (
              <span className="flex items-center gap-1.5">
                <span className="truncate max-w-[110px]">@{instagramAccount.username}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </span>
            ) : (
              <span className="flex items-center gap-1">
                Connect Instagram
                <ArrowUpRight className="w-3 h-3 opacity-70" />
              </span>
            )}
          </button>

          {/* User profile avatar badge */}
          <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-[#E8E6E1]">
            <img
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-[#E8E6E1]"
            />
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-medium text-[#252525] leading-tight">{user.name}</span>
              <span className="text-[10px] text-[#968A7C] leading-tight">{user.organization}</span>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
