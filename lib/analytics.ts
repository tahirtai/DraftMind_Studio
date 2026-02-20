
type AnalyticsEvent =
    | 'ai_generation_success'
    | 'ai_limit_hit'
    | 'upgrade_clicked'
    | 'document_generated'
    | 'ai_error';

export const trackEvent = (event: AnalyticsEvent, properties?: Record<string, any>) => {
    // Log to console for development
    if (import.meta.env.DEV) {
        console.log(`[Analytics] ${event}`, properties);
    }

    // In production, this would send to your analytics provider (e.g. PostHog, Google Analytics)
    // window.gtag?.('event', event, properties);
    // window.posthog?.capture(event, properties);
};
