import { PostHog } from 'posthog-node';

/**
 * PostHog Server-side Client
 * 
 * Use this for server-side event tracking (API routes, server components)
 */

let posthogClient: PostHog | null = null;

export function getPostHogClient(): PostHog | null {
  if (posthogClient) return posthogClient;

  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.posthog.com';

  if (!apiKey) {
    console.warn('PostHog API key not configured');
    return null;
  }

  posthogClient = new PostHog(apiKey, {
    host: apiHost,
    flushAt: 20, // Flush after 20 events
    flushInterval: 10000, // Flush every 10 seconds
  });

  return posthogClient;
}

/**
 * Track server-side event
 */
export async function trackServerEvent(
  distinctId: string,
  eventName: string,
  properties?: Record<string, any>
): Promise<void> {
  const client = getPostHogClient();
  if (!client) return;

  try {
    client.capture({
      distinctId,
      event: eventName,
      properties,
    });
    
    // Flush immediately for critical events
    if (eventName.includes('error') || eventName.includes('success')) {
      await client.flush();
    }
  } catch (error) {
    console.error('PostHog server tracking error:', error);
  }
}

/**
 * Identify user server-side
 */
export async function identifyUserServer(
  distinctId: string,
  properties?: Record<string, any>
): Promise<void> {
  const client = getPostHogClient();
  if (!client) return;

  try {
    client.identify({
      distinctId,
      properties,
    });
    await client.flush();
  } catch (error) {
    console.error('PostHog server identify error:', error);
  }
}

/**
 * Shutdown PostHog client (call on server shutdown)
 */
export async function shutdownPostHog(): Promise<void> {
  if (posthogClient) {
    await posthogClient.shutdown();
    posthogClient = null;
  }
}

