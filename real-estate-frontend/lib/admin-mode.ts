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

  window.dispatchEvent(new Event(ADMIN_MODE_EVENT));
}

export function useAdminMode() {
  const [isAdmin, setIsAdmin] = useState(readAdminMode);

  useEffect(() => {
    const syncAdminMode = () => {
      setIsAdmin(readAdminMode());
    };

    window.addEventListener("storage", syncAdminMode);
    window.addEventListener(ADMIN_MODE_EVENT, syncAdminMode);

    return () => {
      window.removeEventListener("storage", syncAdminMode);
      window.removeEventListener(ADMIN_MODE_EVENT, syncAdminMode);
    };
  }, []);

  const setAdminMode = (enabled: boolean) => {
    writeAdminMode(enabled);
    setIsAdmin(enabled);
  };

  return { isAdmin, setAdminMode };
}
