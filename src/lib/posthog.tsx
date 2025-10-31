'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * PostHog Analytics Provider
 * 
 * Features:
 * - Page view tracking
 * - Event tracking
 * - Feature flags
 * - Session replay
 * - User identification
 */

// Initialize PostHog only on client-side
if (typeof window !== 'undefined') {
  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.posthog.com';

  if (apiKey) {
    posthog.init(apiKey, {
      api_host: apiHost,
      person_profiles: 'identified_only', // Only create profiles for identified users
      capture_pageview: false, // We'll handle this manually
      capture_pageleave: true,
      autocapture: {
        dom_event_allowlist: ['click'], // Only capture clicks
        url_allowlist: [window.location.origin], // Only capture on our domain
        element_allowlist: ['button', 'a'], // Only capture buttons and links
      },
      session_recording: {
        maskAllInputs: true, // Mask all input fields for privacy
        maskTextSelector: '.sensitive', // Mask elements with .sensitive class
      },
      loaded: (posthog) => {
        // Development mode
        if (process.env.NODE_ENV === 'development') {
          posthog.debug();
        }
      },
    });
  }
}

/**
 * PostHog Provider Component
 * Wraps the app to provide PostHog context
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <PHProvider client={posthog}>{children}</PHProvider>;
}

/**
 * Page View Tracker
 * Automatically tracks page views on route changes
 */
export function PostHogPageView(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = url + '?' + searchParams.toString();
      }
      
      posthog.capture('$pageview', {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

/**
 * Track custom events
 */
export function trackEvent(
  eventName: string,
  properties?: Record<string, any>
) {
  if (posthog) {
    posthog.capture(eventName, properties);
  }
}

/**
 * Identify user
 */
export function identifyUser(
  userId: string,
  properties?: Record<string, any>
) {
  if (posthog) {
    posthog.identify(userId, properties);
  }
}

/**
 * Reset user (on logout)
 */
export function resetUser() {
  if (posthog) {
    posthog.reset();
  }
}

/**
 * Check if feature flag is enabled
 */
export function isFeatureEnabled(flagKey: string): boolean {
  if (!posthog) return false;
  return posthog.isFeatureEnabled(flagKey) || false;
}

/**
 * Get feature flag value
 */
export function getFeatureFlag(flagKey: string): string | boolean | undefined {
  if (!posthog) return undefined;
  return posthog.getFeatureFlag(flagKey);
}

/**
 * Common event names (for consistency)
 */
export const Events = {
  // Navigation
  PAGE_VIEW: '$pageview',
  
  // RAG
  RAG_QUERY: 'rag_query',
  RAG_QUERY_SUCCESS: 'rag_query_success',
  RAG_QUERY_ERROR: 'rag_query_error',
  RAG_RESULT_CLICKED: 'rag_result_clicked',
  
  // Contact
  CONTACT_FORM_SUBMITTED: 'contact_form_submitted',
  CONTACT_FORM_SUCCESS: 'contact_form_success',
  CONTACT_FORM_ERROR: 'contact_form_error',
  
  // Chat
  CHAT_OPENED: 'chat_opened',
  CHAT_MESSAGE_SENT: 'chat_message_sent',
  CHAT_CLOSED: 'chat_closed',
  
  // Pricing
  PRICING_PLAN_VIEWED: 'pricing_plan_viewed',
  PRICING_CTA_CLICKED: 'pricing_cta_clicked',
  
  // General
  BUTTON_CLICKED: 'button_clicked',
  LINK_CLICKED: 'link_clicked',
  ERROR_OCCURRED: 'error_occurred',
} as const;

/**
 * Feature flag keys (for consistency)
 */
export const FeatureFlags = {
  HYBRID_RAG: 'hybrid_rag',
  CHAT_ENABLED: 'chat_enabled',
  NEW_PRICING: 'new_pricing',
  BETA_FEATURES: 'beta_features',
} as const;

export default posthog;

