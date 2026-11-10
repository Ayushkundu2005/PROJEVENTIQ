import React, { useState, useEffect } from 'react';
import { EventData, ConnectedInstagramAccount, User } from './types';
import { Header } from './components/Header';
import { Navigation, ActiveTab } from './components/Navigation';
import { ExecutiveHub } from './components/ExecutiveHub';
import { EventManagement } from './components/EventManagement';
import { CreativeStudio } from './components/CreativeStudio';
import { SocialContentEngine } from './components/SocialContentEngine';
import { ViralMatrix } from './components/ViralMatrix';
import { SeoIntelligence } from './components/SeoIntelligence';
import { AiConcierge } from './components/AiConcierge';
import { DirectMarketing } from './components/DirectMarketing';
import { CampaignRoadmap } from './components/CampaignRoadmap';
import { AnalyticsView } from './components/AnalyticsView';
import { InstagramModal } from './components/InstagramModal';
import { SettingsView } from './components/SettingsView';
import { CreateEventModal } from './components/CreateEventModal';
import { INITIAL_EVENTS } from './data/initialEvents';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('executive_hub');
  const [events, setEvents] = useState<EventData[]>(INITIAL_EVENTS);
  const [selectedEventId, setSelectedEventId] = useState<string>(INITIAL_EVENTS[0]?.id || '');
  const [isInstagramModalOpen, setIsInstagramModalOpen] = useState(false);
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Authenticated User State
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'usr-1',
    name: 'Aditya Kumar',
    email: 'akpinterestbus@gmail.com',
    organization: 'Vanguard Events & Media',
    role: 'organizer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  });

  // Connected Instagram State
  const [instagramAccount, setInstagramAccount] = useState<ConnectedInstagramAccount>({
    connected: false,
  });

  // Fetch initial events and Instagram status
  useEffect(() => {
    // 1. Fetch Events
    fetch('/api/events')
      .then(r => r.json())
      .then(data => {
        if (data.events && data.events.length > 0) {
          setEvents(data.events);
          setSelectedEventId(data.events[0].id);
        }
      })
      .catch(console.error);

    // 2. Fetch Instagram connection status
    fetchInstagramStatus();

    // 3. Check for OAuth callback URL query params
    const params = new URLSearchParams(window.location.search);
    if (params.get('instagram_connected') === 'success') {
      setNotification({
        type: 'success',
        message: 'Genuine Meta Instagram Professional account connected successfully!',
      });
      fetchInstagramStatus();
      // Clean query string from browser bar
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get('instagram_error')) {
      setNotification({
        type: 'error',
        message: `Instagram connection notice: ${decodeURIComponent(params.get('instagram_error') || '')}`,
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const fetchInstagramStatus = () => {
    fetch('/api/instagram/status')
      .then(r => r.json())
      .then(data => {
        setInstagramAccount(data);
      })
      .catch(console.error);
  };

  const selectedEvent = events.find(e => e.id === selectedEventId) || events[0] || null;

  // Handle Event Updates
  const handleSaveEvent = async (updated: EventData) => {
    try {
      const res = await fetch(`/api/events/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data.event) {
        setEvents(events.map(e => e.id === updated.id ? data.event : e));
        setNotification({ type: 'success', message: 'Event details updated successfully across all modules.' });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Event Creation
  const handleCreateEvent = async (newEventData: Partial<EventData>) => {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEventData),
      });
      const data = await res.json();
      if (data.event) {
        setEvents([data.event, ...events]);
        setSelectedEventId(data.event.id);
        setNotification({ type: 'success', message: `Event "${data.event.name}" initialized as active workspace context.` });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Duplicate Event
  const handleDuplicateEvent = async (eventId: string) => {
    try {
      const res = await fetch(`/api/events/${eventId}/duplicate`, { method: 'POST' });
      const data = await res.json();
      if (data.event) {
        setEvents([data.event, ...events]);
        setSelectedEventId(data.event.id);
        setNotification({ type: 'success', message: `Duplicated event created: "${data.event.name}".` });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete Event
  const handleDeleteEvent = async (eventId: string) => {
    if (events.length <= 1) {
      setNotification({ type: 'error', message: 'Cannot delete the only remaining event brief.' });
      return;
    }
    try {
      await fetch(`/api/events/${eventId}`, { method: 'DELETE' });
      const remaining = events.filter(e => e.id !== eventId);
      setEvents(remaining);
      setSelectedEventId(remaining[0].id);
      setNotification({ type: 'success', message: 'Event deleted.' });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#252525] flex flex-col font-sans">
      
      {/* Top Header */}
      <Header
        events={events}
        selectedEvent={selectedEvent}
        onSelectEvent={(ev) => setSelectedEventId(ev.id)}
        onOpenCreateEvent={() => setIsCreateEventModalOpen(true)}
        instagramAccount={instagramAccount}
        onOpenInstagramModal={() => setIsInstagramModalOpen(true)}
        user={currentUser}
      />

      {/* Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isInstagramConnected={instagramAccount.connected}
      />

      {/* Notification Toast */}
      {notification && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-4">
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-rose-50 text-rose-900 border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span className="font-medium">{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="p-1 rounded-md hover:bg-black/5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {selectedEvent ? (
          <>
            {activeTab === 'executive_hub' && (
              <ExecutiveHub
                event={selectedEvent}
                events={events}
                instagramAccount={instagramAccount}
                onNavigate={setActiveTab}
                onOpenCreateEvent={() => setIsCreateEventModalOpen(true)}
                onSelectEvent={(ev) => setSelectedEventId(ev.id)}
              />
            )}

            {activeTab === 'event_management' && (
              <EventManagement
                events={events}
                selectedEvent={selectedEvent}
                onSelectEvent={(ev) => setSelectedEventId(ev.id)}
                onSaveEvent={handleSaveEvent}
                onCreateEvent={handleCreateEvent}
                onDuplicateEvent={handleDuplicateEvent}
                onDeleteEvent={handleDeleteEvent}
              />
            )}

            {activeTab === 'creative_studio' && (
              <CreativeStudio
                event={selectedEvent}
              />
            )}

            {activeTab === 'social_content' && (
              <SocialContentEngine
                event={selectedEvent}
                instagramAccount={instagramAccount}
                onOpenInstagramModal={() => setIsInstagramModalOpen(true)}
              />
            )}

            {activeTab === 'viral_matrix' && (
              <ViralMatrix
                event={selectedEvent}
              />
            )}

            {activeTab === 'seo_intelligence' && (
              <SeoIntelligence
                event={selectedEvent}
              />
            )}

            {activeTab === 'ai_concierge' && (
              <AiConcierge
                event={selectedEvent}
              />
            )}

            {activeTab === 'direct_marketing' && (
              <DirectMarketing
                event={selectedEvent}
              />
            )}

            {activeTab === 'campaign_roadmap' && (
              <CampaignRoadmap
                event={selectedEvent}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsView
                event={selectedEvent}
              />
            )}

            {activeTab === 'instagram_connections' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-[#E8E6E1] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="font-serif text-3xl font-normal text-[#252525]">Instagram Account Connection</h1>
                    <p className="text-xs text-[#968A7C] mt-1">
                      Direct Meta OAuth authorization with official Instagram Graph API media publishing & insights
                    </p>
                  </div>
                  <button
                    onClick={() => setIsInstagramModalOpen(true)}
                    className="px-4 py-2 bg-[#252525] text-[#FAF9F6] rounded-xl text-xs font-medium hover:bg-[#3a3530]"
                  >
                    Open Meta Connection Dialog
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-6 space-y-4">
                    <h3 className="font-serif text-lg font-medium text-[#252525]">Connection Status</h3>
                    {instagramAccount.connected ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-emerald-800 font-medium text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Active Meta Professional Connection</span>
                        </div>
                        <div className="p-4 bg-[#F4F2ED] rounded-xl text-xs space-y-1 font-mono">
                          <div>Username: @{instagramAccount.username}</div>
                          <div>User ID: {instagramAccount.instagramUserId}</div>
                          <div>Account Type: {instagramAccount.accountType}</div>
                          <div>Permissions: {instagramAccount.permissionsGranted?.join(', ')}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 text-xs text-[#615a51]">
                        <p>No Instagram account is currently connected.</p>
                        <p>
                          Connect an eligible Instagram Business or Creator account to enable one-click publishing from the Social Content Engine and access audience insights.
                        </p>
                        <button
                          onClick={() => setIsInstagramModalOpen(true)}
                          className="px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl font-medium"
                        >
                          Connect Instagram Account
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-6 space-y-3 text-xs text-[#615a51]">
                    <h3 className="font-serif text-lg font-medium text-[#252525]">API Architecture</h3>
                    <p>
                      EventIQ strictly adheres to Meta's developer policies. We request only:
                    </p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li><code>instagram_business_basic</code>: Identity and handle verification</li>
                      <li><code>instagram_content_publish</code>: Two-step media container publishing</li>
                      <li><code>instagram_manage_insights</code>: Verified impressions and profile views</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <SettingsView
                user={currentUser}
                onUpdateUser={setCurrentUser}
                instagramAccount={instagramAccount}
                onOpenInstagramModal={() => setIsInstagramModalOpen(true)}
              />
            )}
          </>
        ) : (
          <div className="py-20 text-center space-y-4">
            <h3 className="font-serif text-2xl text-[#252525]">No Event Configured</h3>
            <p className="text-xs text-[#968A7C]">Create your first event brief to begin.</p>
            <button
              onClick={() => setIsCreateEventModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#252525] text-[#FAF9F6] text-xs font-medium"
            >
              Create Event
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E8E6E1] bg-[#FAF9F6] py-6 text-center text-xs text-[#968A7C]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-[#252525]">EventIQ</span>
            <span>•</span>
            <span>Unified Event Marketing & Management Platform</span>
          </div>
          <div className="text-[11px] font-mono">
            India-First • INR (₹) • IST (+05:30) • Meta Instagram Integration
          </div>
        </div>
      </footer>

      {/* Instagram Connection Modal */}
      <InstagramModal
        isOpen={isInstagramModalOpen}
        onClose={() => setIsInstagramModalOpen(false)}
        account={instagramAccount}
        onRefreshStatus={fetchInstagramStatus}
      />

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateEventModalOpen}
        onClose={() => setIsCreateEventModalOpen(false)}
        onCreateEvent={handleCreateEvent}
      />

    </div>
  );
};

export default App;
