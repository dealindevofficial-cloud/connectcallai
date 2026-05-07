import type { NextConfig } from "next";
import { parseImageRemoteHostsFromEnv } from "./lib/cdn/image-remote-hosts";

const remotePatterns = parseImageRemoteHostsFromEnv().map((hostname) => ({
  protocol: "https" as const,
  hostname,
  pathname: "/**",
}));

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
