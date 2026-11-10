/**
 * EventIQ Knowledge Hub Chunker and Relevance Ranker
 * Deconstructs uploaded event policies, FAQs, and logistics documents into indexed chunks
 * with exact citation tracking and confidence scoring.
 */

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: 'logistics' | 'schedule' | 'security' | 'ticketing' | 'vip' | 'general';
  content: string;
  uploadDate: string;
  sourceType: 'pdf' | 'text' | 'faq';
}

export interface KnowledgeChunk {
  chunkId: string;
  docId: string;
  docTitle: string;
  category: string;
  content: string;
  sectionHeader?: string;
  pageOrIndex: number;
}

export interface RetrievalResult {
  chunk: KnowledgeChunk;
  score: number;
  highlightWords: string[];
}

/**
 * Splits document content into coherent chunks bounded by paragraphs or size
 */
export function chunkDocument(doc: KnowledgeDocument, maxChunkLength = 400): KnowledgeChunk[] {
  const text = doc.content.trim();
  if (!text) return [];

  // Split on double newlines (paragraphs) or markdown headers
  const paragraphs = text.split(/\n\s*\n/);
  const chunks: KnowledgeChunk[] = [];
  let currentChunk = '';
  let currentHeader = 'General Information';
  let chunkIndex = 1;

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    // Check if this paragraph is a section header (e.g., "# Bag Policy" or "ENTRY RULES:")
    if (trimmed.startsWith('#') || trimmed.toUpperCase() === trimmed && trimmed.length < 50) {
      currentHeader = trimmed.replace(/^[#\s]+/, '');
      if (currentChunk.length > 50) {
        chunks.push({
          chunkId: `${doc.id}-chk-${chunkIndex++}`,
          docId: doc.id,
          docTitle: doc.title,
          category: doc.category,
          content: currentChunk.trim(),
          sectionHeader: currentHeader,
          pageOrIndex: chunkIndex,
        });
        currentChunk = '';
      }
      continue;
    }

    if (currentChunk.length + trimmed.length > maxChunkLength && currentChunk.length > 100) {
      chunks.push({
        chunkId: `${doc.id}-chk-${chunkIndex++}`,
        docId: doc.id,
        docTitle: doc.title,
        category: doc.category,
        content: currentChunk.trim(),
        sectionHeader: currentHeader,
        pageOrIndex: chunkIndex,
      });
      currentChunk = trimmed;
    } else {
      currentChunk = currentChunk ? `${currentChunk}\n\n${trimmed}` : trimmed;
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push({
      chunkId: `${doc.id}-chk-${chunkIndex++}`,
      docId: doc.id,
      docTitle: doc.title,
      category: doc.category,
      content: currentChunk.trim(),
      sectionHeader: currentHeader,
      pageOrIndex: chunkIndex,
    });
  }

  return chunks;
}

/**
 * Tokenizes query into normalized searchable terms
 */
export function tokenizeText(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 2 && !['the', 'and', 'for', 'are', 'with', 'from', 'what', 'when', 'where', 'how', 'can', 'is'].includes(token));
}

/**
 * Searches and ranks knowledge chunks based on query terms with BM25-like weighting
 */
export function retrieveRelevantChunks(query: string, allChunks: KnowledgeChunk[], topK = 3): RetrievalResult[] {
  const queryTokens = tokenizeText(query);
  if (queryTokens.length === 0 || allChunks.length === 0) return [];

  const scored: RetrievalResult[] = [];

  for (const chunk of allChunks) {
    const chunkTokens = tokenizeText(`${chunk.sectionHeader || ''} ${chunk.content}`);
    const matchedTokens: string[] = [];
    let score = 0;

    for (const qToken of queryTokens) {
      const matchCount = chunkTokens.filter(t => t === qToken || t.includes(qToken) || qToken.includes(t)).length;
      if (matchCount > 0) {
        matchedTokens.push(qToken);
        // Header matches carry higher weight
        const inHeader = (chunk.sectionHeader || '').toLowerCase().includes(qToken);
        score += matchCount * 1.5 + (inHeader ? 3.0 : 0);
      }
    }

    if (score > 0) {
      scored.push({
        chunk,
        score,
        highlightWords: Array.from(new Set(matchedTokens)),
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

/**
 * Calculates a confidence metric (0 to 100%) for attendee answers
 */
export function calculateAnswerConfidence(retrievals: RetrievalResult[]): number {
  if (retrievals.length === 0) return 0;
  const bestScore = retrievals[0].score;
  if (bestScore >= 5) return 96;
  if (bestScore >= 3) return 88;
  if (bestScore >= 1.5) return 74;
  return 48;
}
