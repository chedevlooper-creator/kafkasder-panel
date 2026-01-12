"use client";

import { useUserStore } from "@/stores/user-store";
import { useEffect, useRef } from "react";

export function AuthInitializer() {
  const { initializeAuth, _isInitialized } = useUserStore();
  const initializedRef = useRef(false);

  useEffect(() => {
    // Only initialize once per app lifecycle
    if (!initializedRef.current && !_isInitialized) {
      initializeAuth();
      initializedRef.current = true;
    }
  }, [initializeAuth, _isInitialized]);

  return null;
}
