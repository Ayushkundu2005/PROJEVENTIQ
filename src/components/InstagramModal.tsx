import React, { useState, useEffect } from 'react';
import { ConnectedInstagramAccount } from '../types';
import {
  Instagram,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Trash2,
  RefreshCw,
  Key,
  Globe,
  HelpCircle,
  X,
  ArrowRight,
} from 'lucide-react';

interface InstagramModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: ConnectedInstagramAccount;
  onRefreshStatus: () => void;
}

export const InstagramModal: React.FC<InstagramModalProps> = ({
  isOpen,
  onClose,
  account,
  onRefreshStatus,
}) => {
  const [config, setConfig] = useState<{
    configured: boolean;
    clientIdConfigured: boolean;
    clientSecretConfigured: boolean;
    redirectUri: string;
    metaDocumentationUrl: string;
    supportedAccountTypes: string[];
    requiredPermissions: string[];
  } | null>(null);

  const [loadingAuth, setLoadingAuth] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Fetch server-side Meta configuration status
  useEffect(() => {
    if (isOpen) {
      fetch('/api/instagram/config')
        .then(r => r.json())
        .then(data => setConfig(data))
        .catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Initiate genuine Meta Instagram OAuth flow
  const handleConnectInstagram = async () => {
    setLoadingAuth(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/instagram/auth');
      const data = await res.json();

      if (res.ok && data.authUrl) {
        // Redirect user to official Meta Instagram authorization page
        window.location.href = data.authUrl;
      } else {
        setStatusMessage(
          data.instructions || data.error || 'Meta Instagram OAuth credentials are not configured on the server.'
        );
      }
    } catch (err: any) {
      setStatusMessage(`OAuth initialization failed: ${err.message}`);
    } finally {
      setLoadingAuth(false);
    }
  };

  // Disconnect Instagram account
  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      const res = await fetch('/api/instagram/disconnect', { method: 'POST' });
      if (res.ok) {
        onRefreshStatus();
        setStatusMessage('Instagram account disconnected.');
      }
    } catch (err: any) {
      setStatusMessage(`Failed to disconnect: ${err.message}`);
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-[#E8E6E1] bg-[#F4F2ED] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
              <Instagram className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-normal text-[#252525]">
                Meta Instagram Professional Connection
              </h3>
              <p className="text-xs text-[#968A7C]">Official Instagram Graph API OAuth & Media Publishing Engine</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#968A7C] hover:text-[#252525] hover:bg-[#FAF9F6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Status Badge */}
          {account.connected ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-emerald-900">Connected to Meta Graph API</span>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800">
                  {account.accountType || 'Professional Account'}
                </span>
              </div>

              <div className="flex items-center gap-3 pt-1">
                {account.profilePictureUrl ? (
                  <img
                    src={account.profilePictureUrl}
                    alt={account.username}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                    @
                  </div>
                )}
                <div>
                  <div className="text-sm font-semibold text-[#252525]">@{account.username}</div>
                  <div className="text-[11px] text-[#615a51]">
                    User ID: {account.instagramUserId} • Connected on {new Date(account.connectedAt || '').toLocaleDateString('en-IN')}
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-emerald-800 pt-2 border-t border-emerald-200/80">
                Granted Permissions: {account.permissionsGranted?.join(', ') || 'instagram_business_basic, instagram_content_publish'}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#F4F2ED] border border-[#E8E6E1] space-y-2">
              <div className="flex items-center gap-2 font-medium text-[#252525]">
                <ShieldCheck className="w-4 h-4 text-[#968A7C]" />
                <span>Genuine OAuth Flow (No simulated accounts)</span>
              </div>
              <p className="text-[#615a51] leading-relaxed">
                EventIQ connects only to verified Instagram Business and Creator accounts through Meta's official login dialog. We never ask for your Instagram password or scrape accounts.
              </p>
            </div>
          )}

          {/* Meta Requirements & Eligibility */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-normal text-[#252525]">Supported Account Types & Requirements</h4>
            <ul className="space-y-2 text-[#615a51]">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#252525] mt-1.5 shrink-0" />
                <span>
                  <strong>Instagram Business or Creator Account:</strong> Personal Instagram accounts do not support official publishing or insights via Meta's Graph API.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#252525] mt-1.5 shrink-0" />
                <span>
                  <strong>Meta Developer Configuration:</strong> Requires <code className="font-mono bg-[#E8E6E1] px-1 rounded">INSTAGRAM_CLIENT_ID</code> and <code className="font-mono bg-[#E8E6E1] px-1 rounded">INSTAGRAM_CLIENT_SECRET</code> set in your deployment environment variables.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#252525] mt-1.5 shrink-0" />
                <span>
                  <strong>Authorized Callback URI:</strong> Ensure <code className="font-mono bg-[#E8E6E1] px-1 rounded">{config?.redirectUri || 'https://your-domain/api/instagram/callback'}</code> is registered under Meta App Settings › Instagram Login › Valid OAuth Redirect URIs.
                </span>
              </li>
            </ul>
          </div>

          {/* Credentials Check Status */}
          {config && !config.configured && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Meta API Credentials Setup Required</span>
              </div>
              <p className="leading-relaxed text-[11px]">
                To initiate live Instagram authorization, add your Meta App credentials to the environment variables (.env):
              </p>
              <div className="p-2.5 rounded-xl bg-white border border-amber-200 font-mono text-[10px] space-y-1 text-stone-800">
                <div>INSTAGRAM_CLIENT_ID={config.clientIdConfigured ? '✓ Configured' : 'YOUR_META_APP_ID'}</div>
                <div>INSTAGRAM_CLIENT_SECRET={config.clientSecretConfigured ? '✓ Configured' : 'YOUR_META_APP_SECRET'}</div>
                <div>INSTAGRAM_REDIRECT_URI={config.redirectUri}</div>
              </div>
              <p className="text-[10px] text-amber-800">
                All other EventIQ modules (Creative Studio, AI Concierge, SEO Intelligence, Roadmap, Analytics) remain fully functional without this.
              </p>
            </div>
          )}

          {statusMessage && (
            <div className="p-3 rounded-xl bg-[#F4F2ED] border border-[#E8E6E1] text-[#252525] text-xs">
              {statusMessage}
            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="p-5 border-t border-[#E8E6E1] bg-[#FAF9F6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <a
            href="https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-[#968A7C] hover:text-[#252525] flex items-center gap-1"
          >
            <span>Meta Graph Documentation</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <div className="flex items-center gap-2">
            {account.connected ? (
              <button
                onClick={handleDisconnect}
                disabled={disconnecting}
                className="px-4 py-2 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{disconnecting ? 'Disconnecting...' : 'Disconnect Account'}</span>
              </button>
            ) : (
              <button
                onClick={handleConnectInstagram}
                disabled={loadingAuth}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 text-white text-xs font-medium hover:opacity-95 flex items-center gap-2 shadow-sm transition-all"
              >
                <Instagram className="w-4 h-4" />
                <span>{loadingAuth ? 'Opening Meta Login...' : 'Connect Eligible Instagram Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
