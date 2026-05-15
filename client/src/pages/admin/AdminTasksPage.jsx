import { useEffect, useState, useMemo } from 'react'
import toast from 'react-hot-toast'
import { getBeekeepersRequest } from '../../api/services/authApi'
import { getAllHives } from '../../api/services/hivesApi'
import { createVetTask, getAllVetTasks } from '../../api/services/vetTasksApi'

function AdminTasksPage() {
  const [hives, setHives] = useState([])
  const [beekeepers, setBeekeepers] = useState([])
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [hiveId, setHiveId] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [treatmentType, setTreatmentType] = useState('Обробка від кліща')
  const [scheduledDate, setScheduledDate] = useState('')
  const [notes, setNotes] = useState('')

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [hivesData, beekeepersData, tasksData] = await Promise.all([
        getAllHives(),
        getBeekeepersRequest(),
        getAllVetTasks(),
      ])
      setHives(hivesData)
      setBeekeepers(beekeepersData)
      setTasks(tasksData)
      if (hivesData[0]?._id) setHiveId(hivesData[0]._id)
      if (beekeepersData[0]?._id) setAssignedTo(beekeepersData[0]._id)
    } catch {
      toast.error('Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const { pendingTasks, completedTasks } = useMemo(() => ({
    pendingTasks: tasks.filter(t => t.status === 'pending'),
    completedTasks: tasks.filter(t => t.status === 'completed')
  }), [tasks])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await createVetTask({
        hive_id: hiveId,
        assigned_to: assignedTo,
        task_type: treatmentType,
        medication: notes,
        due_date: scheduledDate,
      })
      toast.success('Task assigned')
      fetchData()
      setScheduledDate('')
      setNotes('')
    } catch (error) {
      toast.error('Failed to assign task')
    } finally {
      setIsSubmitting(false)
    }
  }

  const TaskCard = ({ task }) => (
    <article className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
      <div className="flex justify-between">
        <p className="font-bold text-yellow-200">{task.task_type}</p>
        <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded ${task.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
          {task.status}
        </span>
      </div>
      <p className="text-xs text-zinc-400 mt-1">Hive: {task.hive_id?.qr_code} • {task.assigned_to?.name}</p>
      <p className="text-xs text-zinc-500 mt-2">Due: {new Date(task.due_date).toLocaleDateString()}</p>
    </article>
  )

  if (isLoading) return <p className="p-6 text-zinc-500">Loading tasks...</p>

  return (
    <section className="flex-1 space-y-8 p-6">
      <h1 className="text-3xl font-black text-white">Tasks Management</h1>

      <form onSubmit={handleSubmit} className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl bg-zinc-900 p-6 border border-zinc-800">
        <h2 className="col-span-full text-lg font-semibold text-yellow-300">Assign New Task</h2>
        <select className="h-11 rounded-xl bg-zinc-950 border-zinc-800 text-white px-3"
          value={hiveId} onChange={e => setHiveId(e.target.value)}>
          {hives.map(h => <option key={h._id} value={h._id}>{h.qr_code}</option>)}
        </select>
        <select className="h-11 rounded-xl bg-zinc-950 border-zinc-800 text-white px-3"
          value={assignedTo} onChange={e => setAssignedTo(e.target.value)}>
          {beekeepers.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
        </select>
        <input type="date" className="h-11 rounded-xl bg-zinc-950 border-zinc-800 text-white px-3"
          value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} required />
        <input type="text" placeholder="Medication / Notes" className="h-11 rounded-xl bg-zinc-950 border-zinc-800 text-white px-3"
          value={notes} onChange={e => setNotes(e.target.value)} />
        <button disabled={isSubmitting} className="col-span-full h-12 rounded-xl bg-yellow-300 font-black text-black hover:bg-yellow-400 transition">
          Assign Treatment
        </button>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            Pending <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-0.5 rounded-full">{pendingTasks.length}</span>
          </h2>
          <div className="space-y-3">
            {pendingTasks.map(t => <TaskCard key={t._id} task={t} />)}
          </div>
        </div>

        <div className="space-y-4 opacity-60">
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            Completed <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-0.5 rounded-full">{completedTasks.length}</span>
          </h2>
          <div className="space-y-3">
            {completedTasks.map(t => <TaskCard key={t._id} task={t} />)}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdminTasksPage
