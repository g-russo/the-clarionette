import { Metadata } from "next";
import { getPageTitle, getPageDescription } from "../utils/routing";

// Generate metadata for any page based on the route
export function generateMetadata(path: string): Metadata {
  return {
    title: getPageTitle(path),
    description: getPageDescription(path),
    keywords: [
      "The Clarionette",
      "Malate Catholic School",
      "student publication",
      "news",
      "features",
      "sports",
      "literary",
      "Filipino",
      "editorial"
    ],
    authors: [{ name: "The Clarionette Editorial Board" }],
    creator: "Malate Catholic School",
    publisher: "The Clarionette",    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
    },
    openGraph: {
      title: getPageTitle(path),
      description: getPageDescription(path),
      siteName: "The Clarionette",
      type: "website",
      locale: "en_US"
    },
    twitter: {
      card: "summary_large_image",
      title: getPageTitle(path),
      description: getPageDescription(path)
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "google-site-verification-code", // Replace with actual verification code
    }
  };
}
