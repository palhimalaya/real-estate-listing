"use client";

import { useEffect, useState } from "react";

const ADMIN_STORAGE_KEY = "x-admin";
const ADMIN_MODE_EVENT = "admin-mode-change";

export function readAdminMode(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return localStorage.getItem(ADMIN_STORAGE_KEY) === "true";
}

export function writeAdminMode(enabled: boolean): void {
  if (typeof window === "undefined") {
    return;
  }

  if (enabled) {
    localStorage.setItem(ADMIN_STORAGE_KEY, "true");
  } else {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  }

  window.dispatchEvent(new CustomEvent(ADMIN_MODE_EVENT, { detail: { enabled } }));
}

export function useAdminMode() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === ADMIN_STORAGE_KEY) {
        setIsAdmin(readAdminMode());
      }
    };

    const handleAdminModeChange = (e: CustomEvent<{ enabled: boolean }>) => {
      setIsAdmin(e.detail.enabled);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(ADMIN_MODE_EVENT, handleAdminModeChange as EventListener);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(ADMIN_MODE_EVENT, handleAdminModeChange as EventListener);
    };
  }, []);

  const setAdminMode = (enabled: boolean) => {
    writeAdminMode(enabled);
  };

  return { isAdmin, setAdminMode };
}
