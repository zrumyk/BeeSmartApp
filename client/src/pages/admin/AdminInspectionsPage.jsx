import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { getAllInspections } from '../../api/services/inspectionsApi'

function AdminInspectionsPage() {
  const [inspections, setInspections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInspections = async () => {
      try {
        const data = await getAllInspections()
        setInspections(data)
      } catch (error) {
        toast.error('Failed to load inspections')
      } finally {
        setLoading(false)
      }
    }
    fetchInspections()
  }, [])

  if (loading) return <p className="p-6 text-zinc-500">Loading history...</p>

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-black text-white">Inspections Log</h1>
      
      <div className="grid gap-4">
        {inspections.length === 0 ? (
          <p className="text-zinc-500">No inspections found yet.</p>
        ) : (
          inspections.map((ins) => (
            <div key={ins._id} className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-yellow-300 text-black text-[10px] font-black rounded uppercase">
                    Hive {ins.hive_id?.qr_code || '???'}
                  </span>
                  <span className="text-zinc-500 text-xs">
                    {new Date(ins.date).toLocaleString()}
                  </span>
                </div>
                <p className="text-white font-medium">Inspector: {ins.user_id?.name || 'Unknown'}</p>
                {ins.details?.notes && (
                  <p className="text-sm text-zinc-400 mt-2 italic">"{ins.details.notes}"</p>
                )}
              </div>

              <div className="flex gap-4 border-t border-zinc-800 md:border-none pt-4 md:pt-0">
                <div className="text-center">
                  <p className="text-[10px] text-zinc-500 uppercase font-bold">Brood</p>
                  <p className="text-xl font-black text-white">{ins.details?.brood_frames}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-zinc-500 uppercase font-bold">Honey</p>
                  <p className="text-xl font-black text-yellow-300">{ins.details?.honey_frames}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AdminInspectionsPage
