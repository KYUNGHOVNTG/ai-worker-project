/**
 * Sample Domain Store
 *
 * Sample 도메인의 상태 관리 (Zustand)
 *
 * @example
 * const { items, loading, fetchItems } = useSampleStore();
 */

import { create } from 'zustand';
import type { SampleItem, SampleCreateData, SampleUpdateData } from './types';
import * as sampleApi from './api';

interface SampleState {
  // State
  items: SampleItem[];
  selectedItem: SampleItem | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchItems: () => Promise<void>;
  createItem: (data: SampleCreateData) => Promise<void>;
  updateItem: (id: number, data: SampleUpdateData) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
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
      const items = await sampleApi.fetchSampleItems();
      set({ items, loading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '데이터 로드 실패';
      set({ error: message, loading: false });
    }
  },

  createItem: async (data: SampleCreateData) => {
    set({ loading: true, error: null });
    try {
      const newItem = await sampleApi.createSampleItem(data);
      set((state) => ({
        items: [...state.items, newItem],
        loading: false,
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '생성 실패';
      set({ error: message, loading: false });
    }
  },

  updateItem: async (id: number, data: SampleUpdateData) => {
    set({ loading: true, error: null });
    try {
      const updatedItem = await sampleApi.updateSampleItem(id, data);
      set((state) => ({
        items: state.items.map((item) => (item.id === id ? updatedItem : item)),
        loading: false,
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '수정 실패';
      set({ error: message, loading: false });
    }
  },

  deleteItem: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await sampleApi.deleteSampleItem(id);
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
        loading: false,
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '삭제 실패';
      set({ error: message, loading: false });
    }
  },

  setSelectedItem: (item: SampleItem | null) => {
    set({ selectedItem: item });
  },
}));
