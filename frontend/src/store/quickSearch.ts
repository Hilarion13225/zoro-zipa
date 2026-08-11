import { create } from 'zustand'

interface QuickSearchState {
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
}

/** Open/close state for the global Cmd/Ctrl+K search palette. */
export const useQuickSearch = create<QuickSearchState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  toggle: () => set((s) => ({ open: !s.open })),
}))
