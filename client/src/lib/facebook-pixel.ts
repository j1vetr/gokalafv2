declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
  }
}

const PIXEL_ID = '33582373151376249';

function generateEventId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

function getUserData() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {};
  }
  return {
    client_user_agent: navigator.userAgent,
  };
}

async function sendToServer(eventName: string, eventId: string, data: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  
  try {
    await fetch('/api/facebook/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        eventName,
        eventId,
        eventSourceUrl: window.location.href,
        userData: getUserData(),
        customData: data,
      }),
    });
  } catch (error) {
    console.error('Facebook CAPI error:', error);
  }
}

export function trackViewContent(contentName: string, contentCategory: string, value?: number, currency = 'TRY') {
  const eventId = generateEventId();
  const data: Record<string, unknown> = {
    content_name: contentName,
    content_category: contentCategory,
    content_type: 'product',
  };
  if (value) {
    data.value = value;
    data.currency = currency;
  }
  
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'ViewContent', data, { eventID: eventId });
  }
  sendToServer('ViewContent', eventId, data);
}

export function trackAddToCart(contentName: string, contentId: string, value: number, currency = 'TRY') {
  const eventId = generateEventId();
  const data = {
    content_name: contentName,
    content_ids: [contentId],
    content_type: 'product',
    value,
    currency,
  };
  
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'AddToCart', data, { eventID: eventId });
  }
  sendToServer('AddToCart', eventId, data);
}

export function trackInitiateCheckout(contentIds: string[], value: number, numItems: number, currency = 'TRY') {
  const eventId = generateEventId();
  const data = {
    content_ids: contentIds,
    content_type: 'product',
    value,
    currency,
    num_items: numItems,
  };
  
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'InitiateCheckout', data, { eventID: eventId });
  }
  sendToServer('InitiateCheckout', eventId, data);
}

export function trackCompleteRegistration(status = 'registered') {
  const eventId = generateEventId();
  const data = {
    status,
    content_name: 'Kullanıcı Kaydı',
  };
  
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'CompleteRegistration', data, { eventID: eventId });
  }
  sendToServer('CompleteRegistration', eventId, data);
}

export function trackPurchase(orderId: string, value: number, contentName: string, contentId: string, currency = 'TRY') {
  const eventId = generateEventId();
  const data = {
    content_name: contentName,
    content_ids: [contentId],
    content_type: 'product',
    value,
    currency,
    order_id: orderId,
  };
  
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Purchase', data, { eventID: eventId });
  }
  sendToServer('Purchase', eventId, data);
}
