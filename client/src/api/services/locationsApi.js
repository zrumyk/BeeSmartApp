import axiosClient from '../axiosClient'

export async function getAllLocations() {
  const response = await axiosClient.get('/locations')
  return response.data.data ?? []
}

export async function getLocationById(id) {
  const response = await axiosClient.get(`/locations/${id}`)
  return response.data.data
}

export async function createLocation(payload) {
  const response = await axiosClient.post('/locations', payload)
  return response.data.data
}

export async function updateLocation(id, payload) {
  const response = await axiosClient.put(`/locations/${id}`, payload)
  return response.data.data
}

export async function deleteLocation(id) {
  const response = await axiosClient.delete(`/locations/${id}`)
  return response.data
}
