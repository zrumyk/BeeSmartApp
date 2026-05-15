import { useEffect } from 'react'
import useNetworkStore from '../store/networkStore'

function useNetworkStatusListener() {
  const setOnlineStatus = useNetworkStore((state) => state.setOnlineStatus)

  useEffect(() => {
    const handleOnline = () => setOnlineStatus(true)
    const handleOffline = () => setOnlineStatus(false)

    setOnlineStatus(navigator.onLine)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [setOnlineStatus])
}

export default useNetworkStatusListener
