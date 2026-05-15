import axiosClient from '../axiosClient'

export async function getAllHives() {
  const response = await axiosClient.get('/hives')
  return response.data.data ?? []
}

export async function getSickHives() {
  const response = await axiosClient.get('/hives/sick')
  return response.data.data ?? []
}

export async function getHiveByQrCode(qrCode) {
  const response = await axiosClient.get(`/hives/qr/${encodeURIComponent(qrCode)}`)
  return response.data.data
}
