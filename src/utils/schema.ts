/**
 * EventIQ Schema.org Event JSON-LD Structured Data Utilities
 * Strictly conforms to Schema.org Event specification with IST timezone & INR pricing
 */

export interface EventSchemaInput {
  name: string;
  description: string;
  startDate: string; // ISO 8601 or YYYY-MM-DDTHH:mm
  endDate: string;
  venueName: string;
  addressLocality: string;
  addressRegion?: string;
  postalCode?: string;
  streetAddress?: string;
  addressCountry?: string;
  organizerName: string;
  organizerUrl?: string;
  eventStatus?: 'EventScheduled' | 'EventPostponed' | 'EventCancelled' | 'EventMovedOnline';
  eventAttendanceMode?: 'OfflineEventAttendanceMode' | 'OnlineEventAttendanceMode' | 'MixedEventAttendanceMode';
  imageUrl?: string;
  offers: Array<{
    name: string;
    price: number;
    priceCurrency?: string;
    url?: string;
    availability?: 'InStock' | 'SoldOut' | 'PreOrder';
    validFrom?: string;
  }>;
  performers?: Array<{
    name: string;
    type?: 'Person' | 'PerformingGroup';
  }>;
}

/**
 * Format date to ISO 8601 string with Indian Standard Time offset (+05:30) if offset is missing
 */
export function formatToIST(dateStr: string): string {
  if (!dateStr) return '';
  if (dateStr.includes('+') || dateStr.endsWith('Z')) {
    return dateStr;
  }
  return `${dateStr}:00+05:30`;
}

/**
 * Generates valid Schema.org Event JSON-LD representation
 */
export function generateEventJsonLd(event: EventSchemaInput): Record<string, any> {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    'name': event.name.trim(),
    'description': event.description.trim(),
    'startDate': formatToIST(event.startDate),
    'endDate': formatToIST(event.endDate),
    'eventStatus': `https://schema.org/${event.eventStatus || 'EventScheduled'}`,
    'eventAttendanceMode': `https://schema.org/${event.eventAttendanceMode || 'OfflineEventAttendanceMode'}`,
    'location': {
      '@type': 'Place',
      'name': event.venueName,
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': event.streetAddress || event.venueName,
        'addressLocality': event.addressLocality,
        'addressRegion': event.addressRegion || event.addressLocality,
        'postalCode': event.postalCode || '400001',
        'addressCountry': event.addressCountry || 'IN',
      },
    },
    'organizer': {
      '@type': 'Organization',
      'name': event.organizerName,
      'url': event.organizerUrl || 'https://eventiq.app',
    },
  };

  if (event.imageUrl) {
    schema['image'] = [event.imageUrl];
  }

  if (event.performers && event.performers.length > 0) {
    schema['performer'] = event.performers.map(p => ({
      '@type': p.type || 'PerformingGroup',
      'name': p.name,
    }));
  }

  if (event.offers && event.offers.length > 0) {
    schema['offers'] = event.offers.map(offer => ({
      '@type': 'Offer',
      'name': offer.name,
      'price': offer.price,
      'priceCurrency': offer.priceCurrency || 'INR',
      'availability': `https://schema.org/${offer.availability || 'InStock'}`,
      'url': offer.url || event.organizerUrl || 'https://eventiq.app',
      'validFrom': offer.validFrom ? formatToIST(offer.validFrom) : undefined,
    }));
  }

  return schema;
}

/**
 * Validates generated JSON-LD for essential Google Rich Snippets requirements
 */
export function validateEventJsonLd(schema: Record<string, any>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (schema['@context'] !== 'https://schema.org') {
    errors.push("Missing or invalid '@context' (must be 'https://schema.org')");
  }
  if (schema['@type'] !== 'Event') {
    errors.push("Missing or invalid '@type' (must be 'Event')");
  }
  if (!schema.name) {
    errors.push('Missing required property: name');
  }
  if (!schema.startDate) {
    errors.push('Missing required property: startDate');
  }
  if (!schema.location || !schema.location.name) {
    errors.push('Missing required property: location.name');
  }
  if (!schema.offers || !Array.isArray(schema.offers) || schema.offers.length === 0) {
    errors.push('Offers array is empty; at least one ticket tier is recommended for rich snippets');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
