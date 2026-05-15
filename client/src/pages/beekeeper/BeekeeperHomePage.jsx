import { Link } from 'react-router-dom'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { syncOfflineInspections } from '../../api/services/inspectionsApi'
import useNetworkStore from '../../store/networkStore'
import useSyncQueueStore from '../../store/syncQueueStore'

function BeekeeperHomePage() {
  const isOnline = useNetworkStore((state) => state.isOnline)
  const unsyncedCount = useSyncQueueStore((state) => state.unsyncedCount)
  const refreshUnsyncedCount = useSyncQueueStore((state) => state.refreshUnsyncedCount)
  const [isSyncing, setIsSyncing] = useState(false)

  const handleManualSync = async () => {
    if (isSyncing || !isOnline || unsyncedCount === 0) {
      return
    }

    setIsSyncing(true)
    try {
      const result = await syncOfflineInspections()
      if ((result?.syncedCount ?? 0) > 0 || (result?.duplicatesCount ?? 0) > 0) {
        toast.success(`Синхронізовано: ${result.syncedCount}, дублікатів: ${result.duplicatesCount}`)
      }
      if ((result?.failedCount ?? 0) > 0) {
        toast.error(`Не вдалося синхронізувати: ${result.failedCount}`)
      }
    } catch {
      toast.error('Помилка мережі під час синхронізації')
    } finally {
      refreshUnsyncedCount()
      setIsSyncing(false)
    }
  }

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-4 bg-black p-4 pb-24">
      <h1 className="text-3xl font-black tracking-wide text-yellow-300">BeeSmart Field</h1>

      <div
        className={`rounded-xl border-2 px-4 py-3 text-sm font-bold ${
          isOnline
            ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200'
            : 'border-rose-400 bg-rose-500/20 text-rose-200'
        }`}
      >
        Інтернет: {isOnline ? 'є зʼєднання' : 'офлайн'}
      </div>

      <div className="rounded-xl border-2 border-yellow-300 bg-zinc-900 px-4 py-3">
        <p className="text-sm font-semibold text-zinc-300">Не синхронізовано</p>
        <p className="text-3xl font-black text-yellow-300">{unsyncedCount}</p>
      </div>

      <button
        type="button"
        onClick={handleManualSync}
        disabled={!isOnline || isSyncing || unsyncedCount === 0}
        className="flex h-14 items-center justify-center rounded-2xl border-2 border-emerald-300 bg-emerald-500 px-4 text-base font-black text-black disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSyncing ? 'Синхронізація...' : `Синхронізувати зараз (${unsyncedCount})`}
      </button>

      <Link
        className="flex h-24 items-center justify-center rounded-2xl border-2 border-yellow-300 bg-yellow-300 text-xl font-black text-black"
        to="/beekeeper/scanner"
      >
        Сканувати QR-код вулика
      </Link>

      <div className="grid grid-cols-1 gap-3">
        <Link
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-4 text-center font-bold text-white"
          to="/beekeeper/tasks"
        >
          Завдання
        </Link>
      </div>
    </section>
  )
}

export default BeekeeperHomePage
