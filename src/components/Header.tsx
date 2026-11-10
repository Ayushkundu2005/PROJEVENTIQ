import React, { useState, useRef, useEffect } from 'react';
import { EventData, ConnectedInstagramAccount, User } from '../types';
import {
  Sparkles,
  Calendar,
  Plus,
  Instagram,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  User as UserIcon,
  Check,
  X,
  Edit2,
  Building,
  Settings,
  ChevronDown
} from 'lucide-react';
import { formatINR } from '../utils/pricing';

interface HeaderProps {
  events: EventData[];
  selectedEvent: EventData | null;
  onSelectEvent: (event: EventData) => void;
  onOpenCreateEvent: () => void;
  instagramAccount: ConnectedInstagramAccount;
  onOpenInstagramModal: () => void;
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  events,
  selectedEvent,
  onSelectEvent,
  onOpenCreateEvent,
  instagramAccount,
  onOpenInstagramModal,
  user,
  onUpdateUser,
  onOpenSettings,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [tempName, setTempName] = useState(user.name);
  const [tempOrg, setTempOrg] = useState(user.organization);
  const [savedBadge, setSavedBadge] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync state if user prop changes externally
  useEffect(() => {
    setTempName(user.name);
    setTempOrg(user.organization);
  }, [user.name, user.organization]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmedName = tempName.trim() || 'Event Director';
    const trimmedOrg = tempOrg.trim() || 'EventIQ Productions';
    onUpdateUser({
      ...user,
      name: trimmedName,
      organization: trimmedOrg,
    });
    setSavedBadge(true);
    setTimeout(() => {
      setSavedBadge(false);
      setIsProfileOpen(false);
    }, 900);
  };

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

          {/* Interactive Customizable User Profile Badge */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2.5 pl-2 py-1 pr-2 rounded-xl border border-transparent hover:border-[#E8E6E1] hover:bg-[#F4F2ED] transition-all cursor-pointer group"
              title="Click to customize Organizer Name & Organization"
              aria-label="Customize Profile"
            >
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-[#E8E6E1] group-hover:ring-[#252525] transition-all"
              />
              <div className="hidden sm:flex flex-col text-left">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-[#252525] leading-tight group-hover:text-black">
                    {user.name}
                  </span>
                  <Edit2 className="w-2.5 h-2.5 text-[#968A7C] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-[10px] text-[#968A7C] leading-tight truncate max-w-[140px]">
                  {user.organization}
                </span>
              </div>
              <ChevronDown className={`w-3 h-3 text-[#968A7C] transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Customization Dropdown Popover */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl shadow-xl p-4 z-50 animate-fadeIn space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#E8E6E1]">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-[#968A7C]" />
                    <span className="font-serif text-sm font-semibold text-[#252525]">Edit Organizer Profile</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen(false)}
                    className="p-1 text-[#968A7C] hover:text-[#252525] rounded-lg hover:bg-[#E8E6E1]"
                    aria-label="Close"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-medium text-[#615a51] mb-1">
                      Your Name / Display Name
                    </label>
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      placeholder="e.g. Your Name or Event Director"
                      className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525] focus:outline-none focus:ring-1 focus:ring-[#252525]"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#615a51] mb-1">
                      Organization / Agency / College
                    </label>
                    <input
                      type="text"
                      value={tempOrg}
                      onChange={(e) => setTempOrg(e.target.value)}
                      placeholder="e.g. Acme Productions or Event Team"
                      className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525] focus:outline-none focus:ring-1 focus:ring-[#252525]"
                    />
                  </div>

                  {/* Preset Quick Chips */}
                  <div>
                    <span className="text-[10px] text-[#968A7C] uppercase tracking-wider block mb-1">Quick Presets</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['Event Director', 'Lead Organizer', 'Marketing Team'].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setTempName(preset)}
                          className="px-2 py-0.5 rounded-md bg-[#F4F2ED] hover:bg-[#E8E6E1] text-[10px] text-[#615a51] border border-[#E8E6E1] transition-colors"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-[#E8E6E1]">
                    {onOpenSettings && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          onOpenSettings();
                        }}
                        className="text-[11px] text-[#968A7C] hover:text-[#252525] flex items-center gap-1"
                      >
                        <Settings className="w-3 h-3" />
                        Full Settings
                      </button>
                    )}
                    <button
                      type="submit"
                      className="ml-auto px-3.5 py-1.5 bg-[#252525] hover:bg-[#3a3530] text-[#FAF9F6] rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      {savedBadge ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Saved!</span>
                        </>
                      ) : (
                        <span>Save Profile</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
