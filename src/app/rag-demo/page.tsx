"use client";

import { useState } from "react";

export default function RAGDemoPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleQuery = async () => {
    if (!query.trim()) {
      setError("Por favor, insira uma pergunta");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/rag/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao processar query");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const examples = [
    "Quais são os serviços da CRSET Solutions?",
    "Como funciona a consultoria em cibersegurança?",
    "Quais são os preços dos serviços?",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              RAG Demo
            </h1>
            <p className="text-gray-600">
              Demonstração do sistema de Retrieval-Augmented Generation
            </p>
          </div>

          <div className="space-y-6">
            {/* Query Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sua Pergunta
              </label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Digite sua pergunta aqui..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
              />
            </div>

            {/* Examples */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Exemplos:
              </p>
              <div className="flex flex-wrap gap-2">
                {examples.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(example)}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleQuery}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? "Processando..." : "Pesquisar"}
            </button>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">
                  <strong>Erro:</strong> {error}
                </p>
              </div>
            )}

            {/* Result */}
            {result && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-green-900 mb-2">
                    Resultado
                  </h3>
                  <div className="space-y-2 text-sm text-green-800">
                    <p>
                      <strong>Status:</strong> {result.ok ? "✅ Sucesso" : "❌ Falha"}
                    </p>
                    <p>
                      <strong>Dimensão do embedding:</strong> {result.dim}
                    </p>
                    <p>
                      <strong>Documentos encontrados:</strong> {result.matches?.length || 0}
                    </p>
                    <p>
                      <strong>Threshold de similaridade:</strong> {result.similarity_threshold}
                    </p>
                  </div>
                </div>

                {result.matches && result.matches.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-green-900 mb-2">
                      Documentos Relevantes:
                    </h4>
                    <div className="space-y-2">
                      {result.matches.map((match: any, idx: number) => (
                        <div
                          key={idx}
                          className="bg-white rounded p-3 border border-green-200"
                        >
                          <p className="text-sm text-gray-700">{match.text}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Similaridade: {(match.score * 100).toFixed(1)}%
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(!result.matches || result.matches.length === 0) && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                    <p className="text-sm text-yellow-800">
                      Nenhum documento relevante encontrado. O sistema está funcional,
                      mas ainda não tem documentos indexados.
                    </p>
                  </div>
                )}

                {/* Raw JSON */}
                <details className="text-xs">
                  <summary className="cursor-pointer text-green-900 font-medium">
                    Ver JSON completo
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-900 text-green-400 rounded overflow-x-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>

          {/* Info Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">
              Sobre este Demo
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✅ Sistema RAG 100% funcional</li>
              <li>✅ Embeddings via OpenAI (text-embedding-3-small)</li>
              <li>✅ Rate limiting: 10 requisições por minuto</li>
              <li>✅ CORS habilitado para testes</li>
              <li>⚠️ Base de conhecimento ainda não populada</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

