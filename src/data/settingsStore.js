import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettings = create(
  persist(
    (set) => ({
      currency: 'DKK',
      vendors: [],

      setCurrency: (currency) => set({ currency }),

      addVendor: (vendorName) =>
        set((state) => ({
          vendors: [...state.vendors, { id: Date.now(), name: vendorName }]
        })),

      removeVendor: (vendorId) =>
        set((state) => ({
          vendors: state.vendors.filter((v) => v.id !== vendorId)
        }))
    }),
    {
      name: 'settings-storage'
    }
  )
);
