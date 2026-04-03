import { useEffect } from "react";

const STORAGE_KEY = "gkl_order_src";

export type TrafficSource =
  | "arama-motoru"
  | "yapay-zeka"
  | "sosyal-medya"
  | "reklam"
  | "e-posta"
  | "direkt"
  | "diger";

const SEARCH_ENGINES = ["google.com", "bing.com", "yandex.com", "yandex.com.tr", "duckduckgo.com", "yahoo.com", "ecosia.org"];
const AI_SOURCES = ["chatgpt.com", "openai.com", "perplexity.ai", "claude.ai", "anthropic.com", "gemini.google.com", "bard.google.com", "copilot.microsoft.com", "you.com", "phind.com", "kagi.com"];
const SOCIAL_SOURCES = ["instagram.com", "facebook.com", "fb.com", "facebookinternaldns.com", "tiktok.com", "twitter.com", "x.com", "youtube.com", "youtu.be", "linkedin.com", "pinterest.com", "reddit.com", "t.co", "l.instagram.com"];

function classifySource(): TrafficSource | null {
  try {
    const url = new URL(window.location.href);
    const utmSource = (url.searchParams.get("utm_source") || "").toLowerCase();
    const utmMedium = (url.searchParams.get("utm_medium") || "").toLowerCase();
    const referrer = document.referrer ? new URL(document.referrer).hostname.toLowerCase() : "";

    // Reklam (paid)
    if (["cpc", "ppc", "paid", "paid-social", "paid_social", "ads"].some(m => utmMedium.includes(m))) return "reklam";
    if (utmSource.includes("ads") || utmMedium.includes("ads")) return "reklam";
    if (utmSource === "google" && utmMedium === "cpc") return "reklam";

    // E-posta
    if (utmMedium === "email" || utmSource === "newsletter" || utmSource === "email") return "e-posta";

    // Arama motoru
    if (SEARCH_ENGINES.some(se => referrer.includes(se))) return "arama-motoru";
    if (["google", "bing", "yandex", "duckduckgo", "yahoo"].includes(utmSource)) return "arama-motoru";

    // Yapay Zeka
    if (AI_SOURCES.some(ai => referrer.includes(ai))) return "yapay-zeka";
    if (["chatgpt", "perplexity", "claude", "gemini", "copilot", "openai"].includes(utmSource)) return "yapay-zeka";

    // Sosyal Medya
    if (SOCIAL_SOURCES.some(s => referrer.includes(s))) return "sosyal-medya";
    if (["instagram", "facebook", "tiktok", "twitter", "youtube", "linkedin", "pinterest", "reddit"].includes(utmSource)) return "sosyal-medya";
    if (utmMedium === "social") return "sosyal-medya";

    // Bilinmeyen harici referrer
    if (referrer && !referrer.includes("gokalaf.com") && !referrer.includes("localhost") && !referrer.includes("127.0.0.1")) {
      return "diger";
    }

    // Direkt veya iç navigasyon — mevcut kaynağı korumak için null döndür
    return null;
  } catch {
    return null;
  }
}

export function useTrafficSource(): void {
  useEffect(() => {
    const source = classifySource();
    if (source) {
      localStorage.setItem(STORAGE_KEY, source);
    } else if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, "direkt");
    }
  }, []);
}

export function getTrafficSource(): TrafficSource {
  return (localStorage.getItem(STORAGE_KEY) as TrafficSource) || "direkt";
}

export const SOURCE_LABELS: Record<TrafficSource, string> = {
  "arama-motoru": "Arama Motoru",
  "yapay-zeka": "Yapay Zeka",
  "sosyal-medya": "Sosyal Medya",
  "reklam": "Google",
  "e-posta": "E-posta",
  "direkt": "Direkt",
  "diger": "Diğer",
};

export const SOURCE_COLORS: Record<TrafficSource, { bg: string; text: string; border: string }> = {
  "arama-motoru": { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  "yapay-zeka":   { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
  "sosyal-medya": { bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/20" },
  "reklam":       { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20" },
  "e-posta":      { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20" },
  "direkt":       { bg: "bg-white/[0.06]", text: "text-gray-400", border: "border-white/10" },
  "diger":        { bg: "bg-gray-500/10", text: "text-gray-500", border: "border-gray-500/20" },
};
