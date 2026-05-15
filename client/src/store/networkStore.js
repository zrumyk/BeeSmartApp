import { create } from 'zustand'

const useNetworkStore = create((set) => ({
  isOnline: navigator.onLine,
  setOnlineStatus: (value) => set({ isOnline: value }),
}))

export default useNetworkStore
