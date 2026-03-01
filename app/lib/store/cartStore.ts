import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/app/lib/types'

interface CartStore {
  items: CartItem[]
  hasHydrated: boolean
  setHasHydrated: (value: boolean) => void
  addToCart: (productId: string, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,

      setHasHydrated: (value) => set({ hasHydrated: value }),

      addToCart: (productId, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.productId === productId)
          if (existing) {
            // Silently increment — per user decision in CONTEXT.md
            return {
              items: state.items.map((item) =>
                item.productId === productId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              ),
            }
          }
          return { items: [...state.items, { productId, quantity }] }
        }),

      removeFromCart: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),

      updateQuantity: (productId, quantity) => {
        // Enforce minimum quantity of 1; if 0 or below, remove the item
        if (quantity <= 0) {
          set((state) => ({
            items: state.items.filter((item) => item.productId !== productId),
          }))
          return
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item,
          ),
        }))
      },

      clearCart: () => {
        set({ items: [] })
        // Explicitly clear localStorage to prevent re-hydration on next load
        if (typeof window !== 'undefined') {
          localStorage.removeItem('centimentalcomics-cart')
        }
      },

      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: 'centimentalcomics-cart',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    },
  ),
)
