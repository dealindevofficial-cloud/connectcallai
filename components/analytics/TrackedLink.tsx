"use client";

import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { trackConversionEvent } from "@/lib/analytics/conversions";

type TrackedLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children: ReactNode;
    eventProperties?: Record<string, string | number | boolean | null | undefined>;
  };

export function TrackedCtaLink({
  children,
  eventProperties,
  onClick,
  ...props
}: TrackedLinkProps) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        trackConversionEvent("cta_click", {
          destination: String(props.href),
          ...eventProperties,
        });
        onClick?.(event);
      }}
    >
      {children}
    </Link>
  );
}
