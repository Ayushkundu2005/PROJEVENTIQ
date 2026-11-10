import React, { useState } from 'react';
import { User, ConnectedInstagramAccount } from '../types';
import {
  Settings,
  User as UserIcon,
  ShieldCheck,
  Key,
  Globe,
  Database,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Instagram,
  Save,
} from 'lucide-react';

interface SettingsViewProps {
  user: User;
  onUpdateUser: (updated: User) => void;
  instagramAccount: ConnectedInstagramAccount;
  onOpenInstagramModal: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdateUser,
  instagramAccount,
  onOpenInstagramModal,
}) => {
  const [formData, setFormData] = useState<User>(user);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Module Title */}
      <div className="pb-4 border-b border-[#E8E6E1]">
        <h1 className="font-serif text-3xl font-normal text-[#252525]">Platform Settings & Workspace</h1>
        <p className="text-xs text-[#968A7C] mt-1">
          Organizer account profile, localization standards (INR & IST), and API integration health
        </p>
      </div>

      {/* Account Settings Form */}
      <form onSubmit={handleSave} className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E6E1]">
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-[#968A7C]" />
            <h3 className="font-serif text-lg font-medium text-[#252525]">Organizer Profile</h3>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#252525] text-[#FAF9F6] rounded-xl text-xs font-medium hover:bg-[#3a3530] flex items-center gap-1.5 shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savedSuccess ? 'Saved Successfully' : 'Save Profile'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-medium text-[#615a51]">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-medium text-[#615a51]">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-medium text-[#615a51]">Organization / Agency Name</label>
            <input
              type="text"
              value={formData.organization}
              onChange={e => setFormData({ ...formData, organization: e.target.value })}
              className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-medium text-[#615a51]">Workspace Role</label>
            <select
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value as any })}
              className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525]"
            >
              <option value="organizer">Primary Event Organizer</option>
              <option value="marketing_lead">Marketing Lead / Growth Director</option>
              <option value="agency">Agency Producer</option>
              <option value="creator">Creative Designer</option>
            </select>
          </div>
        </div>
      </form>

      {/* Localization Standards Card */}
      <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-6 space-y-4 text-xs">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#968A7C]" />
          <h3 className="font-serif text-lg font-medium text-[#252525]">India-First Regional Defaults</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 bg-[#F4F2ED] rounded-xl border border-[#E8E6E1]">
            <div className="text-[#968A7C]">Currency Standard</div>
            <div className="text-sm font-semibold text-[#252525] mt-1">Indian Rupee (INR ₹)</div>
            <div className="text-[10px] text-[#968A7C] mt-0.5">Enforces en-IN comma formatting</div>
          </div>

          <div className="p-3.5 bg-[#F4F2ED] rounded-xl border border-[#E8E6E1]">
            <div className="text-[#968A7C]">Timezone Standard</div>
            <div className="text-sm font-semibold text-[#252525] mt-1">Asia/Kolkata (IST +05:30)</div>
            <div className="text-[10px] text-[#968A7C] mt-0.5">Applied to all Schema.org JSON-LD</div>
          </div>

          <div className="p-3.5 bg-[#F4F2ED] rounded-xl border border-[#E8E6E1]">
            <div className="text-[#968A7C]">GST Compliance</div>
            <div className="text-sm font-semibold text-[#252525] mt-1">18% Live Entertainment</div>
            <div className="text-[10px] text-[#968A7C] mt-0.5">Automated tax surge projection</div>
          </div>
        </div>
      </div>

      {/* Integration Diagnostics Card */}
      <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-6 space-y-4 text-xs">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-[#968A7C]" />
          <h3 className="font-serif text-lg font-medium text-[#252525]">API & Integration Diagnostics</h3>
        </div>

        <div className="space-y-3">
          {/* Gemini AI Status */}
          <div className="p-3.5 rounded-xl bg-[#F4F2ED] border border-[#E8E6E1] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <div>
                <div className="font-medium text-[#252525]">Google Gemini AI API (@google/genai)</div>
                <div className="text-[11px] text-[#968A7C]">Model: gemini-3.8-flash • Server-side secure calls</div>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Active
            </span>
          </div>

          {/* Meta Instagram Status */}
          <div className="p-3.5 rounded-xl bg-[#F4F2ED] border border-[#E8E6E1] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`w-2.5 h-2.5 rounded-full ${instagramAccount.connected ? 'bg-emerald-500' : 'bg-amber-400'}`} />
              <div>
                <div className="font-medium text-[#252525]">Meta Instagram Professional Graph API</div>
                <div className="text-[11px] text-[#968A7C]">
                  {instagramAccount.connected ? `Connected as @${instagramAccount.username}` : 'OAuth credentials awaiting connection'}
                </div>
              </div>
            </div>
            <button
              onClick={onOpenInstagramModal}
              className="text-xs text-[#252525] underline font-medium cursor-pointer"
            >
              Configure
            </button>
          </div>

          {/* Persistence Engine */}
          <div className="p-3.5 rounded-xl bg-[#F4F2ED] border border-[#E8E6E1] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <div>
                <div className="font-medium text-[#252525]">Persistent Storage & Workspace Sessions</div>
                <div className="text-[11px] text-[#968A7C]">Server persistent state with client-side local caching</div>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Healthy
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
