import { useState, useEffect } from 'react'
import { getAllLocations, createLocation, deleteLocation } from '../../api/services/locationsApi'
import toast from 'react-hot-toast'

function AdminLocationsPage() {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [newLocation, setNewLocation] = useState({
    name: '',
    region: '',
    lat: '',
    lng: '',
    max_capacity: 50
  })

  const fetchLocations = async () => {
    try {
      const data = await getAllLocations()
      setLocations(data)
    } catch (error) {
      toast.error('Failed to load locations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLocations()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    
    // Перетворюємо плоскі поля в структуру, яку очікує модель Location.js
    const payload = {
      name: newLocation.name,
      region: newLocation.region,
      coordinates: {
        lat: Number(newLocation.lat),
        lng: Number(newLocation.lng)
      },
      max_capacity: Number(newLocation.max_capacity)
    }

    if (!payload.name || !payload.region || isNaN(payload.coordinates.lat)) {
      return toast.error('Please fill all required fields correctly')
    }

    try {
      await createLocation(payload)
      toast.success('Location created successfully')
      setNewLocation({ name: '', region: '', lat: '', lng: '', max_capacity: 50 })
      fetchLocations()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create location')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      await deleteLocation(id)
      toast.success('Location removed')
      fetchLocations()
    } catch (error) {
      toast.error('Cannot delete location with hives')
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Locations & Apiaries</h1>

      <form onSubmit={handleCreate} className="max-w-2xl grid grid-cols-2 gap-4 rounded-2xl bg-zinc-900 p-6 border border-zinc-800">
        <h2 className="col-span-2 text-lg font-semibold text-yellow-300">Register New Apiary</h2>
        
        <div className="space-y-1">
          <label className="text-xs font-bold text-zinc-500 uppercase">Name</label>
          <input
            type="text" className="w-full rounded-xl bg-zinc-950 border-zinc-800 text-white p-3"
            value={newLocation.name} onChange={e => setNewLocation({...newLocation, name: e.target.value})}
            placeholder="Main Field"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-zinc-500 uppercase">Region</label>
          <input
            type="text" className="w-full rounded-xl bg-zinc-950 border-zinc-800 text-white p-3"
            value={newLocation.region} onChange={e => setNewLocation({...newLocation, region: e.target.value})}
            placeholder="Kyiv region"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-zinc-500 uppercase">Latitude</label>
          <input
            type="number" step="any" className="w-full rounded-xl bg-zinc-950 border-zinc-800 text-white p-3"
            value={newLocation.lat} onChange={e => setNewLocation({...newLocation, lat: e.target.value})}
            placeholder="50.4501"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-zinc-500 uppercase">Longitude</label>
          <input
            type="number" step="any" className="w-full rounded-xl bg-zinc-950 border-zinc-800 text-white p-3"
            value={newLocation.lng} onChange={e => setNewLocation({...newLocation, lng: e.target.value})}
            placeholder="30.5234"
          />
        </div>

        <button className="col-span-2 mt-2 rounded-xl bg-yellow-300 p-3 font-bold text-black hover:bg-yellow-400 transition">
          Confirm Location
        </button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="text-zinc-500">Loading apiaries...</p>
        ) : (
          locations.map((loc) => (
            <div key={loc._id} className="group relative rounded-2xl bg-zinc-900 border border-zinc-800 p-5 hover:border-yellow-300/50 transition">
              <h3 className="font-bold text-white text-lg">{loc.name}</h3>
              <p className="text-sm text-zinc-400">{loc.region}</p>
              <div className="mt-3 flex gap-3 text-xs font-mono text-zinc-500">
                <span>LAT: {loc.coordinates?.lat}</span>
                <span>LNG: {loc.coordinates?.lng}</span>
              </div>
              <button 
                onClick={() => handleDelete(loc._id)}
                className="absolute top-5 right-5 text-zinc-700 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AdminLocationsPage
