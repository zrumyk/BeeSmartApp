import { QrReader } from 'react-qr-reader'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function BeekeeperScannerPage() {
  const navigate = useNavigate()
  const [scanError, setScanError] = useState('')

  const handleResult = (result, error) => {
    if (result?.text) {
      navigate(`/beekeeper/hive/${encodeURIComponent(result.text)}`)
      return
    }

    if (error?.name === 'NotAllowedError') {
      setScanError('Немає доступу до камери. Дозвольте використання камери у браузері.')
    }
  }

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-4 bg-black p-4">
      <h1 className="text-2xl font-black text-yellow-300">Сканер QR</h1>
      <p className="text-sm text-zinc-300">Наведіть камеру на QR-код вулика.</p>

      <div className="overflow-hidden rounded-2xl border-2 border-yellow-300">
        <QrReader
          constraints={{ facingMode: 'environment' }}
          onResult={handleResult}
          containerStyle={{ width: '100%' }}
          videoContainerStyle={{ width: '100%' }}
          videoStyle={{ width: '100%' }}
        />
      </div>

      {scanError ? (
        <p className="rounded-xl bg-rose-500/20 px-3 py-2 text-sm text-rose-200">{scanError}</p>
      ) : null}

      <Link
        className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-center font-bold text-white"
        to="/beekeeper"
      >
        Назад
      </Link>
    </section>
  )
}

export default BeekeeperScannerPage
