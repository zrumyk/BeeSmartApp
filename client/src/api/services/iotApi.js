import axiosClient from '../axiosClient'

export async function getHiveYield(hiveId) {
  const response = await axiosClient.get(`/iot/hive/${hiveId}/yield`)
  return response.data.data ?? []
}
