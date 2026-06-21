"use client";

import { track } from "@vercel/analytics";

type ConversionEventName =
  | "blog_to_service_click"
  | "calendly_booking"
  | "calendly_date_selected"
  | "contact_form_submit"
  | "cta_click"
  | "demo_call_form_submit"
  | "quote_request_click";

type ConversionEventProperties = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (
      command: "event",
      eventName: string,
      parameters?: Record<string, string | number | boolean>,
    ) => void;
  }
}

function cleanProperties(properties: ConversionEventProperties = {}) {
  return Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined && value !== null),
  ) as Record<string, string | number | boolean>;
}

export function trackConversionEvent(
  name: ConversionEventName,
  properties: ConversionEventProperties = {},
) {
  const cleanedProperties = cleanProperties(properties);

  track(name, cleanedProperties);

  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", name, cleanedProperties);
}

export function isInternalServiceHref(href: string) {
  if (href.startsWith("/services")) {
    return true;
  }

  if (typeof window === "undefined") {
    return false;
  }

  try {
    const url = new URL(href, window.location.origin);
    return url.origin === window.location.origin && url.pathname.startsWith("/services");
  } catch {
    return false;
  }
}
