import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { getMyVetTasks } from '../../api/services/vetTasksApi'

function BeekeeperTasksPage() {
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true)
      try {
        const data = await getMyVetTasks()
        setTasks(data)
      } catch {
        toast.error('Не вдалося завантажити завдання')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [])

  if (isLoading) {
    return (
      <section className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center bg-black p-4 pb-24">
        <p className="text-base font-semibold text-zinc-200">Завантаження завдань...</p>
      </section>
    )
  }

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-4 bg-black p-4 pb-24">
      <h1 className="text-2xl font-black text-yellow-300">Мої активні завдання</h1>
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-4 text-center font-semibold text-zinc-200">
            Тут поки що порожньо
          </p>
        ) : (
          tasks.map((task) => (
            <article
              key={task._id}
              className="rounded-xl border-2 border-zinc-700 bg-zinc-900 px-4 py-4"
            >
              <p className="text-base font-bold text-zinc-100">{task.task_type}</p>
              <p className="mt-1 text-sm text-zinc-300">Вулик: {task?.hive_id?.qr_code ?? '—'}</p>
              <p className="mt-1 text-sm text-zinc-300">
                До виконання: {new Date(task.due_date).toLocaleDateString()}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  )
}

export default BeekeeperTasksPage
