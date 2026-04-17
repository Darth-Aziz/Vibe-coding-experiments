"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AdminShellContextValue = {
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  openCommandPalette: () => void;
};

export const AdminShellContext =
  createContext<AdminShellContextValue | null>(null);

export function AdminShellProvider({ children }: { children: ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const openCommandPalette = useCallback(() => {
    setCommandPaletteOpen(true);
  }, []);

  const value = useMemo(
    () => ({
      mobileNavOpen,
      setMobileNavOpen,
      commandPaletteOpen,
      setCommandPaletteOpen,
      openCommandPalette,
    }),
    [mobileNavOpen, commandPaletteOpen, openCommandPalette]
  );

  return (
    <AdminShellContext.Provider value={value}>
      {children}
    </AdminShellContext.Provider>
  );
}

export function useAdminShell(): AdminShellContextValue {
  const ctx = useContext(AdminShellContext);
  if (!ctx) {
    throw new Error("useAdminShell must be used within AdminShellProvider");
  }
  return ctx;
}

export function useAdminShellOptional(): AdminShellContextValue | null {
  return useContext(AdminShellContext);
}
