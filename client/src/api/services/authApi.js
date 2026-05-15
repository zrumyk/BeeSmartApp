import axiosClient from '../axiosClient'

export async function loginRequest(payload) {
  const response = await axiosClient.post('/auth/login', payload)
  return response.data.data
}

export async function meRequest() {
  const response = await axiosClient.get('/auth/me')
  return response.data.data
}

export async function getBeekeepersRequest() {
  const response = await axiosClient.get('/auth/beekeepers')
  return response.data.data ?? []
}
