import { useEffect, useState } from 'react'
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

      if (hivesData[0]?._id) {
        setHiveId(hivesData[0]._id)
      }
      if (beekeepersData[0]?._id) {
        setAssignedTo(beekeepersData[0]._id)
      }
    } catch {
      toast.error('Не вдалося завантажити дані задач')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData()
    }, 0)

    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      await createVetTask({
        hive_id: hiveId,
        assigned_to: assignedTo,
        task_type: treatmentType,
        medication: notes,
        due_date: scheduledDate,
      })
      toast.success('Завдання створено')
      await fetchData()
      setTreatmentType('Обробка від кліща')
      setScheduledDate('')
      setNotes('')
    } catch (error) {
      toast.error(error?.response?.data?.message ?? 'Не вдалося створити завдання')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <section className="flex-1 p-6">
        <p className="font-semibold text-zinc-200">Завантаження задач...</p>
      </section>
    )
  }

  return (
    <section className="flex-1 space-y-5 p-6">
      <h1 className="text-3xl font-black text-yellow-300">Treatment Assignment</h1>

      <form
        className="max-w-3xl space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
        onSubmit={handleSubmit}
      >
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-zinc-300">Hive ID</span>
          <select
            className="h-11 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 text-sm text-white outline-none focus:border-yellow-300"
            value={hiveId}
            onChange={(event) => setHiveId(event.target.value)}
          >
            {hives.map((hive) => (
              <option key={hive._id} value={hive._id}>
                {hive.qr_code} ({hive.status})
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-zinc-300">Beekeeper</span>
          <select
            className="h-11 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 text-sm text-white outline-none focus:border-yellow-300"
            value={assignedTo}
            onChange={(event) => setAssignedTo(event.target.value)}
          >
            {beekeepers.map((beekeeper) => (
              <option key={beekeeper._id} value={beekeeper._id}>
                {beekeeper.name} ({beekeeper.email})
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-zinc-300">Treatment type</span>
          <select
            className="h-11 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 text-sm text-white outline-none focus:border-yellow-300"
            value={treatmentType}
            onChange={(event) => setTreatmentType(event.target.value)}
          >
            <option>Обробка від кліща</option>
            <option>Лікування нозематозу</option>
            <option>Санація вулика</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-zinc-300">Scheduled date</span>
          <input
            className="h-11 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 text-sm text-white outline-none focus:border-yellow-300"
            type="date"
            value={scheduledDate}
            onChange={(event) => setScheduledDate(event.target.value)}
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-zinc-300">Medication / Notes</span>
          <textarea
            className="min-h-24 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-yellow-300"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Additional veterinary instructions"
          />
        </label>

        <button
          className="h-12 rounded-xl bg-yellow-300 px-5 text-sm font-black text-black transition hover:bg-yellow-200 disabled:opacity-60"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Assign treatment'}
        </button>
      </form>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <h2 className="mb-3 text-xl font-bold text-zinc-100">Existing tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-zinc-300">Тут поки що порожньо</p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <article key={task._id} className="rounded-xl border border-zinc-700 bg-zinc-950 p-3">
                <p className="font-semibold text-yellow-200">{task.task_type}</p>
                <p className="text-sm text-zinc-300">Hive: {task?.hive_id?.qr_code ?? '—'}</p>
                <p className="text-sm text-zinc-300">
                  Assignee: {task?.assigned_to?.name ?? '—'} ({task?.assigned_to?.email ?? '—'})
                </p>
                <p className="text-sm text-zinc-300">
                  Due: {new Date(task.due_date).toLocaleDateString()} | Status: {task.status}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default AdminTasksPage
