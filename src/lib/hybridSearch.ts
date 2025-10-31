/**
 * Hybrid Search Library
 * 
 * Combines semantic search (vector similarity) with keyword search (BM25)
 * to provide better search results.
 * 
 * Features:
 * - Semantic search via embeddings
 * - Keyword search via BM25 algorithm
 * - Result fusion and re-ranking
 * - Configurable weights
 */

interface SearchResult {
  id: number;
  content: string;
  metadata: any;
  similarity?: number;
  bm25Score?: number;
  hybridScore?: number;
}

interface HybridSearchConfig {
  semanticWeight: number; // 0-1, default 0.7
  keywordWeight: number;  // 0-1, default 0.3
  minSemanticScore: number; // default 0.2
  minBM25Score: number;     // default 0.1
}

/**
 * BM25 (Best Matching 25) Algorithm
 * 
 * Industry-standard keyword search algorithm used by Elasticsearch, Lucene, etc.
 * 
 * Formula: BM25(D, Q) = Σ IDF(qi) * (f(qi, D) * (k1 + 1)) / (f(qi, D) + k1 * (1 - b + b * |D| / avgdl))
 * 
 * Where:
 * - D = document
 * - Q = query
 * - qi = query term i
 * - f(qi, D) = frequency of qi in D
 * - |D| = length of D
 * - avgdl = average document length
 * - k1 = term frequency saturation (default 1.5)
 * - b = length normalization (default 0.75)
 * - IDF(qi) = inverse document frequency of qi
 */
class BM25 {
  private k1: number = 1.5;
  private b: number = 0.75;
  private documents: string[];
  private avgDocLength: number;
  private docLengths: number[];
  private idfCache: Map<string, number>;

  constructor(documents: string[]) {
    this.documents = documents;
    this.docLengths = documents.map(doc => this.tokenize(doc).length);
    this.avgDocLength = this.docLengths.reduce((a, b) => a + b, 0) / documents.length;
    this.idfCache = new Map();
    this.computeIDF();
  }

  /**
   * Tokenize text into terms (lowercase, remove punctuation)
   */
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(term => term.length > 2); // Remove very short terms
  }

  /**
   * Compute IDF (Inverse Document Frequency) for all terms
   * IDF(term) = log((N - df + 0.5) / (df + 0.5) + 1)
   * where N = total documents, df = document frequency of term
   */
  private computeIDF(): void {
    const termDocFreq = new Map<string, number>();
    
    // Count document frequency for each term
    this.documents.forEach(doc => {
      const uniqueTerms = new Set(this.tokenize(doc));
      uniqueTerms.forEach(term => {
        termDocFreq.set(term, (termDocFreq.get(term) || 0) + 1);
      });
    });

    // Compute IDF for each term
    const N = this.documents.length;
    termDocFreq.forEach((df, term) => {
      const idf = Math.log((N - df + 0.5) / (df + 0.5) + 1);
      this.idfCache.set(term, idf);
    });
  }

  /**
   * Calculate BM25 score for a document given a query
   */
  private scoreSingle(docIndex: number, queryTerms: string[]): number {
    const doc = this.documents[docIndex];
    const docTokens = this.tokenize(doc);
    const docLength = this.docLengths[docIndex];
    
    // Count term frequencies in document
    const termFreq = new Map<string, number>();
    docTokens.forEach(term => {
      termFreq.set(term, (termFreq.get(term) || 0) + 1);
    });

    // Calculate BM25 score
    let score = 0;
    queryTerms.forEach(term => {
      const idf = this.idfCache.get(term) || 0;
      const freq = termFreq.get(term) || 0;
      
      if (freq > 0) {
        const numerator = freq * (this.k1 + 1);
        const denominator = freq + this.k1 * (1 - this.b + this.b * (docLength / this.avgDocLength));
        score += idf * (numerator / denominator);
      }
    });

    return score;
  }

  /**
   * Search documents and return scores
   */
  search(query: string): number[] {
    const queryTerms = this.tokenize(query);
    return this.documents.map((_, index) => this.scoreSingle(index, queryTerms));
  }
}

/**
 * Normalize scores to 0-1 range
 */
function normalizeScores(scores: number[]): number[] {
  const max = Math.max(...scores);
  const min = Math.min(...scores);
  const range = max - min;
  
  if (range === 0) return scores.map(() => 0.5);
  
  return scores.map(score => (score - min) / range);
}

/**
 * Reciprocal Rank Fusion (RRF)
 * 
 * Combines multiple ranked lists into a single ranking.
 * Used by search engines to merge results from different sources.
 * 
 * Formula: RRF(d) = Σ 1 / (k + rank(d))
 * where k is a constant (default 60)
 */
function reciprocalRankFusion(
  semanticResults: SearchResult[],
  keywordResults: SearchResult[],
  k: number = 60
): SearchResult[] {
  const rrfScores = new Map<number, number>();
  const allResults = new Map<number, SearchResult>();

  // Add semantic results
  semanticResults.forEach((result, index) => {
    const rank = index + 1;
    rrfScores.set(result.id, (rrfScores.get(result.id) || 0) + 1 / (k + rank));
    allResults.set(result.id, result);
  });

  // Add keyword results
  keywordResults.forEach((result, index) => {
    const rank = index + 1;
    rrfScores.set(result.id, (rrfScores.get(result.id) || 0) + 1 / (k + rank));
    if (!allResults.has(result.id)) {
      allResults.set(result.id, result);
    }
  });

  // Merge and sort by RRF score
  const merged = Array.from(allResults.values()).map(result => ({
    ...result,
    hybridScore: rrfScores.get(result.id) || 0
  }));

  return merged.sort((a, b) => (b.hybridScore || 0) - (a.hybridScore || 0));
}

/**
 * Weighted Score Fusion
 * 
 * Combines semantic and keyword scores using configurable weights.
 * Simpler than RRF but requires score normalization.
 */
function weightedScoreFusion(
  semanticResults: SearchResult[],
  keywordResults: SearchResult[],
  config: HybridSearchConfig
): SearchResult[] {
  const resultMap = new Map<number, SearchResult>();

  // Add semantic results
  semanticResults.forEach(result => {
    resultMap.set(result.id, {
      ...result,
      hybridScore: (result.similarity || 0) * config.semanticWeight
    });
  });

  // Add/merge keyword results
  keywordResults.forEach(result => {
    const existing = resultMap.get(result.id);
    if (existing) {
      existing.hybridScore = (existing.hybridScore || 0) + 
        (result.bm25Score || 0) * config.keywordWeight;
    } else {
      resultMap.set(result.id, {
        ...result,
        hybridScore: (result.bm25Score || 0) * config.keywordWeight
      });
    }
  });

  // Sort by hybrid score
  return Array.from(resultMap.values())
    .sort((a, b) => (b.hybridScore || 0) - (a.hybridScore || 0));
}

/**
 * Perform hybrid search combining semantic and keyword approaches
 */
export async function hybridSearch(
  query: string,
  documents: SearchResult[],
  config: Partial<HybridSearchConfig> = {}
): Promise<SearchResult[]> {
  const fullConfig: HybridSearchConfig = {
    semanticWeight: config.semanticWeight ?? 0.7,
    keywordWeight: config.keywordWeight ?? 0.3,
    minSemanticScore: config.minSemanticScore ?? 0.2,
    minBM25Score: config.minBM25Score ?? 0.1
  };

  // Semantic results (already have similarity scores)
  const semanticResults = documents
    .filter(doc => (doc.similarity || 0) >= fullConfig.minSemanticScore)
    .sort((a, b) => (b.similarity || 0) - (a.similarity || 0));

  // Keyword search using BM25
  const docContents = documents.map(doc => doc.content);
  const bm25 = new BM25(docContents);
  const bm25Scores = bm25.search(query);
  const normalizedBM25 = normalizeScores(bm25Scores);

  const keywordResults = documents
    .map((doc, index) => ({
      ...doc,
      bm25Score: normalizedBM25[index]
    }))
    .filter(doc => (doc.bm25Score || 0) >= fullConfig.minBM25Score)
    .sort((a, b) => (b.bm25Score || 0) - (a.bm25Score || 0));

  // Combine results using RRF (better for diverse rankings)
  const hybridResults = reciprocalRankFusion(semanticResults, keywordResults);

  return hybridResults;
}

/**
 * Perform hybrid search with weighted fusion (alternative to RRF)
 */
export async function hybridSearchWeighted(
  query: string,
  documents: SearchResult[],
  config: Partial<HybridSearchConfig> = {}
): Promise<SearchResult[]> {
  const fullConfig: HybridSearchConfig = {
    semanticWeight: config.semanticWeight ?? 0.7,
    keywordWeight: config.keywordWeight ?? 0.3,
    minSemanticScore: config.minSemanticScore ?? 0.2,
    minBM25Score: config.minBM25Score ?? 0.1
  };

  // Semantic results
  const semanticResults = documents
    .filter(doc => (doc.similarity || 0) >= fullConfig.minSemanticScore);

  // Keyword search
  const docContents = documents.map(doc => doc.content);
  const bm25 = new BM25(docContents);
  const bm25Scores = bm25.search(query);
  const normalizedBM25 = normalizeScores(bm25Scores);

  const keywordResults = documents
    .map((doc, index) => ({
      ...doc,
      bm25Score: normalizedBM25[index]
    }))
    .filter(doc => (doc.bm25Score || 0) >= fullConfig.minBM25Score);

  // Combine with weighted scores
  const hybridResults = weightedScoreFusion(semanticResults, keywordResults, fullConfig);

  return hybridResults;
}

export { BM25, type SearchResult, type HybridSearchConfig };

