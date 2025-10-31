"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
};

type ChatState = 'loading' | 'unauthorized' | 'authorized' | 'error';

export default function ChatWidget() {
  const [state, setState] = useState<ChatState>('loading');
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  // Check authorization on mount
  useEffect(() => {
    checkAuthorization();
  }, []);

  async function checkAuthorization() {
    try {
      const response = await fetch('/api/flags/chat', {
        credentials: 'include',
        cache: 'no-store'
      });
      
      if (!response.ok) {
        setState('error');
        return;
      }

      const data = await response.json();
      setState(data.allowed ? 'authorized' : 'unauthorized');
    } catch (error) {
      console.error('Failed to check chat authorization:', error);
      setState('error');
    }
  }

  async function sendMessage() {
    if (!input.trim() || sending) return;
    
    const messageText = input.trim();
    const userMessage: ChatMessage = {
      role: 'user',
      content: messageText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSending(true);

    try {
      const response = await fetch('/api/agi/chat', {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: messageText })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.reply || 'Desculpa, não consegui processar a tua mensagem.',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Erro de ligação. Tenta novamente.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setSending(false);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  // WhatsApp fallback
  const waBase = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER 
    ? `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}` 
    : "https://wa.me/351914423688";
  const waUrl = `${waBase}?text=${encodeURIComponent('Olá CRSET, preciso de ajuda (chat-widget)')}`;

  // Floating Action Button
  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50 flex gap-2">
        {state === 'authorized' && (
          <Button
            onClick={() => setIsOpen(true)}
            className="crset-chat-fab rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            size="lg"
            aria-label="Abrir chat AGI"
          >
            💬 Chat AGI
          </Button>
        )}
        <Button
          asChild
          variant="secondary"
          className="rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          size="lg"
        >
          <a 
            href={waUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Contactar via WhatsApp"
          >
            📱 WhatsApp
          </a>
        </Button>
      </div>
    );
  }

  // Chat Window
  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 h-96 bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">Chat AGI</h3>
        <Button
          onClick={() => setIsOpen(false)}
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          aria-label="Fechar chat"
        >
          ✕
        </Button>
      </div>

      {/* Content based on state */}
      {state === 'loading' && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            A verificar autorização...
          </div>
        </div>
      )}

      {state === 'error' && (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center text-red-500">
            <p className="mb-2">Erro de ligação</p>
            <Button onClick={checkAuthorization} size="sm">
              Tentar novamente
            </Button>
          </div>
        </div>
      )}

      {state === 'unauthorized' && (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Chat privado. Faz login para aceder.
            </p>
            <Button asChild size="sm">
              <a href="/chat-login" target="_blank" rel="noopener noreferrer">
                Fazer Login
              </a>
            </Button>
          </div>
        </div>
      )}

      {state === 'authorized' && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <p>👋 Olá! Como posso ajudar?</p>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white crset-chat-assistant'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg text-sm text-gray-500">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                id="chat-message-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escreve uma mensagem..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                disabled={sending}
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || sending}
                size="sm"
              >
                {sending ? '...' : 'Enviar'}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
