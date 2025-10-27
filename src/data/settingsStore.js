import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettings = create(
  persist(
    (set) => ({
      currency: 'DKK',
      vendors: [],
      people: [],
      groups: [],

      setCurrency: (currency) => set({ currency }),

      // Simple add functions (for backward compatibility with inline creation)
      addVendor: (vendorName) =>
        set((state) => ({
          vendors: [...state.vendors, { id: Date.now(), name: vendorName, type: 'Software', contactEmail: '', status: 'Active' }]
        })),

      addPerson: (personName) =>
        set((state) => ({
          people: [...state.people, { id: Date.now(), name: personName, email: '', role: 'Person', department: '' }]
        })),

      // Full add functions with all fields
      addFullPerson: (personData) =>
        set((state) => ({
          people: [...state.people, { id: Date.now(), ...personData }]
        })),

      addFullVendor: (vendorData) =>
        set((state) => ({
          vendors: [...state.vendors, { id: Date.now(), ...vendorData }]
        })),

      // Edit functions
      editPerson: (personId, personData) =>
        set((state) => ({
          people: state.people.map((p) =>
            p.id === personId ? { ...p, ...personData } : p
          )
        })),

      editVendor: (vendorId, vendorData) =>
        set((state) => ({
          vendors: state.vendors.map((v) =>
            v.id === vendorId ? { ...v, ...vendorData } : v
          )
        })),

      // Remove functions
      removeVendor: (vendorId) =>
        set((state) => ({
          vendors: state.vendors.filter((v) => v.id !== vendorId)
        })),

      removePerson: (personId) =>
        set((state) => ({
          people: state.people.filter((p) => p.id !== personId)
        })),

      // Group functions
      addGroup: (groupData) =>
        set((state) => ({
          groups: [...state.groups, { id: Date.now(), ...groupData }]
        })),

      editGroup: (groupId, groupData) =>
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === groupId ? { ...g, ...groupData } : g
          )
        })),

      removeGroup: (groupId) =>
        set((state) => ({
          groups: state.groups.filter((g) => g.id !== groupId)
        }))
    }),
    {
      name: 'settings-storage'
    }
  )
);
