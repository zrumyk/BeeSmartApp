import axiosClient from '../axiosClient'

export async function getAllVetTasks() {
  const response = await axiosClient.get('/vet-tasks')
  return response.data.data ?? []
}

export async function getMyVetTasks() {
  const response = await axiosClient.get('/vet-tasks/my-tasks')
  return response.data.data ?? []
}

export async function createVetTask(payload) {
  const response = await axiosClient.post('/vet-tasks', payload)
  return response.data.data
}
