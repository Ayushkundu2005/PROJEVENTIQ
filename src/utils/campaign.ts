/**
 * EventIQ 5-Phase Campaign Master Timeline Planner
 * Coordinated 5-phase marketing lifecycle:
 * Phase 1: Awareness (Announcement & teasers)
 * Phase 2: Presale (Early access & codes)
 * Phase 3: Price Surge (Urgency & price increases)
 * Phase 4: Day-Of (Logistics, gates, live concierge)
 * Phase 5: Post-Event (Recap, thanks, retention)
 */

export type CampaignPhaseId = 'phase_1_awareness' | 'phase_2_presale' | 'phase_3_surge' | 'phase_4_day_of' | 'phase_5_post_event';

export interface CampaignMilestone {
  id: string;
  phaseId: CampaignPhaseId;
  name: string;
  description: string;
  daysOffsetFromEvent: number; // e.g. -45 days, -30 days, 0 (event day), +2 days
  suggestedChannels: string[];
  suggestedContentType: string;
  defaultStatus: 'completed' | 'in_progress' | 'scheduled';
}

export const CAMPAIGN_PHASE_CONFIGS: Record<CampaignPhaseId, {
  name: string;
  tagline: string;
  relativeWindow: string;
  color: string;
  recommendedBudgetSplitPercent: number;
}> = {
  phase_1_awareness: {
    name: 'Phase 1: Awareness & Teasers',
    tagline: 'Build anticipation, initiate SEO footprint, and launch official press release',
    relativeWindow: '45 to 30 days before event',
    color: '#968A7C',
    recommendedBudgetSplitPercent: 25,
  },
  phase_2_presale: {
    name: 'Phase 2: Presale & Early Bird',
    tagline: 'Exclusive loyalty presale, coupon drops, and initial ticket momentum',
    relativeWindow: '30 to 14 days before event',
    color: '#8B7355',
    recommendedBudgetSplitPercent: 30,
  },
  phase_3_surge: {
    name: 'Phase 3: Price Surge & Urgency',
    tagline: 'Final tier price increase alerts, scarcity counters, and retargeting ads',
    relativeWindow: '14 to 1 day before event',
    color: '#B2533E',
    recommendedBudgetSplitPercent: 30,
  },
  phase_4_day_of: {
    name: 'Phase 4: Day-Of Logistics',
    tagline: 'Gate entry rules, parking maps, artist schedules, and real-time AI Concierge',
    relativeWindow: 'Event day (Day 0)',
    color: '#252525',
    recommendedBudgetSplitPercent: 10,
  },
  phase_5_post_event: {
    name: 'Phase 5: Post-Event & Retention',
    tagline: 'Aftermovie reels, highlight carousels, feedback survey, and next-edition presale list',
    relativeWindow: '1 to 7 days after event',
    color: '#5C6B73',
    recommendedBudgetSplitPercent: 5,
  },
};

/**
 * Calculates concrete calendar dates for all 5 phases given the event start date
 */
export function calculatePhaseDates(eventStartDateStr: string): Record<CampaignPhaseId, { startDate: string; endDate: string }> {
  const eventDate = new Date(eventStartDateStr);
  const baseTime = isNaN(eventDate.getTime()) ? new Date().getTime() + 30 * 86400000 : eventDate.getTime();

  const addDays = (days: number) => {
    const d = new Date(baseTime + days * 86400000);
    return d.toISOString().split('T')[0];
  };

  return {
    phase_1_awareness: {
      startDate: addDays(-45),
      endDate: addDays(-31),
    },
    phase_2_presale: {
      startDate: addDays(-30),
      endDate: addDays(-15),
    },
    phase_3_surge: {
      startDate: addDays(-14),
      endDate: addDays(-1),
    },
    phase_4_day_of: {
      startDate: addDays(0),
      endDate: addDays(0),
    },
    phase_5_post_event: {
      startDate: addDays(1),
      endDate: addDays(7),
    },
  };
}

/**
 * Computes overall campaign completion score (0-100%)
 */
export function calculateCampaignReadiness(tasks: Array<{ status: 'completed' | 'in_progress' | 'scheduled' }>): number {
  if (!tasks || tasks.length === 0) return 0;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  return Math.round(((completed + inProgress * 0.5) / tasks.length) * 100);
}
