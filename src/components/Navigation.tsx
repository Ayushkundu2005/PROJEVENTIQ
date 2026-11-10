import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Palette,
  Share2,
  Flame,
  Search,
  BotMessageSquare,
  Mail,
  Milestone,
  BarChart3,
  Instagram,
  Settings,
} from 'lucide-react';

export type ActiveTab =
  | 'executive_hub'
  | 'event_management'
  | 'creative_studio'
  | 'social_content'
  | 'viral_matrix'
  | 'seo_intelligence'
  | 'ai_concierge'
  | 'direct_marketing'
  | 'campaign_roadmap'
  | 'analytics'
  | 'instagram_connections'
  | 'settings';

interface NavigationProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isInstagramConnected: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  isInstagramConnected,
}) => {
  const navItems: Array<{
    id: ActiveTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }> = [
    { id: 'executive_hub', label: 'Executive Hub', icon: LayoutDashboard },
    { id: 'event_management', label: 'Event Management', icon: CalendarDays },
    { id: 'creative_studio', label: 'Post & Creative Studio', icon: Palette },
    { id: 'social_content', label: 'Social Content Engine', icon: Share2 },
    { id: 'viral_matrix', label: 'Viral Matrix', icon: Flame },
    { id: 'seo_intelligence', label: 'SEO & SERP Intelligence', icon: Search },
    { id: 'ai_concierge', label: 'AI Concierge & Knowledge', icon: BotMessageSquare },
    { id: 'direct_marketing', label: 'Direct Marketing & Schema', icon: Mail },
    { id: 'campaign_roadmap', label: 'Campaign Roadmap', icon: Milestone },
    { id: 'analytics', label: 'Analytics & A/B Testing', icon: BarChart3 },
    {
      id: 'instagram_connections',
      label: 'Instagram Connections',
      icon: Instagram,
      badge: isInstagramConnected ? 'Active' : 'OAuth',
    },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-[#FAF9F6] border-b border-[#E8E6E1] overflow-x-auto scrollbar-none sticky top-18 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 py-1.5 min-w-max">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#252525] text-[#FAF9F6] shadow-sm'
                  : 'text-[#615a51] hover:text-[#252525] hover:bg-[#F4F2ED]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FAF9F6]' : 'text-[#968A7C]'}`} />
              <span>{item.label}</span>
              {item.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono uppercase tracking-wider ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : isInstagramConnected
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-[#E8E6E1] text-[#615a51]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
