"use client";

import { useState, useEffect } from "react";
import { getSiteConfig } from "@/lib/api/settings";
import type { SiteConfig } from "@/lib/site-config";
import { DEFAULT_SITE_CONFIG } from "@/lib/site-config";

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  useEffect(() => {
    getSiteConfig().then(setConfig).catch(() => {});
  }, []);
  return config;
}
