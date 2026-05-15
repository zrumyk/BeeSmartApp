import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getHiveByQrCode } from '../../api/services/hivesApi'
import {
  enqueueOfflineInspection,
  syncOfflineInspections,
} from '../../api/services/inspectionsApi'
import useNetworkStore from '../../store/networkStore'
import useSyncQueueStore from '../../store/syncQueueStore'

function BeekeeperHivePage() {
  const { qrCode } = useParams()
  const isOnline = useNetworkStore((state) => state.isOnline)
  const refreshUnsyncedCount = useSyncQueueStore((state) => state.refreshUnsyncedCount)
  const [hive, setHive] = useState(null)
  const [isLoadingHive, setIsLoadingHive] = useState(true)

  const [framesCount, setFramesCount] = useState('10')
  const [honeyFramesCount, setHoneyFramesCount] = useState('4')
  const [diseases, setDiseases] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchHive = async () => {
      setIsLoadingHive(true)
      try {
        const data = await getHiveByQrCode(qrCode)
        setHive(data)
      } catch {
        toast.error('Вулик за QR не знайдено')
      } finally {
        setIsLoadingHive(false)
      }
    }

    fetchHive()
  }, [qrCode])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!hive?._id) {
      toast.error('Неможливо зберегти огляд: вулик не знайдено')
      return
    }

    setIsSaving(true)

    const inspection = {
      hive_id: hive?._id,
      date: new Date().toISOString(),
      details: {
        brood_frames: Number(framesCount),
        honey_frames: Number(honeyFramesCount),
        temper: '',
        notes: diseases,
      },
    }

    if (!isOnline) {
      enqueueOfflineInspection(inspection)
      refreshUnsyncedCount()
      toast.success('Збережено локально')
      setIsSaving(false)
      return
    }

    try {
      enqueueOfflineInspection(inspection)
      const result = await syncOfflineInspections()
      refreshUnsyncedCount()
      if ((result?.syncedCount ?? 0) > 0 || (result?.duplicatesCount ?? 0) > 0) {
        toast.success('Огляд синхронізовано')
      }
      if ((result?.failedCount ?? 0) > 0) {
        toast.error('Частину записів не вдалося синхронізувати')
      }
    } catch {
      refreshUnsyncedCount()
      toast.error('Мережа нестабільна: збережено локально')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoadingHive) {
    return (
      <section className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center bg-black p-4 pb-24">
        <p className="text-base font-semibold text-zinc-200">Завантаження вулика...</p>
      </section>
    )
  }

  if (!hive) {
    return (
      <section className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-3 bg-black p-4 pb-24 text-center">
        <h1 className="text-2xl font-black text-yellow-300">Картка вулика</h1>
        <p className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200">
          Тут поки що порожньо
        </p>
      </section>
    )
  }

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-4 bg-black p-4 pb-24">
      <h1 className="text-2xl font-black text-yellow-300">Картка вулика</h1>
      <p className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200">
        QR: {hive.qr_code ?? qrCode}
      </p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-zinc-300">Кількість рамок</span>
          <input
            className="h-12 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-lg outline-none focus:border-yellow-300"
            min="0"
            type="number"
            value={framesCount}
            onChange={(event) => setFramesCount(event.target.value)}
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-zinc-300">Медові рамки</span>
          <input
            className="h-12 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-lg outline-none focus:border-yellow-300"
            min="0"
            type="number"
            value={honeyFramesCount}
            onChange={(event) => setHoneyFramesCount(event.target.value)}
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-zinc-300">Хвороби / примітки</span>
          <textarea
            className="min-h-24 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-base outline-none focus:border-yellow-300"
            value={diseases}
            onChange={(event) => setDiseases(event.target.value)}
            placeholder="Опишіть симптоми або залиште порожнім"
          />
        </label>

        <button
          className="h-14 w-full rounded-2xl border-2 border-yellow-300 bg-yellow-300 text-lg font-black text-black disabled:opacity-60"
          disabled={isSaving}
          type="submit"
        >
          {isSaving ? 'Збереження...' : 'Зберегти огляд'}
        </button>
      </form>
    </section>
  )
}

export default BeekeeperHivePage
