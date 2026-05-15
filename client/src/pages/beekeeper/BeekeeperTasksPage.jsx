import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { getMyVetTasks, completeVetTask } from '../../api/services/vetTasksApi'

function BeekeeperTasksPage() {
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)

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

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleComplete = async (taskId) => {
    try {
      await completeVetTask(taskId)
      toast.success('Завдання виконано!')
      // Remove from local state for immediate feedback
      setTasks(prev => prev.filter(t => t._id !== taskId))
    } catch (error) {
      toast.error('Не вдалося оновити статус завдання')
    }
  }

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
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <p className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-8 text-center font-semibold text-zinc-400">
            На сьогодні завдань немає 🙌
          </p>
        ) : (
          tasks.map((task) => (
            <article
              key={task._id}
              className="flex flex-col justify-between rounded-2xl border-2 border-zinc-800 bg-zinc-900/50 p-5 shadow-xl"
            >
              <div className="mb-4">
                <p className="text-lg font-bold text-white">{task.task_type}</p>
                <p className="mt-1 text-sm text-zinc-400">Вулик: <span className="text-yellow-200 font-mono">{task?.hive_id?.qr_code ?? '—'}</span></p>
                <p className="mt-1 text-xs font-bold uppercase text-zinc-500">
                  Термін: {new Date(task.due_date).toLocaleDateString()}
                </p>
              </div>
              
              <button
                onClick={() => handleComplete(task._id)}
                className="w-full rounded-xl bg-yellow-300 py-3 text-sm font-black text-black transition hover:bg-yellow-400 active:scale-95"
              >
                ВИКОНАНО
              </button>
            </article>
          ))
        )}
      </div>
    </section>
  )
}

export default BeekeeperTasksPage
