import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getHiveByQrCode, getHiveProductivity } from '../../api/services/hivesApi'
import { getHiveYield } from '../../api/services/iotApi'
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
  const [productivity, setProductivity] = useState(null)
  const [yieldData, setYieldData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [framesCount, setFramesCount] = useState('10')
  const [honeyFramesCount, setHoneyFramesCount] = useState('4')
  const [diseases, setDiseases] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true)
      try {
        const hiveData = await getHiveByQrCode(qrCode)
        setHive(hiveData)

        if (hiveData?._id && isOnline) {
          const [prod, yld] = await Promise.all([
            getHiveProductivity(hiveData._id),
            getHiveYield(hiveData._id)
          ])
          setProductivity(prod)
          setYieldData(yld)
        }
      } catch (err) {
        toast.error('Дані вулика не знайдено')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllData()
  }, [qrCode, isOnline])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!hive?._id) return

    setIsSaving(true)
    const inspection = {
      hive_id: hive._id,
      date: new Date().toISOString(),
      details: {
        brood_frames: Number(framesCount),
        honey_frames: Number(honeyFramesCount),
        temper: '',
        notes: diseases,
      },
    }

    try {
      enqueueOfflineInspection(inspection)
      if (isOnline) {
        await syncOfflineInspections()
        toast.success('Огляд збережено та синхронізовано')
      } else {
        toast.success('Збережено локально (офлайн)')
      }
      refreshUnsyncedCount()
    } catch {
      toast.error('Помилка синхронізації')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <section className="flex min-h-screen items-center justify-center bg-black text-white">Завантаження...</section>
  if (!hive) return <section className="p-10 text-center bg-black text-white">Вулик не знайдено</section>

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-6 bg-black p-4 pb-24">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-yellow-300">Вулик {hive.qr_code}</h1>
          <p className="text-zinc-500 text-xs uppercase font-bold">{hive.type} • {hive.status}</p>
        </div>
        {productivity && (
          <div className="bg-yellow-300 text-black px-3 py-1 rounded-full font-black text-sm">
             Ефективність: {productivity}/10
          </div>
        )}
      </header>

      {isOnline && yieldData.length > 0 && (
        <div className="h-48 w-full rounded-2xl bg-zinc-900/50 border border-zinc-800 p-4">
          <h2 className="text-xs font-bold text-zinc-400 uppercase mb-4">Динаміка ваги (кг)</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={yieldData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="date" hide />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px' }}
                itemStyle={{ color: '#fde047' }}
              />
              <Line type="monotone" dataKey="weight" stroke="#fde047" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <form className="space-y-4 rounded-2xl bg-zinc-900/30 border border-zinc-800 p-5" onSubmit={handleSubmit}>
        <h2 className="text-sm font-bold text-yellow-300 uppercase">Новий огляд</h2>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-zinc-500 uppercase">Рамки</span>
            <input
              className="h-12 w-full rounded-xl bg-zinc-900 border border-zinc-700 text-white px-4 outline-none focus:border-yellow-300"
              type="number" value={framesCount} onChange={e => setFramesCount(e.target.value)} required
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-zinc-500 uppercase">Мед (рамки)</span>
            <input
              className="h-12 w-full rounded-xl bg-zinc-900 border border-zinc-700 text-white px-4 outline-none focus:border-yellow-300"
              type="number" value={honeyFramesCount} onChange={e => setHoneyFramesCount(e.target.value)} required
            />
          </label>
        </div>
        <label className="block">
          <span className="mb-1 block text-xs font-bold text-zinc-500 uppercase">Примітки</span>
          <textarea
            className="min-h-20 w-full rounded-xl bg-zinc-900 border border-zinc-700 text-white px-4 py-3 outline-none focus:border-yellow-300"
            value={diseases} onChange={e => setDiseases(e.target.value)}
            placeholder="Стан матки, поведінка..."
          />
        </label>

        <button
          className="h-14 w-full rounded-2xl bg-yellow-300 text-lg font-black text-black transition active:scale-95 disabled:opacity-50"
          disabled={isSaving} type="submit"
        >
          {isSaving ? 'Збереження...' : 'ЗБЕРЕГТИ ДАНІ'}
        </button>
      </form>
    </section>
  )
}

export default BeekeeperHivePage
