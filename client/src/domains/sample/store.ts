/**
 * Sample Domain Store
 *
 * Sample 도메인의 상태 관리 (Zustand)
 *
 * @example
 * const { items, loading, fetchItems } = useSampleStore();
 */

import { create } from 'zustand';
import type { SampleItem } from './types';
import * as sampleApi from './api';

interface SampleState {
  // State
  items: SampleItem[];
  selectedItem: SampleItem | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchItems: () => Promise<void>;
  fetchItem: (id: string) => Promise<void>;
  createItem: (data: any) => Promise<void>;
  updateItem: (id: string, data: any) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  setSelectedItem: (item: SampleItem | null) => void;
}

export const useSampleStore = create<SampleState>((set) => ({
  // Initial State
  items: [],
  selectedItem: null,
  loading: false,
  error: null,

  // Actions
  fetchItems: async () => {
    set({ loading: true, error: null });
    try {
      const response = await sampleApi.fetchSampleItems();
      set({ items: response.items, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchItem: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const item = await sampleApi.fetchSampleItem(id);
      set({ selectedItem: item, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  createItem: async (data: any) => {
    set({ loading: true, error: null });
    try {
      const newItem = await sampleApi.createSampleItem(data);
      set((state) => ({
        items: [...state.items, newItem],
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateItem: async (id: string, data: any) => {
    set({ loading: true, error: null });
    try {
      const updatedItem = await sampleApi.updateSampleItem(id, data);
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? updatedItem : item
        ),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  deleteItem: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await sampleApi.deleteSampleItem(id);
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  setSelectedItem: (item: SampleItem | null) => {
    set({ selectedItem: item });
  },
}));
