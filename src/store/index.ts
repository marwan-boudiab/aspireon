// store.ts
import { create } from 'zustand';

interface SizeStore {
  activeSize: string;
  setActiveSize: (size: string) => void;
}

export const useSizeStore = create<SizeStore>((set) => ({
  activeSize: '',
  setActiveSize: (size) => set({ activeSize: size }),
}));
