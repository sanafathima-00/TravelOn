/**
 * Zustand Store for global state management
 */

import { create } from 'zustand';

export const useStore = create((set) => ({
  // Hotels
  hotels: [],
  setHotels: (hotels) => set({ hotels }),

  // Restaurants
  restaurants: [],
  setRestaurants: (restaurants) => set({ restaurants }),

  // Cart
  cart: [],
  addToCart: (item) => set((state) => ({
    cart: [...state.cart, { ...item, id: Date.now() }],
  })),
  removeFromCart: (itemId) => set((state) => ({
    cart: state.cart.filter((item) => item.id !== itemId),
  })),
  clearCart: () => set({ cart: [] }),

  // Loading states
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),

  // Error handling
  error: null,
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Filters
  filters: {
    city: '',
    minPrice: 0,
    maxPrice: Infinity,
    rating: 0,
  },
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters },
  })),
}));

export default useStore;
