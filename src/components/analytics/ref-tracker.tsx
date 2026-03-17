"use client";

import { useEffect } from "react";

export function RefTracker() {
  useEffect(() => {
    // Ensure we are in the browser environment
    if (typeof window === "undefined") return;

    // Parse the query parameters
    const searchParams = new URLSearchParams(window.location.search);
    const ref = searchParams.get("ref");

    // If no ref parameter, do nothing
    if (!ref) return;

    // Check if we have already tracked this visit in the current session
    const hasTracked = sessionStorage.getItem("tracked_ref");
    if (hasTracked) return;

    // Mark as tracked immediately to prevent duplicate calls
    sessionStorage.setItem("tracked_ref", "true");

    // Send the tracking request to the Netlify Function
    fetch(`/.netlify/functions/track-visit?ref=${encodeURIComponent(ref)}`)
      .then((res) => {
        if (!res.ok) {
          console.warn("Tracking failed:", res.statusText);
        } else {
          // Optional: Clean up the URL after tracking to hide the parameter from the user's address bar
          // This makes the tracking even more stealthy
          if (window.history.replaceState) {
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
          }
        }
      })
      .catch((err) => {
        console.error("Tracking error:", err);
      });
  }, []);

  // This component renders nothing
  return null;
}

