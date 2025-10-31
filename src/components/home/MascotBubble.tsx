"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MessageCircle, X, Settings, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MascotBubble() {
  const [isVisible, setIsVisible] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Check localStorage and prefers-reduced-motion on mount
  useEffect(() => {
    const stored = localStorage.getItem('crset_show_mascot');
    if (stored !== null) {
      setIsVisible(stored === 'true');
    } else {
      // Se não há valor no localStorage, garantir que está visível por padrão
      setIsVisible(true);
      localStorage.setItem('crset_show_mascot', 'true');
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Handle Esc key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && panelRef.current && !panelRef.current.contains(e.target as Node) && 
          buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleVisibility = () => {
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
    localStorage.setItem('crset_show_mascot', newVisibility.toString());
    if (!newVisibility) {
      setIsOpen(false);
    }
  };

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={toggleVisibility}
          size="sm"
          variant="outline"
          className="rounded-full p-2"
          aria-label="Mostrar assistente"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  const tips = [
    {
      title: "Como começar?",
      href: "/servicos",
      external: false
    },
    {
      title: "Preços",
      href: "/precos", 
      external: false
    },
    {
      title: "Processo",
      href: "#como-trabalhamos",
      external: false
    },
    {
      title: "Demo AGI",
      href: "https://agi.crsetsolutions.com",
      external: true
    }
  ];

  return (
    <div 
      className="fixed bottom-6 right-6 z-40"
      role="complementary"
      aria-label="Assistente"
    >
      {/* Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className={`absolute bottom-16 right-0 w-64 rounded-lg border bg-background/95 backdrop-blur-sm shadow-lg p-4 ${
            prefersReducedMotion ? '' : 'animate-in slide-in-from-bottom-2 duration-200'
          }`}
          aria-live="polite"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Dicas rápidas</h3>
            <div className="flex gap-1">
              <Button
                onClick={toggleVisibility}
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                aria-label="Ocultar assistente"
              >
                <Settings className="h-3 w-3" />
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                aria-label="Fechar painel"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            {tips.map((tip, index) => (
              <Link
                key={index}
                href={tip.href}
                className="flex items-center justify-between rounded-md p-2 text-sm hover:bg-accent color-transition interactive"
                {...(tip.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <span>{tip.title}</span>
                {tip.external && (
                  <ExternalLink className="h-3 w-3 text-muted-foreground icon-hover" aria-hidden="true" />
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <Button
        ref={buttonRef}
        onClick={togglePanel}
        size="lg"
        className="rounded-full h-12 w-12 p-0 shadow-lg icon-hover"
        aria-expanded={isOpen}
        aria-controls={isOpen ? "mascot-panel" : undefined}
        aria-label={isOpen ? "Fechar assistente" : "Abrir assistente"}
      >
        <MessageCircle className="h-6 w-6" aria-hidden="true" />
      </Button>
    </div>
  );
}

