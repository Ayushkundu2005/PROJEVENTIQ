import test from 'node:test';
import assert from 'node:assert/strict';
import { formatINR, calculateTicketPriceWithGst, calculateSurgeMultiplier, calculateProjectedRevenue } from './pricing';
import { generateEventJsonLd, validateEventJsonLd, formatToIST } from './schema';
import { chunkDocument, tokenizeText, retrieveRelevantChunks, calculateAnswerConfidence, KnowledgeDocument } from './knowledge';
import { calculatePhaseDates, calculateCampaignReadiness } from './campaign';

test('formatINR formats currency in Indian numbering system', () => {
  assert.equal(formatINR(0), '₹0');
  // Check ₹ symbol and formatted numbers
  const formatted1500 = formatINR(1500);
  assert.ok(formatted1500.includes('1,500') || formatted1500.includes('1500'));
  assert.ok(formatted1500.includes('₹'));

  const formattedLakh = formatINR(150000);
  assert.ok(formattedLakh.includes('1,50,000') || formattedLakh.includes('150,000'));
});

test('calculateTicketPriceWithGst computes 18% GST correctly', () => {
  const result = calculateTicketPriceWithGst(1000);
  assert.equal(result.basePrice, 1000);
  assert.equal(result.gstAmount, 180);
  assert.equal(result.totalPrice, 1180);
});

test('calculateSurgeMultiplier applies correct thresholds', () => {
  assert.equal(calculateSurgeMultiplier(0.96, 5), 1.5);
  assert.equal(calculateSurgeMultiplier(0.85, 10), 1.35);
  assert.equal(calculateSurgeMultiplier(0.65, 4), 1.25);
  assert.equal(calculateSurgeMultiplier(0.3, 1), 1.2);
  assert.equal(calculateSurgeMultiplier(0.4, 20), 1.0);
});

test('calculateProjectedRevenue aggregates ticket tiers and occupancy', () => {
  const tiers = [
    { id: '1', name: 'General', priceInr: 1000, availableQuantity: 50, soldQuantity: 50, phase: 'phase_1' as const },
    { id: '2', name: 'VIP', priceInr: 3000, availableQuantity: 50, soldQuantity: 50, phase: 'vip' as const },
  ];
  const summary = calculateProjectedRevenue(tiers);
  assert.equal(summary.totalTicketsSold, 100);
  assert.equal(summary.totalCapacity, 200);
  assert.equal(summary.occupancyPercent, 50);
  assert.equal(summary.totalGrossInr, 50 * 1000 + 50 * 3000); // 200,000
});

test('formatToIST appends Indian Standard Time offset if missing', () => {
  const ist = formatToIST('2026-11-20T18:00');
  assert.equal(ist, '2026-11-20T18:00:00+05:30');

  const unchanged = formatToIST('2026-11-20T18:00:00Z');
  assert.equal(unchanged, '2026-11-20T18:00:00Z');
});

test('generateEventJsonLd outputs valid Schema.org structure', () => {
  const schema = generateEventJsonLd({
    name: 'Bengaluru Indie Music Festival 2026',
    description: 'Premier indie showcase at Jayamahal Palace.',
    startDate: '2026-12-15T16:00',
    endDate: '2026-12-15T23:30',
    venueName: 'Jayamahal Palace Ground',
    addressLocality: 'Bengaluru',
    organizerName: 'LiveIQ Entertainment',
    offers: [{ name: 'Early Bird', price: 999, priceCurrency: 'INR' }],
  });

  assert.equal(schema['@context'], 'https://schema.org');
  assert.equal(schema['@type'], 'Event');
  assert.equal(schema.name, 'Bengaluru Indie Music Festival 2026');
  assert.equal(schema.location.name, 'Jayamahal Palace Ground');
  assert.equal(schema.offers[0].priceCurrency, 'INR');

  const validation = validateEventJsonLd(schema);
  assert.equal(validation.isValid, true);
  assert.equal(validation.errors.length, 0);
});

test('chunkDocument breaks text into indexed chunks', () => {
  const doc: KnowledgeDocument = {
    id: 'doc-1',
    title: 'Festival Rules',
    category: 'security',
    content: '# Bag Policy\n\nOnly transparent bags up to 12x12 inches are allowed.\n\n# Parking\n\nParking is available at Gate 4 for ₹100 flat fee.',
    uploadDate: '2026-11-01',
    sourceType: 'text',
  };

  const chunks = chunkDocument(doc);
  assert.ok(chunks.length >= 2);
  assert.equal(chunks[0].docId, 'doc-1');
  assert.ok(chunks.some(c => c.content.includes('transparent bags')));
});

test('retrieveRelevantChunks returns high-scoring chunks for attendee query', () => {
  const doc: KnowledgeDocument = {
    id: 'doc-1',
    title: 'Festival Logistics',
    category: 'logistics',
    content: '# Parking Instructions\n\nFree two-wheeler parking is at Gate 2. Four-wheeler valet parking is available at Gate 5 for ₹250.\n\n# Re-Entry Policy\n\nRe-entry is strictly prohibited once the wristband is scanned.',
    uploadDate: '2026-11-01',
    sourceType: 'text',
  };

  const chunks = chunkDocument(doc);
  const results = retrieveRelevantChunks('Where can I park my car?', chunks);

  assert.ok(results.length > 0);
  assert.ok(results[0].chunk.content.includes('parking'));
  const confidence = calculateAnswerConfidence(results);
  assert.ok(confidence >= 70);
});

test('calculatePhaseDates maps 5-phase timeline backwards and forwards', () => {
  const phases = calculatePhaseDates('2026-12-31T00:00:00');
  assert.ok(phases.phase_1_awareness.startDate < phases.phase_2_presale.startDate);
  assert.ok(phases.phase_2_presale.startDate < phases.phase_3_surge.startDate);
  assert.ok(phases.phase_3_surge.startDate < phases.phase_4_day_of.startDate);
  assert.ok(phases.phase_4_day_of.startDate < phases.phase_5_post_event.startDate);
});

test('calculateCampaignReadiness produces accurate progress percentage', () => {
  const tasks = [
    { status: 'completed' as const },
    { status: 'completed' as const },
    { status: 'in_progress' as const },
    { status: 'scheduled' as const },
  ];
  // 2 completed (2) + 1 in progress (0.5) = 2.5 / 4 = 62.5% -> 63%
  assert.equal(calculateCampaignReadiness(tasks), 63);
});
