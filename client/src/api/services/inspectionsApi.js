import axiosClient from '../axiosClient'
import { OFFLINE_INSPECTIONS_KEY } from '../../config/constants'

const objectIdPattern = /^[a-f\d]{24}$/i

function isValidInspectionPayload(item) {
  return Boolean(
    item &&
      typeof item === 'object' &&
      objectIdPattern.test(item.hive_id ?? '') &&
      item.details &&
      Number.isFinite(Number(item.details.brood_frames)) &&
      Number.isFinite(Number(item.details.honey_frames)),
  )
}

function normalizeQueueItem(item) {
  if (!item || typeof item !== 'object') {
    return null
  }

  if (!item.hive_id) {
    return null
  }

  const normalized = {
    ...item,
    hive_id: String(item.hive_id),
    date: item.date ?? new Date().toISOString(),
    client_inspection_id:
      item.client_inspection_id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    details: {
      brood_frames: Number(item.details?.brood_frames ?? 0),
      honey_frames: Number(item.details?.honey_frames ?? 0),
      temper: item.details?.temper ?? '',
      notes: item.details?.notes ?? '',
    },
  }

  return isValidInspectionPayload(normalized) ? normalized : null
}

export function getOfflineInspections() {
  const rawValue = localStorage.getItem(OFFLINE_INSPECTIONS_KEY)
  if (!rawValue) return []
  try {
    const parsed = JSON.parse(rawValue)
    if (!Array.isArray(parsed)) return []
    const normalized = parsed.map(normalizeQueueItem).filter(Boolean)
    if (normalized.length !== parsed.length) saveOfflineInspections(normalized)
    return normalized
  } catch { return [] }
}

export function saveOfflineInspections(inspections) {
  localStorage.setItem(OFFLINE_INSPECTIONS_KEY, JSON.stringify(inspections))
}

export function clearOfflineInspections() {
  localStorage.setItem(OFFLINE_INSPECTIONS_KEY, JSON.stringify([]))
}

export function enqueueOfflineInspection(inspection) {
  const normalized = normalizeQueueItem(inspection)
  if (!normalized) return getOfflineInspections()
  const current = getOfflineInspections()
  const nextQueue = [...current, normalized]
  saveOfflineInspections(nextQueue)
  return nextQueue
}

export async function syncInspectionBatch(inspections) {
  if (!inspections.length) return { syncedCount: 0, duplicatesCount: 0, failedCount: 0 }
  const response = await axiosClient.post('/inspections/sync', inspections)
  return response.data
}

export async function syncOfflineInspections() {
  const queue = getOfflineInspections()
  if (!queue.length) return { syncedCount: 0, queueSize: 0 }
  const response = await syncInspectionBatch(queue)
  const failedItems = response?.data?.errors ?? []
  const failedIds = new Set(failedItems.map((item) => item.client_inspection_id).filter(Boolean))
  const nextQueue = queue.filter((item) => failedIds.has(item.client_inspection_id))
  saveOfflineInspections(nextQueue)
  return {
    syncedCount: response?.data?.saved ?? 0,
    duplicatesCount: response?.data?.duplicates ?? 0,
    failedCount: response?.data?.failed ?? 0,
    queueSize: nextQueue.length,
  }
}

export async function getAllInspections() {
  const response = await axiosClient.get('/inspections')
  return response.data.data ?? []
}

export async function getHiveInspectionHistory(hiveId) {
  const response = await axiosClient.get(`/inspections/hive/${hiveId}`)
  return response.data.data ?? []
}
