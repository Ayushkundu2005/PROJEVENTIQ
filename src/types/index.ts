/**
 * EventIQ Core Domain Types
 */

export type UserRole = 'organizer' | 'marketing_lead' | 'agency' | 'creator';

export type { KnowledgeDocument, KnowledgeChunk } from '../utils/knowledge';

export interface User {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: UserRole;
  avatarUrl?: string;
}

export type EventCategory =
  | 'music_festival'
  | 'tech_conference'
  | 'cultural_fest'
  | 'food_and_beverage'
  | 'art_and_theater'
  | 'sports_and_fitness'
  | 'nightlife'
  | 'business_summit';

export type LanguageCode = 'en' | 'hi' | 'ta' | 'te';

export interface TicketCategory {
  id: string;
  name: string;
  priceInr: number;
  capacity: number;
  soldCount: number;
  description: string;
  isVip?: boolean;
}

export interface EventData {
  id: string;
  userId: string;
  name: string;
  category: EventCategory;
  genre: string;
  description: string;
  venueName: string;
  city: string;
  state: string;
  address: string;
  pincode: string;
  startDate: string;
  endDate: string;
  targetAudience: string;
  targetAgeGroup: string;
  promotionalObjective: string;
  brandIdentity: string;
  preferredLanguage: LanguageCode;
  bookingUrl: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    twitter?: string;
  };
  ticketTiers: TicketCategory[];
  presaleCode?: string;
  presaleDiscountPercent?: number;
  bannerImage?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreativeFormat = 'social_post' | 'story_vertical' | 'event_poster' | 'web_banner' | 'vip_pass';

export type AestheticTheme =
  | 'editorial_swiss'
  | 'minimal_monochrome'
  | 'neon_underground'
  | 'luxury_black_gold'
  | 'warm_contemporary'
  | 'retro_futuristic'
  | 'elegant_classical'
  | 'festival_energy';

export interface CreativeAsset {
  id: string;
  eventId: string;
  title: string;
  format: CreativeFormat;
  theme: AestheticTheme;
  headline: string;
  subheadline: string;
  eventDate: string;
  venueText: string;
  ticketText: string;
  ctaText: string;
  accentColor: string;
  bgColor: string;
  textColor: string;
  imageUrl?: string;
  qrCodeUrl?: string;
  createdAt: string;
}

export type SocialPlatform = 'instagram' | 'tiktok' | 'youtube_shorts' | 'facebook';

export interface SocialContentItem {
  id: string;
  eventId: string;
  platform: SocialPlatform;
  contentType: 'caption' | 'carousel' | 'reel_hook' | 'video_script' | 'announcement';
  title: string;
  hook: string;
  body: string;
  callToAction: string;
  hashtags: string[];
  campaignPhase: 'awareness' | 'presale' | 'price_surge' | 'day_of' | 'post_event';
  scheduledDate?: string;
  status: 'draft' | 'scheduled' | 'published';
  metaMediaId?: string;
  createdAt: string;
}

export interface ViralMatrixRow {
  id: string;
  eventId: string;
  platform: SocialPlatform;
  campaignPhase: string;
  targetAudienceSegment: string;
  angle: string;
  hook: string;
  contentConcept: string;
  suggestedCta: string;
  estimatedViralityScore: number; // 1-100
  publishingStatus: 'idea' | 'scripted' | 'ready' | 'published';
}

export interface KeywordAnalysis {
  keyword: string;
  intent: 'transactional' | 'informational' | 'navigational' | 'commercial';
  cluster: string;
  difficultyScore: number; // 0-100
  estimatedMonthlySearches: number; // Disclaimed as AI estimate unless connected
  isLocalIndianQuery: boolean;
  targetLocation: string;
  suggestedContentAnchor: string;
}

export interface SeoIntelligenceResult {
  metaTitle: string;
  metaDescription: string;
  primaryKeywords: KeywordAnalysis[];
  secondaryKeywords: KeywordAnalysis[];
  headingStructure: {
    h1: string;
    h2s: string[];
    h3s: string[];
  };
  googleAnswerBoxFaqs: Array<{
    question: string;
    answerSnippet: string;
  }>;
  localSeoTips: string[];
  isAiEstimated: boolean;
}

export interface ConciergeMessage {
  id: string;
  sender: 'attendee' | 'concierge';
  text: string;
  language: LanguageCode;
  confidenceScore?: number;
  sources?: Array<{
    documentTitle: string;
    section: string;
    excerpt: string;
  }>;
  timestamp: string;
}

export interface ConnectedInstagramAccount {
  connected: boolean;
  username?: string;
  accountType?: 'BUSINESS' | 'CREATOR' | 'PERSONAL';
  instagramUserId?: string;
  profilePictureUrl?: string;
  followersCount?: number;
  connectedAt?: string;
  tokenExpiresAt?: string;
  permissionsGranted?: string[];
  requiresAppReviewNotes?: string[];
}

export interface ABTestExperiment {
  id: string;
  eventId: string;
  element: 'caption' | 'headline' | 'cta' | 'creative_theme' | 'subject_line';
  variantA: string;
  variantB: string;
  impressionsA: number;
  impressionsB: number;
  clicksA: number;
  clicksB: number;
  conversionsA: number;
  conversionsB: number;
  confidenceWinner?: 'A' | 'B' | 'insufficient_data';
  aiRecommendation?: string;
}
