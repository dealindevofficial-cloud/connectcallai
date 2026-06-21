"use client";

import parse, {
  domToReact,
  type DOMNode,
  type HTMLReactParserOptions,
} from "html-react-parser";
import { isTag } from "domhandler";
import Image from "next/image";

import { isInternalServiceHref, trackConversionEvent } from "@/lib/analytics/conversions";
import { parseImageRemoteHostsFromEnv } from "@/lib/cdn/image-remote-hosts";

type BlogPostBodyProps = {
  html: string;
};

function getAllowedRemoteHosts(): string[] {
  return parseImageRemoteHostsFromEnv();
}

function hostMatches(host: string, allowed: string): boolean {
  return host === allowed || host.endsWith(`.${allowed}`);
}

function canOptimizeWithNextImage(src: string): boolean {
  if (src.startsWith("/")) {
    return true;
  }
  try {
    const u = new URL(src);
    if (u.protocol !== "https:") {
      return false;
    }
    const hosts = getAllowedRemoteHosts();
    return hosts.some((h) => hostMatches(u.hostname, h));
  } catch {
    return false;
  }
}

function parseDimension(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function buildParserOptions(): HTMLReactParserOptions {
  const options: HTMLReactParserOptions = {
    replace(domNode: DOMNode) {
      if (!isTag(domNode)) {
        return undefined;
      }

      if (domNode.name === "a") {
        const { href, class: className, ...attributes } = domNode.attribs;
        if (!href || !isInternalServiceHref(href)) {
          return undefined;
        }

        return (
          <a
            {...attributes}
            href={href}
            className={className}
            onClick={() =>
              trackConversionEvent("blog_to_service_click", {
                source: "blog_body",
                destination: href,
              })
            }
          >
            {domToReact(domNode.children as DOMNode[], options)}
          </a>
        );
      }

      if (domNode.name !== "img") {
        return undefined;
      }

      const { src, alt, width: wAttr, height: hAttr } = domNode.attribs;
      if (!src?.trim()) {
        return undefined;
      }

      const altText = alt ?? "";
      const className =
        "my-5 w-full rounded-[0.65rem] border border-[#BFDBFE] bg-white object-cover";

      if (!canOptimizeWithNextImage(src)) {
        return (
          // eslint-disable-next-line @next/next/no-img-element -- remote hosts outside NEXT_PUBLIC_IMAGE_REMOTE_HOSTS
          <img
            src={src}
            alt={altText}
            className={className}
            loading="lazy"
            decoding="async"
          />
        );
      }

      const width = parseDimension(wAttr, 1200);
      const height = parseDimension(hAttr, Math.max(1, Math.round((width * 9) / 16)));

      return (
        <span className="my-5 block w-full">
          <Image
            src={src}
            alt={altText}
            width={width}
            height={height}
            className={`${className} h-auto max-w-full`}
            sizes="(max-width: 768px) 100vw, min(65ch, 720px)"
            loading="lazy"
          />
        </span>
      );
    },
  };

  return options;
}

/** HTML must already be sanitized server-side (see `markdownToSafeHtml`). */
export function BlogPostBody({ html }: BlogPostBodyProps) {
  return (
    <div className="blog-prose">{parse(html, buildParserOptions())}</div>
  );
}
