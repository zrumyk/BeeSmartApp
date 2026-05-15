import { create } from 'zustand'
import { getOfflineInspections } from '../api/services/inspectionsApi'

const useSyncQueueStore = create((set) => ({
  unsyncedCount: 0,
  refreshUnsyncedCount: () => {
    const queue = getOfflineInspections()
    set({ unsyncedCount: queue.length })
  },
  setUnsyncedCount: (value) => set({ unsyncedCount: value }),
}))

export default useSyncQueueStore
