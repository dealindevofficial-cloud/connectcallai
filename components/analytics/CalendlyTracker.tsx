"use client";

import { useEffect } from "react";
import { trackConversionEvent } from "@/lib/analytics/conversions";

type CalendlyMessage = {
  event?: string;
  payload?: {
    event?: {
      uri?: string;
    };
    invitee?: {
      uri?: string;
    };
  };
};

function isCalendlyEvent(data: unknown): data is CalendlyMessage {
  return (
    typeof data === "object" &&
    data !== null &&
    "event" in data &&
    typeof (data as CalendlyMessage).event === "string" &&
    Boolean((data as CalendlyMessage).event?.startsWith("calendly."))
  );
}

function isCalendlyOrigin(origin: string) {
  try {
    const hostname = new URL(origin).hostname;
    return hostname === "calendly.com" || hostname.endsWith(".calendly.com");
  } catch {
    return false;
  }
}

export function CalendlyTracker() {
  useEffect(() => {
    const onMessage = (event: MessageEvent<unknown>) => {
      if (!isCalendlyOrigin(event.origin) || !isCalendlyEvent(event.data)) {
        return;
      }

      if (event.data.event === "calendly.date_and_time_selected") {
        trackConversionEvent("calendly_date_selected", {
          source: "contact_page_embed",
        });
        return;
      }

      if (event.data.event === "calendly.event_scheduled") {
        trackConversionEvent("calendly_booking", {
          source: "contact_page_embed",
          eventUri: event.data.payload?.event?.uri,
          inviteeUri: event.data.payload?.invitee?.uri,
        });
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return null;
}
