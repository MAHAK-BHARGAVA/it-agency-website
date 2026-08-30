"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminSessionKeeper() {
  const router = useRouter();

  useEffect(() => {
    let refreshing = false;

    async function refreshSession() {
      if (refreshing) return;

      try {
        refreshing = true;

        const response = await fetch(
          "/api/auth/refresh",
          {
            method: "POST",
            credentials: "include",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          router.replace("/admin/login");
        }
      } catch (error) {
        console.error(
          "Session refresh failed:",
          error
        );
      } finally {
        refreshing = false;
      }
    }

    // Refresh every 10 minutes
    const interval = setInterval(
      refreshSession,
      10 * 60 * 1000
    );

    // Important:
    // if laptop sleeps / tab stays in background
    function handleVisibilityChange() {
      if (
        document.visibilityState ===
        "visible"
      ) {
        refreshSession();
      }
    }

    function handleFocus() {
      refreshSession();
    }

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    window.addEventListener(
      "focus",
      handleFocus
    );

    return () => {
      clearInterval(interval);

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      window.removeEventListener(
        "focus",
        handleFocus
      );
    };
  }, [router]);

  return null;
}