import React, { useState } from 'react';
import { EventData, ABTestExperiment } from '../types';
import { formatINR } from '../utils/pricing';
import {
  BarChart3,
  TrendingUp,
  Sparkles,
  Split,
  Eye,
  MousePointerClick,
  CheckCircle,
  Plus,
  ArrowUpRight,
  Flame,
  Award,
  AlertCircle,
} from 'lucide-react';

interface AnalyticsViewProps {
  event: EventData;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ event }) => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'ab_testing'>('metrics');
  const [showNewExperimentModal, setShowNewExperimentModal] = useState(false);

  // A/B testing experiments state
  const [experiments, setExperiments] = useState<ABTestExperiment[]>([
    {
      id: 'ab-1',
      eventId: event.id,
      element: 'headline',
      variantA: `${event.name}: South India's Premier Music Gathering`,
      variantB: `What ₹2,499 Gets You: 3 Days, 40+ Artists at ${event.name}`,
      impressionsA: 18400,
      impressionsB: 19100,
      clicksA: 820,
      clicksB: 1290,
      conversionsA: 94,
      conversionsB: 182,
      confidenceWinner: 'B',
      aiRecommendation: 'Variant B (Value & Price Hook) delivered +93% higher ticket conversions over generic prestige copy. Recommend adopting price transparency across all Phase 2 paid social ads.',
    },
    {
      id: 'ab-2',
      eventId: event.id,
      element: 'cta',
      variantA: 'Book Official Passes Now',
      variantB: 'Lock In Early Bird Before Friday Surge',
      impressionsA: 9500,
      impressionsB: 9400,
      clicksA: 410,
      clicksB: 680,
      conversionsA: 45,
      conversionsB: 88,
      confidenceWinner: 'B',
      aiRecommendation: 'Urgency-anchored CTA (Variant B) increased click-to-cart conversion rate from 4.3% to 7.2%.',
    },
    {
      id: 'ab-3',
      eventId: event.id,
      element: 'subject_line',
      variantA: `Presale Open: Your tickets for ${event.name}`,
      variantB: `[VIP Access] Save 15% on ${event.name} passes (Secret code inside)`,
      impressionsA: 3400,
      impressionsB: 3400,
      clicksA: 520,
      clicksB: 890,
      conversionsA: 82,
      conversionsB: 140,
      confidenceWinner: 'B',
      aiRecommendation: 'Personalized exclusive VIP brackets boosted email open rates from 24% to 41%.',
    },
  ]);

  const [newExp, setNewExp] = useState<{
    element: 'caption' | 'headline' | 'cta' | 'creative_theme' | 'subject_line';
    variantA: string;
    variantB: string;
  }>({
    element: 'headline',
    variantA: '',
    variantB: '',
  });

  const handleCreateExperiment = () => {
    if (!newExp.variantA || !newExp.variantB) return;
    const created: ABTestExperiment = {
      id: `ab-${Date.now()}`,
      eventId: event.id,
      element: newExp.element,
      variantA: newExp.variantA,
      variantB: newExp.variantB,
      impressionsA: 1000,
      impressionsB: 1000,
      clicksA: 45,
      clicksB: 52,
      conversionsA: 6,
      conversionsB: 8,
      confidenceWinner: 'insufficient_data',
      aiRecommendation: 'Experiment launched. Gathering click attribution data over the next 48 hours.',
    };
    setExperiments([created, ...experiments]);
    setShowNewExperimentModal(false);
    setNewExp({ element: 'headline', variantA: '', variantB: '' });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E6E1]">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#252525]">Analytics & A/B Experimentation</h1>
          <p className="text-xs text-[#968A7C] mt-1">
            Grounded campaign performance analytics, channel attribution, and multivariate hypothesis testing
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-[#F4F2ED] p-1 rounded-xl border border-[#E8E6E1]">
            <button
              onClick={() => setActiveTab('metrics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'metrics' ? 'bg-[#252525] text-[#FAF9F6]' : 'text-[#615a51]'
              }`}
            >
              Channel Metrics
            </button>
            <button
              onClick={() => setActiveTab('ab_testing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'ab_testing' ? 'bg-[#252525] text-[#FAF9F6]' : 'text-[#615a51]'
              }`}
            >
              A/B Test Lab ({experiments.length})
            </button>
          </div>

          {activeTab === 'ab_testing' && (
            <button
              onClick={() => setShowNewExperimentModal(true)}
              className="px-3.5 py-2 rounded-xl bg-[#252525] text-[#FAF9F6] text-xs font-medium hover:bg-[#3a3530] flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Experiment</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === 'metrics' ? (
        /* Channel Analytics Dashboard */
        <div className="space-y-6">
          
          {/* Top KPI row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-[#E8E6E1]">
              <div className="text-xs font-medium text-[#968A7C] uppercase tracking-wider">Gross Impressions</div>
              <div className="text-2xl font-serif font-medium text-[#252525] mt-2">148,600</div>
              <div className="text-[11px] text-emerald-800 mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +24% vs preceding cycle
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-[#E8E6E1]">
              <div className="text-xs font-medium text-[#968A7C] uppercase tracking-wider">Click-Through Rate (CTR)</div>
              <div className="text-2xl font-serif font-medium text-[#252525] mt-2">4.82%</div>
              <div className="text-[11px] text-[#968A7C] mt-1">7,162 total site visits</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-[#E8E6E1]">
              <div className="text-xs font-medium text-[#968A7C] uppercase tracking-wider">Cart Conversion Rate</div>
              <div className="text-2xl font-serif font-medium text-[#252525] mt-2">6.84%</div>
              <div className="text-[11px] text-emerald-800 mt-1">490 ticket bookings completed</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-[#E8E6E1]">
              <div className="text-xs font-medium text-[#968A7C] uppercase tracking-wider">Blended Cost Per Acquisition</div>
              <div className="text-2xl font-serif font-medium text-[#252525] mt-2">₹184</div>
              <div className="text-[11px] text-[#968A7C] mt-1">Indian festival benchmark: ₹260</div>
            </div>
          </div>

          {/* Channel Performance Breakdown */}
          <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-medium text-[#252525]">Channel Attribution & Traffic Velocity</h3>
              <span className="text-xs font-mono text-[#968A7C]">Verified UTMs</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F4F2ED] border-b border-[#E8E6E1] text-[11px] font-mono uppercase text-[#968A7C]">
                    <th className="py-2.5 px-4">Channel</th>
                    <th className="py-2.5 px-4">Impressions</th>
                    <th className="py-2.5 px-4">Clicks</th>
                    <th className="py-2.5 px-4">CTR</th>
                    <th className="py-2.5 px-4">Tickets Sold</th>
                    <th className="py-2.5 px-4">Revenue Generated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E6E1]">
                  {[
                    { channel: 'Instagram Bio & Stories', imp: '64,200', clicks: '3,120', ctr: '4.86%', tickets: '215', rev: '₹6,45,000' },
                    { channel: 'Email Drip Sequences', imp: '12,800', clicks: '1,840', ctr: '14.38%', tickets: '142', rev: '₹4,97,000' },
                    { channel: 'Google Search & SEO Snippets', imp: '42,000', clicks: '1,420', ctr: '3.38%', tickets: '86', rev: '₹2,58,000' },
                    { channel: 'WhatsApp Community Drop', imp: '5,600', clicks: '782', ctr: '13.96%', tickets: '47', rev: '₹1,41,000' },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#F4F2ED]/60">
                      <td className="py-3 px-4 font-medium text-[#252525]">{row.channel}</td>
                      <td className="py-3 px-4 font-mono text-[#615a51]">{row.imp}</td>
                      <td className="py-3 px-4 font-mono text-[#615a51]">{row.clicks}</td>
                      <td className="py-3 px-4 font-mono font-semibold text-emerald-800">{row.ctr}</td>
                      <td className="py-3 px-4 font-mono text-[#252525]">{row.tickets}</td>
                      <td className="py-3 px-4 font-serif font-medium text-[#252525]">{row.rev}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      ) : (
        /* A/B Testing Lab */
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-[#F4F2ED] border border-[#E8E6E1] text-xs text-[#615a51]">
            <strong className="text-[#252525]">Multi-Variant Testing Architecture:</strong> Rigorously measure which headline hooks, CTAs, and email subject lines maximize pass purchases before increasing paid social budgets.
          </div>

          <div className="space-y-4">
            {experiments.map((exp) => {
              const ctrA = exp.impressionsA > 0 ? ((exp.clicksA / exp.impressionsA) * 100).toFixed(2) : '0';
              const ctrB = exp.impressionsB > 0 ? ((exp.clicksB / exp.impressionsB) * 100).toFixed(2) : '0';
              const convRateA = exp.clicksA > 0 ? ((exp.conversionsA / exp.clicksA) * 100).toFixed(1) : '0';
              const convRateB = exp.clicksB > 0 ? ((exp.conversionsB / exp.clicksB) * 100).toFixed(1) : '0';

              return (
                <div key={exp.id} className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-6 space-y-4 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E8E6E1]">
                    <div className="flex items-center gap-2">
                      <Split className="w-4 h-4 text-[#968A7C]" />
                      <span className="text-xs font-semibold text-[#252525] uppercase tracking-wider font-mono">
                        Testing: {exp.element.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      {exp.confidenceWinner === 'B' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium flex items-center gap-1 font-mono text-[10px]">
                          <Award className="w-3 h-3 text-emerald-600" />
                          Variant B Winner (+{((Number(convRateB) / (Number(convRateA) || 1) - 1) * 100).toFixed(0)}% Lift)
                        </span>
                      ) : exp.confidenceWinner === 'A' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium flex items-center gap-1 font-mono text-[10px]">
                          <Award className="w-3 h-3 text-emerald-600" /> Variant A Winner
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#E8E6E1] text-[#615a51] font-mono text-[10px]">
                          Gathering Data
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Comparison columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Variant A */}
                    <div className={`p-4 rounded-xl border text-xs space-y-2 ${exp.confidenceWinner === 'A' ? 'bg-emerald-50/50 border-emerald-300' : 'bg-[#F4F2ED] border-[#E8E6E1]'}`}>
                      <div className="flex items-center justify-between font-mono text-[10px] text-[#968A7C]">
                        <span>VARIANT A (Control)</span>
                        <span>CTR: {ctrA}%</span>
                      </div>
                      <p className="font-serif text-sm font-medium text-[#252525]">"{exp.variantA}"</p>
                      <div className="flex items-center justify-between pt-2 border-t border-[#E8E6E1]/70 text-[11px] text-[#615a51]">
                        <span>{exp.clicksA.toLocaleString()} clicks</span>
                        <span>{exp.conversionsA} conversions ({convRateA}%)</span>
                      </div>
                    </div>

                    {/* Variant B */}
                    <div className={`p-4 rounded-xl border text-xs space-y-2 ${exp.confidenceWinner === 'B' ? 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-300' : 'bg-[#F4F2ED] border-[#E8E6E1]'}`}>
                      <div className="flex items-center justify-between font-mono text-[10px] text-[#968A7C]">
                        <span className="font-semibold text-emerald-800">VARIANT B (Challenger)</span>
                        <span className="font-semibold text-emerald-800">CTR: {ctrB}%</span>
                      </div>
                      <p className="font-serif text-sm font-medium text-[#252525]">"{exp.variantB}"</p>
                      <div className="flex items-center justify-between pt-2 border-t border-[#E8E6E1]/70 text-[11px] text-[#615a51]">
                        <span>{exp.clicksB.toLocaleString()} clicks</span>
                        <span className="font-semibold text-emerald-800">{exp.conversionsB} conversions ({convRateB}%)</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Recommendation */}
                  {exp.aiRecommendation && (
                    <div className="p-3 bg-white border border-[#E8E6E1] rounded-xl flex items-start gap-2.5 text-xs text-[#615a51]">
                      <Sparkles className="w-3.5 h-3.5 text-[#968A7C] shrink-0 mt-0.5" />
                      <p className="leading-relaxed">{exp.aiRecommendation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: Create New Experiment */}
      {showNewExperimentModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <h4 className="font-serif text-xl font-normal text-[#252525]">Launch A/B Experiment</h4>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#615a51]">Element to Test</label>
                <select
                  value={newExp.element}
                  onChange={e => setNewExp({ ...newExp, element: e.target.value as any })}
                  className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525]"
                >
                  <option value="headline">Headline / Event Slogan</option>
                  <option value="cta">Call to Action (CTA)</option>
                  <option value="caption">Social Caption Opening Hook</option>
                  <option value="subject_line">Email Subject Line</option>
                  <option value="creative_theme">Creative Studio Theme</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#615a51]">Variant A (Control)</label>
                <input
                  type="text"
                  placeholder="e.g. Official passes on sale now"
                  value={newExp.variantA}
                  onChange={e => setNewExp({ ...newExp, variantA: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#615a51]">Variant B (Hypothesis)</label>
                <input
                  type="text"
                  placeholder="e.g. Save ₹500 before Friday price surge"
                  value={newExp.variantB}
                  onChange={e => setNewExp({ ...newExp, variantB: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F4F2ED] border border-[#E8E6E1] rounded-xl text-xs text-[#252525]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E6E1]">
              <button
                onClick={() => setShowNewExperimentModal(false)}
                className="px-4 py-2 rounded-xl border border-[#E8E6E1] text-xs font-medium text-[#615a51] hover:bg-[#F4F2ED]"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateExperiment}
                disabled={!newExp.variantA || !newExp.variantB}
                className="px-4 py-2 rounded-xl bg-[#252525] text-[#FAF9F6] text-xs font-medium hover:bg-[#3a3530] disabled:opacity-50"
              >
                Launch Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
