import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { getAllHives, createHive } from '../../api/services/hivesApi'
import { getAllLocations } from '../../api/services/locationsApi'

function AdminHivesPage() {
  const [hives, setHives] = useState([])
  const [allLocations, setAllLocations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  
  const [showForm, setShowForm] = useState(false)
  const [newHive, setNewHive] = useState({
    qr_code: '',
    location_id: '',
    type: 'Langstroth',
    installed_at: new Date().toISOString().split('T')[0],
    queen: { breed: '', year: new Date().getFullYear(), color_mark: '' }
  })

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [hivesData, locationsData] = await Promise.all([
        getAllHives(),
        getAllLocations()
      ])
      setHives(hivesData)
      setAllLocations(locationsData)
    } catch {
      toast.error('Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const locationsFilter = useMemo(() => {
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

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newHive.qr_code || !newHive.location_id) {
      return toast.error('Please fill required fields')
    }

    try {
      await createHive(newHive)
      toast.success('Hive registered')
      setShowForm(false)
      setNewHive({ qr_code: '', location_id: '', type: 'Langstroth', installed_at: new Date().toISOString().split('T')[0], queen: { breed: '', year: new Date().getFullYear(), color_mark: '' } })
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create hive')
    }
  }

  if (isLoading) return <section className="p-6"><p className="text-zinc-400">Loading...</p></section>

  return (
    <section className="flex-1 space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-yellow-300">Hives Registry</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="rounded-xl bg-yellow-300 px-4 py-2 font-bold text-black hover:bg-yellow-400"
        >
          {showForm ? 'Cancel' : '+ Add Hive'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="grid gap-4 rounded-2xl bg-zinc-900 p-6 border border-zinc-800 md:grid-cols-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 uppercase">QR Code *</label>
            <input
              className="w-full rounded-lg bg-zinc-950 border-zinc-800 p-2.5 text-white"
              value={newHive.qr_code}
              onChange={e => setNewHive({...newHive, qr_code: e.target.value})}
              placeholder="e.g. H-001"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 uppercase">Location *</label>
            <select
              className="w-full rounded-lg bg-zinc-950 border-zinc-800 p-2.5 text-white"
              value={newHive.location_id}
              onChange={e => setNewHive({...newHive, location_id: e.target.value})}
            >
              <option value="">Select Location</option>
              {allLocations.map(loc => (
                <option key={loc._id} value={loc._id}>{loc.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 uppercase">Type</label>
            <input
              className="w-full rounded-lg bg-zinc-950 border-zinc-800 p-2.5 text-white"
              value={newHive.type}
              onChange={e => setNewHive({...newHive, type: e.target.value})}
            />
          </div>
          <button className="col-span-full rounded-xl bg-zinc-100 p-3 font-bold text-black hover:bg-white transition">
            Confirm Registration
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <select
          className="h-11 rounded-xl border border-zinc-700 bg-zinc-900 px-3 text-sm text-white focus:border-yellow-300 outline-none"
          value={selectedLocation}
          onChange={(event) => setSelectedLocation(event.target.value)}
        >
          {locationsFilter.map((location) => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
        <input
          className="h-11 rounded-xl border border-zinc-700 bg-zinc-900 px-3 text-sm text-white focus:border-yellow-300 outline-none"
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search QR or status..."
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-zinc-800/70 text-zinc-300">
            <tr>
              <th className="px-4 py-3 font-semibold">QR</th>
              <th className="px-4 py-3 font-semibold">Location</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredHives.map((hive) => (
              <tr key={hive._id} className="border-t border-zinc-800">
                <td className="px-4 py-3 font-bold text-yellow-200">{hive.qr_code}</td>
                <td className="px-4 py-3 text-zinc-200">{hive.location_id?.name ?? '—'}</td>
                <td className="px-4 py-3 text-zinc-200">{hive.type}</td>
                <td className="px-4 py-3 text-zinc-200">{hive.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default AdminHivesPage
