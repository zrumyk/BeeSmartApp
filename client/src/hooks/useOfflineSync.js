import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { syncOfflineInspections } from '../api/services/inspectionsApi'
import useNetworkStore from '../store/networkStore'
import useSyncQueueStore from '../store/syncQueueStore'

function useOfflineSync() {
  const isOnline = useNetworkStore((state) => state.isOnline)
  const refreshUnsyncedCount = useSyncQueueStore((state) => state.refreshUnsyncedCount)
  const [isSyncing, setIsSyncing] = useState(false)

  const runSync = useCallback(async () => {
    if (isSyncing) {
      return null
    }

    setIsSyncing(true)
    try {
      const result = await syncOfflineInspections()
      if ((result?.syncedCount ?? 0) > 0 || (result?.duplicatesCount ?? 0) > 0) {
        toast.success(
          `Синхронізовано: ${result.syncedCount}, дублікатів: ${result.duplicatesCount}`,
        )
      }
      if ((result?.failedCount ?? 0) > 0) {
        toast.error(`Не вдалося синхронізувати: ${result.failedCount}`)
      }
      return result
    } catch {
      toast.error('Помилка мережі під час синхронізації')
      return null
    } finally {
      refreshUnsyncedCount()
      setIsSyncing(false)
    }
  }, [isSyncing, refreshUnsyncedCount])

  useEffect(() => {
    refreshUnsyncedCount()
  }, [refreshUnsyncedCount])

  useEffect(() => {
    if (!isOnline) {
      return
    }

    const autoSync = async () => {
      try {
        await syncOfflineInspections()
      } catch {
        // Keep queue for the next online event.
      } finally {
        refreshUnsyncedCount()
      }
    }

    autoSync()
  }, [isOnline, refreshUnsyncedCount])

  useEffect(() => {
    const handleOnline = () => {
      syncOfflineInspections()
        .catch(() => {
          // Keep queue for the next online event.
        })
        .finally(() => {
          refreshUnsyncedCount()
        })
    }

    window.addEventListener('online', handleOnline)
    return () => {
      window.removeEventListener('online', handleOnline)
    }
  }, [refreshUnsyncedCount])

  return {
    syncNow: runSync,
    isSyncing,
  }
}

export default useOfflineSync
