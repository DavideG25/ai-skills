import { useState } from 'react'
import { getRoomUrl } from '../lib/roomCode'

interface RoomHeaderProps {
  roomCode: string
  participantCount: number
}

export function RoomHeader({ roomCode, participantCount }: RoomHeaderProps) {
  const [copied, setCopied] = useState<'code' | 'link' | null>(null)

  const copyCode = async () => {
    await navigator.clipboard.writeText(roomCode)
    setCopied('code')
    setTimeout(() => setCopied(null), 2000)
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(getRoomUrl(roomCode))
    setCopied('link')
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <header className="room-header">
      <div className="room-info">
        <span className="room-code">{roomCode}</span>
        <span className="participant-count">{participantCount} partecipant{participantCount === 1 ? 'e' : 'i'}</span>
      </div>
      <div className="room-actions">
        <button type="button" className="btn-ghost" onClick={copyCode}>
          {copied === 'code' ? '✓ Copiato' : 'Copia codice'}
        </button>
        <button type="button" className="btn-ghost" onClick={copyLink}>
          {copied === 'link' ? '✓ Copiato' : 'Copia link'}
        </button>
      </div>
    </header>
  )
}
