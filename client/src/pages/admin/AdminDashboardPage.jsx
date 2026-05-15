import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getAllHives, getSickHives } from '../../api/services/hivesApi'
import { getHiveInspectionHistory } from '../../api/services/inspectionsApi'

function AdminDashboardPage() {
  const [hives, setHives] = useState([])
  const [sickHives, setSickHives] = useState([])
  const [chartData, setChartData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoading(true)
      try {
        const [hivesData, sickData] = await Promise.all([getAllHives(), getSickHives()])
        setHives(hivesData)
        setSickHives(sickData)

        const firstHiveId = hivesData[0]?._id
        if (firstHiveId) {
          const history = await getHiveInspectionHistory(firstHiveId)
          const series = history
            .slice(0, 7)
            .reverse()
            .map((item) => ({
              day: new Date(item.date).toLocaleDateString(),
              honey_frames: item.details?.honey_frames ?? 0,
            }))
          setChartData(series)
        }
      } catch {
        toast.error('Не вдалося завантажити Dashboard')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  const totalHives = hives.length
  const weakOrMissingQueens = useMemo(
    () => hives.filter((item) => item.status === 'weak' || item.status === 'needs_attention' || item.status === 'sick').length,
    [hives],
  )
  const avgBroodFrames = useMemo(() => {
    if (!chartData.length) {
      return 0
    }
    return chartData.reduce((sum, point) => sum + point.honey_frames, 0) / chartData.length
  }, [chartData])

  if (isLoading) {
    return (
      <section className="flex-1 p-6">
        <p className="font-semibold text-zinc-200">Завантаження Dashboard...</p>
      </section>
    )
  }

  return (
    <section className="flex-1 space-y-6 p-6">
      <h1 className="text-3xl font-black text-yellow-300">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <article className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-sm text-zinc-400">Total hives</p>
          <p className="mt-2 text-4xl font-black text-white">{totalHives}</p>
        </article>
        <article className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-sm text-zinc-400">Weak / missing queens</p>
          <p className="mt-2 text-4xl font-black text-amber-300">{weakOrMissingQueens}</p>
        </article>
        <article className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-sm text-zinc-400">Average honey frames (7 recent inspections)</p>
          <p className="mt-2 text-4xl font-black text-emerald-300">{avgBroodFrames.toFixed(1)}</p>
        </article>
      </div>

      <article className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <h2 className="mb-4 text-xl font-bold text-zinc-100">Recent honey frames trend</h2>
        <div className="h-[320px] w-full">
          {chartData.length === 0 ? (
            <p className="text-zinc-300">Тут поки що порожньо</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
              <defs>
                <linearGradient id="weightFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FDE047" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#FDE047" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#27272A" />
              <XAxis dataKey="day" stroke="#A1A1AA" />
              <YAxis stroke="#A1A1AA" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181B',
                  border: '1px solid #3F3F46',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                }}
              />
              <Area
                dataKey="honey_frames"
                stroke="#FDE047"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#weightFill)"
              />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </article>

      <article className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4">
        <h2 className="mb-3 text-xl font-bold text-rose-200">Critical alerts</h2>
        <ul className="space-y-2">
          {sickHives.length === 0 ? (
            <li className="rounded-lg border border-rose-400/40 bg-black/30 px-3 py-2 text-sm text-rose-100">
              Тут поки що порожньо
            </li>
          ) : (
            sickHives.map((hive) => (
              <li
                key={hive._id}
                className="rounded-lg border border-rose-400/40 bg-black/30 px-3 py-2 text-sm text-rose-100"
              >
                Hive {hive.qr_code}: status {hive.status}, location {hive?.location_id?.name ?? '—'}
              </li>
            ))
          )}
        </ul>
      </article>
    </section>
  )
}

export default AdminDashboardPage
