import AppRouter from './app/AppRouter'
import useAuthBootstrap from './hooks/useAuthBootstrap'
import useOfflineSync from './hooks/useOfflineSync'
import useNetworkStatusListener from './hooks/useNetworkStatusListener'

function App() {
  useNetworkStatusListener()
  useOfflineSync()
  useAuthBootstrap()

  return <AppRouter />
}

export default App
