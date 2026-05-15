import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { getAllHives } from '../../api/services/hivesApi'

function AdminHivesPage() {
  const [hives, setHives] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchHives = async () => {
      setIsLoading(true)
      try {
        const data = await getAllHives()
        setHives(data)
      } catch {
        toast.error('Не вдалося завантажити вулики')
      } finally {
        setIsLoading(false)
      }
    }

    fetchHives()
  }, [])

  const locations = useMemo(() => {
    const unique = new Set(hives.map((hive) => hive.location_id?.name).filter(Boolean))
    return ['All', ...Array.from(unique)]
  }, [hives])

  const filteredHives = useMemo(() => {
    return hives.filter((hive) => {
      const locationMatch =
        selectedLocation === 'All' ? true : hive.location_id?.name === selectedLocation
      const textMatch = `${hive.qr_code} ${hive.type} ${hive.status}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())

      return locationMatch && textMatch
    })
  }, [hives, searchTerm, selectedLocation])

  if (isLoading) {
    return (
      <section className="flex-1 p-6">
        <p className="font-semibold text-zinc-200">Завантаження вуликів...</p>
      </section>
    )
  }

  return (
    <section className="flex-1 space-y-5 p-6">
      <h1 className="text-3xl font-black text-yellow-300">Hives Registry</h1>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-zinc-300">Location filter</span>
          <select
            className="h-11 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 text-sm text-white outline-none focus:border-yellow-300"
            value={selectedLocation}
            onChange={(event) => setSelectedLocation(event.target.value)}
          >
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-zinc-300">Search hive / type</span>
          <input
            className="h-11 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 text-sm text-white outline-none focus:border-yellow-300"
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="HIVE-001 or Langstroth"
          />
        </label>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900">
        {filteredHives.length === 0 ? (
          <p className="px-4 py-6 text-center font-semibold text-zinc-300">Тут поки що порожньо</p>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="bg-zinc-800/70 text-zinc-300">
              <tr>
                <th className="px-4 py-3 font-semibold">QR</th>
                <th className="px-4 py-3 font-semibold">Location</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Queen</th>
                <th className="px-4 py-3 font-semibold">Installed</th>
              </tr>
            </thead>
            <tbody>
              {filteredHives.map((hive) => (
                <tr key={hive._id} className="border-t border-zinc-800">
                  <td className="px-4 py-3 font-bold text-yellow-200">{hive.qr_code}</td>
                  <td className="px-4 py-3 text-zinc-200">{hive.location_id?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-zinc-200">{hive.type}</td>
                  <td className="px-4 py-3 text-zinc-200">{hive.status}</td>
                  <td className="px-4 py-3 text-zinc-200">{hive.queen?.breed ?? '—'}</td>
                  <td className="px-4 py-3 text-zinc-200">
                    {new Date(hive.installed_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}

export default AdminHivesPage
