import React, { useState } from 'react';
import { EventData, EventCategory, TicketCategory, LanguageCode } from '../types';
import { formatINR } from '../utils/pricing';
import {
  Calendar,
  MapPin,
  Ticket,
  Plus,
  Trash2,
  Copy,
  Edit2,
  Save,
  Check,
  Globe,
  Share2,
  Tag,
  AlertCircle,
  Clock,
} from 'lucide-react';

interface EventManagementProps {
  events: EventData[];
  selectedEvent: EventData;
  onSelectEvent: (event: EventData) => void;
  onSaveEvent: (event: EventData) => void;
  onCreateEvent: (event: Partial<EventData>) => void;
  onDuplicateEvent: (eventId: string) => void;
  onDeleteEvent: (eventId: string) => void;
}

export const EventManagement: React.FC<EventManagementProps> = ({
  events,
  selectedEvent,
  onSelectEvent,
  onSaveEvent,
  onCreateEvent,
  onDuplicateEvent,
  onDeleteEvent,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<EventData>(selectedEvent);
  const [showNewTierModal, setShowNewTierModal] = useState(false);
  const [newTier, setNewTier] = useState<Partial<TicketCategory>>({
    name: '',
    priceInr: 999,
    capacity: 500,
    soldCount: 0,
    description: '',
    isVip: false,
  });

  // Sync formData when selectedEvent changes externally
  React.useEffect(() => {
    setFormData(selectedEvent);
    setIsEditing(false);
  }, [selectedEvent.id]);

  const handleSave = () => {
    onSaveEvent(formData);
    setIsEditing(false);
  };

  const handleAddTier = () => {
    if (!newTier.name || !newTier.priceInr) return;
    const tier: TicketCategory = {
      id: `tier-${Date.now()}`,
      name: newTier.name,
      priceInr: Number(newTier.priceInr),
      capacity: Number(newTier.capacity || 500),
      soldCount: 0,
      description: newTier.description || '',
      isVip: !!newTier.isVip,
    };
    setFormData({
      ...formData,
      ticketTiers: [...formData.ticketTiers, tier],
    });
    setNewTier({ name: '', priceInr: 999, capacity: 500, soldCount: 0, description: '', isVip: false });
    setShowNewTierModal(false);
  };

  const handleRemoveTier = (tierId: string) => {
    setFormData({
      ...formData,
      ticketTiers: formData.ticketTiers.filter(t => t.id !== tierId),
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header and Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E6E1]">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#252525]">Event Management</h1>
          <p className="text-xs text-[#968A7C] mt-1">
            Single source of event truth powering AI content generation, campaigns, SEO, and attendee concierge
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setFormData(selectedEvent);
                  setIsEditing(false);
                }}
                className="px-4 py-2 rounded-xl border border-[#E8E6E1] text-xs font-medium text-[#615a51] hover:bg-[#F4F2ED]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-[#252525] text-[#FAF9F6] text-xs font-medium hover:bg-[#3a3530] flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onDuplicateEvent(selectedEvent.id)}
                className="px-3.5 py-2 rounded-xl border border-[#E8E6E1] text-xs font-medium text-[#252525] hover:bg-[#F4F2ED] flex items-center gap-1.5"
                title="Duplicate event"
              >
                <Copy className="w-3.5 h-3.5 text-[#968A7C]" />
                <span>Duplicate</span>
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-xl bg-[#252525] text-[#FAF9F6] text-xs font-medium hover:bg-[#3a3530] flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Event Details</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Core Event Specification */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card: Core Information */}
          <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-6 space-y-5">
            <h3 className="font-serif text-lg font-medium text-[#252525] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#968A7C]" />
              <span>Core Event Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-medium text-[#615a51]">Event Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-sm text-[#252525] focus:outline-none focus:ring-1 focus:ring-[#252525]"
                  />
                ) : (
                  <div className="text-base font-serif font-medium text-[#252525]">{selectedEvent.name}</div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#615a51]">Category</label>
                {isEditing ? (
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as EventCategory })}
                    className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525] focus:outline-none focus:ring-1 focus:ring-[#252525]"
                  >
                    <option value="music_festival">Music Festival</option>
                    <option value="tech_conference">Tech Conference</option>
                    <option value="cultural_fest">Cultural Fest</option>
                    <option value="food_and_beverage">Food & Beverage</option>
                    <option value="art_and_theater">Art & Theater</option>
                    <option value="sports_and_fitness">Sports & Fitness</option>
                    <option value="nightlife">Nightlife</option>
                    <option value="business_summit">Business Summit</option>
                  </select>
                ) : (
                  <div className="text-xs text-[#252525] font-mono capitalize">
                    {selectedEvent.category.replace('_', ' ')}
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#615a51]">Genre / Sub-Theme</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.genre}
                    onChange={e => setFormData({ ...formData, genre: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525] focus:outline-none focus:ring-1 focus:ring-[#252525]"
                  />
                ) : (
                  <div className="text-xs text-[#252525]">{selectedEvent.genre}</div>
                )}
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-medium text-[#615a51]">Event Description & Brief</label>
                {isEditing ? (
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525] focus:outline-none focus:ring-1 focus:ring-[#252525] leading-relaxed"
                  />
                ) : (
                  <p className="text-xs text-[#615a51] leading-relaxed whitespace-pre-line">
                    {selectedEvent.description}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#615a51]">Start Date & Time (IST)</label>
                {isEditing ? (
                  <input
                    type="datetime-local"
                    value={formData.startDate.substring(0, 16)}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525] focus:outline-none focus:ring-1 focus:ring-[#252525]"
                  />
                ) : (
                  <div className="text-xs text-[#252525] font-mono">
                    {new Date(selectedEvent.startDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#615a51]">End Date & Time (IST)</label>
                {isEditing ? (
                  <input
                    type="datetime-local"
                    value={formData.endDate.substring(0, 16)}
                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525] focus:outline-none focus:ring-1 focus:ring-[#252525]"
                  />
                ) : (
                  <div className="text-xs text-[#252525] font-mono">
                    {new Date(selectedEvent.endDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card: Venue & Location */}
          <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-6 space-y-5">
            <h3 className="font-serif text-lg font-medium text-[#252525] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#968A7C]" />
              <span>Location, Venue & Logistics</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#615a51]">Venue Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.venueName}
                    onChange={e => setFormData({ ...formData, venueName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525]"
                  />
                ) : (
                  <div className="text-xs font-medium text-[#252525]">{selectedEvent.venueName}</div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#615a51]">City & State</label>
                {isEditing ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="City"
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      className="w-1/2 px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525]"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={formData.state}
                      onChange={e => setFormData({ ...formData, state: e.target.value })}
                      className="w-1/2 px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525]"
                    />
                  </div>
                ) : (
                  <div className="text-xs text-[#252525]">{selectedEvent.city}, {selectedEvent.state}</div>
                )}
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-medium text-[#615a51]">Street Address & PIN Code</label>
                {isEditing ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      className="w-3/4 px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525]"
                    />
                    <input
                      type="text"
                      placeholder="PIN Code"
                      value={formData.pincode}
                      onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-1/4 px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525]"
                    />
                  </div>
                ) : (
                  <div className="text-xs text-[#615a51]">{selectedEvent.address} — PIN {selectedEvent.pincode}</div>
                )}
              </div>
            </div>
          </div>

          {/* Card: Ticket Tiers & INR Pricing */}
          <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-medium text-[#252525] flex items-center gap-2">
                <Ticket className="w-4 h-4 text-[#968A7C]" />
                <span>Ticket Categories & Pricing (INR ₹)</span>
              </h3>
              {isEditing && (
                <button
                  onClick={() => setShowNewTierModal(true)}
                  className="px-3 py-1.5 rounded-lg border border-[#252525] text-xs font-medium text-[#252525] hover:bg-[#252525] hover:text-[#FAF9F6] transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Tier</span>
                </button>
              )}
            </div>

            <div className="space-y-3">
              {(isEditing ? formData.ticketTiers : selectedEvent.ticketTiers).map((tier) => (
                <div
                  key={tier.id}
                  className="p-3.5 rounded-xl bg-[#F4F2ED] border border-[#E8E6E1] flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-[#252525]">{tier.name}</span>
                      {tier.isVip && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">
                          VIP
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#615a51]">{tier.description}</p>
                    <div className="text-[11px] text-[#968A7C] font-mono">
                      Capacity: {tier.capacity.toLocaleString()} | Sold: {tier.soldCount.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-serif font-semibold text-[#252525]">
                        {formatINR(tier.priceInr)}
                      </div>
                      <div className="text-[10px] text-[#968A7C]">Incl. 18% GST</div>
                    </div>

                    {isEditing && (
                      <button
                        onClick={() => handleRemoveTier(tier.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete tier"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Col: Brand Identity, Presale & Marketing Targets */}
        <div className="space-y-6">
          
          {/* Card: Brand & Language */}
          <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-6 space-y-4">
            <h3 className="font-serif text-lg font-medium text-[#252525] flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#968A7C]" />
              <span>Target & Tone</span>
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#615a51]">Target Audience</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.targetAudience}
                    onChange={e => setFormData({ ...formData, targetAudience: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525]"
                  />
                ) : (
                  <div className="text-xs text-[#252525]">{selectedEvent.targetAudience}</div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#615a51]">Target Age Group</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.targetAgeGroup}
                    onChange={e => setFormData({ ...formData, targetAgeGroup: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525]"
                  />
                ) : (
                  <div className="text-xs text-[#252525]">{selectedEvent.targetAgeGroup}</div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#615a51]">Brand Identity & Aesthetics</label>
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={formData.brandIdentity}
                    onChange={e => setFormData({ ...formData, brandIdentity: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525]"
                  />
                ) : (
                  <div className="text-xs text-[#615a51]">{selectedEvent.brandIdentity}</div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#615a51]">Preferred Language</label>
                {isEditing ? (
                  <select
                    value={formData.preferredLanguage}
                    onChange={e => setFormData({ ...formData, preferredLanguage: e.target.value as LanguageCode })}
                    className="w-full px-3 py-1.5 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525]"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi (हिन्दी)</option>
                    <option value="ta">Tamil (தமிழ்)</option>
                    <option value="te">Telugu (తెలుగు)</option>
                  </select>
                ) : (
                  <div className="text-xs font-mono uppercase text-[#252525]">
                    {selectedEvent.preferredLanguage === 'hi' ? 'Hindi' : selectedEvent.preferredLanguage === 'ta' ? 'Tamil' : selectedEvent.preferredLanguage === 'te' ? 'Telugu' : 'English'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card: Booking & Presale Promo */}
          <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-6 space-y-4">
            <h3 className="font-serif text-lg font-medium text-[#252525] flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#968A7C]" />
              <span>Ticketing & Presale URLs</span>
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#615a51]">Official Booking URL</label>
                {isEditing ? (
                  <input
                    type="url"
                    value={formData.bookingUrl}
                    onChange={e => setFormData({ ...formData, bookingUrl: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525]"
                  />
                ) : (
                  <a
                    href={selectedEvent.bookingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-800 underline truncate block"
                  >
                    {selectedEvent.bookingUrl || 'No URL configured'}
                  </a>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#615a51]">Presale Promo Code</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.presaleCode}
                    onChange={e => setFormData({ ...formData, presaleCode: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525] font-mono uppercase"
                  />
                ) : (
                  <div className="text-xs font-mono font-bold text-[#252525]">
                    {selectedEvent.presaleCode || 'None'} ({selectedEvent.presaleDiscountPercent || 0}% Off)
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Modal: Add New Ticket Tier */}
      {showNewTierModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <h4 className="font-serif text-xl font-normal text-[#252525]">Add Ticket Category</h4>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#615a51]">Tier Name</label>
                <input
                  type="text"
                  placeholder="e.g. VIP Backstage Lounge"
                  value={newTier.name}
                  onChange={e => setNewTier({ ...newTier, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#615a51]">Price in INR (₹)</label>
                  <input
                    type="number"
                    value={newTier.priceInr}
                    onChange={e => setNewTier({ ...newTier, priceInr: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#615a51]">Inventory Capacity</label>
                  <input
                    type="number"
                    value={newTier.capacity}
                    onChange={e => setNewTier({ ...newTier, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#615a51]">Tier Inclusions / Description</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Air-conditioned lounge, fast track entry, drinks included"
                  value={newTier.description}
                  onChange={e => setNewTier({ ...newTier, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isVipCheck"
                  checked={newTier.isVip}
                  onChange={e => setNewTier({ ...newTier, isVip: e.target.checked })}
                  className="rounded border-[#E8E6E1] text-[#252525] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="isVipCheck" className="text-xs text-[#252525] cursor-pointer">
                  Mark as VIP / Premium Tier
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E6E1]">
              <button
                onClick={() => setShowNewTierModal(false)}
                className="px-4 py-2 rounded-xl border border-[#E8E6E1] text-xs font-medium text-[#615a51] hover:bg-[#F4F2ED]"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTier}
                className="px-4 py-2 rounded-xl bg-[#252525] text-[#FAF9F6] text-xs font-medium hover:bg-[#3a3530]"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
