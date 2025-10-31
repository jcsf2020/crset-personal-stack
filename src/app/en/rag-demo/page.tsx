'use client';

import { useState } from 'react';

export default function RAGDemoPageEN() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const exampleQueries = [
    "What are CRSET Solutions' services?",
    "How does cybersecurity consulting work?",
    "What are the service prices?"
  ];

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/rag/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, language: 'en' }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ ok: false, error: 'Failed to fetch results' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">RAG Demo - Intelligent Search</h1>
            <p className="text-xl">
              Test our semantic search system
            </p>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Search Box */}
            <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
              <label htmlFor="query" className="block font-bold text-lg mb-4">
                Ask a question:
              </label>
              <div className="flex gap-4">
                <input
                  type="text"
                  id="query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Type your question..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>

              {/* Example Queries */}
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-2">Examples:</p>
                <div className="flex flex-wrap gap-2">
                  {exampleQueries.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setQuery(example)}
                      className="text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results */}
            {result && (
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6">Result</h2>
                
                <div className="space-y-4">
                  <div>
                    <span className="font-bold">Status: </span>
                    <span className={result.ok ? 'text-green-600' : 'text-red-600'}>
                      {result.ok ? '✅ Success' : '❌ Error'}
                    </span>
                  </div>

                  {result.dim && (
                    <div>
                      <span className="font-bold">Embedding dimension: </span>
                      <span>{result.dim}</span>
                    </div>
                  )}

                  {result.documents && (
                    <>
                      <div>
                        <span className="font-bold">Documents found: </span>
                        <span>{result.documents.length}</span>
                      </div>

                      {result.documents.length > 0 && (
                        <div className="mt-6">
                          <h3 className="font-bold text-lg mb-4">Relevant Documents:</h3>
                          <div className="space-y-4">
                            {result.documents.map((doc: any, index: number) => (
                              <div key={index} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-bold">{doc.metadata?.title || 'Document'}</h4>
                                  <span className="text-sm text-gray-600">
                                    Similarity: {(doc.similarity * 100).toFixed(1)}%
                                  </span>
                                </div>
                                <p className="text-gray-600 text-sm mb-2">{doc.content}</p>
                                {doc.metadata?.url && (
                                  <a
                                    href={doc.metadata.url}
                                    className="text-blue-600 text-sm hover:underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    View source →
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {result.documents.length === 0 && (
                        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-yellow-800">
                            No relevant documents found. The system is functional, but doesn't have indexed documents yet.
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {result.error && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800">{result.error}</p>
                    </div>
                  )}

                  {/* Full JSON */}
                  <details className="mt-6">
                    <summary className="cursor-pointer font-bold text-blue-600 hover:text-blue-700">
                      View full JSON
                    </summary>
                    <pre className="mt-4 p-4 bg-gray-100 rounded-lg overflow-x-auto text-sm">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </details>
                </div>
              </div>
            )}

            {/* About Section */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4">About this Demo</h3>
              <ul className="space-y-2 text-sm">
                <li>✅ 100% functional RAG system</li>
                <li>✅ Embeddings via OpenAI (text-embedding-3-small)</li>
                <li>✅ Rate limiting: 10 requests per minute</li>
                <li>✅ CORS enabled for testing</li>
                <li>⚠️ Knowledge base: 17 documents in Portuguese (English coming soon)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

