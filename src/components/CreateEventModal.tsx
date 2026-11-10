import React, { useState } from 'react';
import { EventData, EventCategory, LanguageCode } from '../types';
import { X, Calendar, MapPin, Tag, Plus, Check } from 'lucide-react';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (newEvent: Partial<EventData>) => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onCreateEvent,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<EventCategory>('music_festival');
  const [genre, setGenre] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [venueName, setVenueName] = useState('');
  const [startDate, setStartDate] = useState('2026-12-18T16:00');
  const [endDate, setEndDate] = useState('2026-12-20T23:30');
  const [description, setDescription] = useState('');
  const [basePriceInr, setBasePriceInr] = useState(1499);
  const [bookingUrl, setBookingUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreateEvent({
      name,
      category,
      genre: genre || 'Live Experience',
      city,
      state: 'Karnataka',
      venueName: venueName || 'Palace Grounds',
      address: `${venueName || 'Main Grounds'}, ${city}`,
      pincode: '560001',
      startDate,
      endDate,
      description: description || `Experience the premier ${category.replace('_', ' ')} in ${city}.`,
      targetAudience: 'Music & culture enthusiasts, urban professionals (18-35)',
      targetAgeGroup: '18 - 35',
      promotionalObjective: 'Drive presale ticket conversion and social virality',
      brandIdentity: 'Modern, elevated, design-forward experience',
      preferredLanguage: 'en',
      bookingUrl: bookingUrl || 'https://eventiq.app/events/new',
      ticketTiers: [
        {
          id: `tier-${Date.now()}`,
          name: 'Phase 1 Early Bird',
          priceInr: Number(basePriceInr),
          capacity: 1000,
          soldCount: 0,
          description: 'Full festival grounds access with commemorative badge',
        },
        {
          id: `tier-${Date.now() + 1}`,
          name: 'Royal VIP Pass',
          priceInr: Number(basePriceInr) * 3,
          capacity: 300,
          soldCount: 0,
          description: 'Fast-track gate entry, air-conditioned lounge, and dedicated bar',
          isVip: true,
        },
      ],
      presaleCode: 'EARLYIQ',
      presaleDiscountPercent: 15,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#E8E6E1] bg-[#F4F2ED] flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-normal text-[#252525]">Create New Event Brief</h3>
            <p className="text-xs text-[#968A7C]">Establishes the single context source powering the entire AI marketing engine</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#968A7C] hover:text-[#252525] hover:bg-[#FAF9F6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          <div className="space-y-1">
            <label className="font-medium text-[#615a51]">Event Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Horizon Sunset Festival 2026"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-medium text-[#615a51]">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as EventCategory)}
                className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525]"
              >
                <option value="music_festival">Music Festival</option>
                <option value="tech_conference">Tech Conference</option>
                <option value="cultural_fest">Cultural Fest</option>
                <option value="food_and_beverage">Food & Beverage</option>
                <option value="art_and_theater">Art & Theater</option>
                <option value="nightlife">Nightlife Experience</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-[#615a51]">Genre / Sub-theme</label>
              <input
                type="text"
                placeholder="e.g. Indie Rock, Deep House, AI"
                value={genre}
                onChange={e => setGenre(e.target.value)}
                className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-medium text-[#615a51]">Host City</label>
              <input
                type="text"
                placeholder="e.g. Bengaluru, Mumbai, Goa, Delhi"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-[#615a51]">Venue Name</label>
              <input
                type="text"
                placeholder="e.g. Jayamahal Palace Ground"
                value={venueName}
                onChange={e => setVenueName(e.target.value)}
                className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-medium text-[#615a51]">Start Date & Time (IST)</label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-[#615a51]">End Date & Time (IST)</label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-medium text-[#615a51]">Phase 1 Ticket Price (INR ₹)</label>
              <input
                type="number"
                value={basePriceInr}
                onChange={e => setBasePriceInr(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-[#615a51]">Ticketing Booking URL</label>
              <input
                type="url"
                placeholder="https://insider.in/..."
                value={bookingUrl}
                onChange={e => setBookingUrl(e.target.value)}
                className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-medium text-[#615a51]">Event Description & Concept</label>
            <textarea
              rows={3}
              placeholder="Provide a high-level briefing of artist curation, visual vibe, and highlights..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525]"
            />
          </div>

          {/* Footer Submit */}
          <div className="flex justify-end gap-2 pt-4 border-t border-[#E8E6E1]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#E8E6E1] text-xs font-medium text-[#615a51] hover:bg-[#F4F2ED]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#252525] text-[#FAF9F6] text-xs font-medium hover:bg-[#3a3530]"
            >
              Create & Initialize Platform
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
