import { useState, useEffect } from 'react'
import { getAllLocations, createLocation, deleteLocation } from '../../api/services/locationsApi'
import toast from 'react-hot-toast'

function AdminLocationsPage() {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [newLocation, setNewLocation] = useState({ name: '', address: '' })

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
    if (!newLocation.name || !newLocation.address) return

    try {
      await createLocation(newLocation)
      toast.success('Location created successfully')
      setNewLocation({ name: '', address: '' })
      fetchLocations()
    } catch (error) {
      toast.error('Failed to create location')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this location?')) return
    try {
      await deleteLocation(id)
      toast.success('Location deleted')
      fetchLocations()
    } catch (error) {
      toast.error('Cannot delete location with hives')
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Manage Locations</h1>

      <form onSubmit={handleCreate} className="max-w-md space-y-4 rounded-2xl bg-zinc-900 p-6 border border-zinc-800">
        <h2 className="text-lg font-semibold text-yellow-300">Add New Apiary</h2>
        <input
          type="text"
          placeholder="Apiary Name (e.g. West Garden)"
          className="w-full rounded-xl bg-zinc-950 border-zinc-800 text-white p-3 focus:ring-yellow-300"
          value={newLocation.name}
          onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Address / GPS"
          className="w-full rounded-xl bg-zinc-950 border-zinc-800 text-white p-3 focus:ring-yellow-300"
          value={newLocation.address}
          onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
        />
        <button type="submit" className="w-full rounded-xl bg-yellow-300 p-3 font-bold text-black hover:bg-yellow-400 transition">
          Create Location
        </button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="text-zinc-500">Loading...</p>
        ) : locations.length === 0 ? (
          <p className="text-zinc-500">No locations found.</p>
        ) : (
          locations.map((loc) => (
            <div key={loc._id} className="flex justify-between items-center rounded-2xl bg-zinc-900 border border-zinc-800 p-5">
              <div>
                <h3 className="font-bold text-white text-lg">{loc.name}</h3>
                <p className="text-sm text-zinc-400">{loc.address}</p>
              </div>
              <button 
                onClick={() => handleDelete(loc._id)}
                className="text-zinc-500 hover:text-red-500 transition"
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
