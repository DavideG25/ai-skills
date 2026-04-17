import { useState, useEffect } from 'react'
import { generateRoomCode } from '../lib/roomCode'

const ROLES = [
  'Moderatore',
  'Product Manager',
  'Designer',
  'Developer',
  'Tech Lead',
  'Stakeholder',
  'Marketing',
  'Sales',
  'Altro',
]

interface SavedSession {
  name: string
  role: string
  roomCode: string
}

interface LobbyProps {
  onCreateRoom: (code: string, name: string, role: string) => void
  onJoinRoom: (code: string, name: string, role: string) => void
  savedSession: SavedSession | null
  peerError: string
}

export function Lobby({ onCreateRoom, onJoinRoom, savedSession, peerError }: LobbyProps) {
  const [name, setName] = useState(savedSession?.name ?? '')
  const [role, setRole] = useState(savedSession?.role ?? ROLES[0])
  const [joinCode, setJoinCode] = useState(savedSession?.roomCode ?? '')
  const [mode, setMode] = useState<'create' | 'join'>(savedSession ? 'join' : 'create')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const roomParam = params.get('room')
    if (roomParam) {
      setJoinCode(roomParam)
      setMode('join')
    }
  }, [])

  const handleCreate = () => {
    if (!name.trim()) return
    const code = generateRoomCode()
    onCreateRoom(code, name.trim(), role)
  }

  const handleJoin = () => {
    if (!name.trim() || !joinCode.trim()) return
    onJoinRoom(joinCode.trim(), name.trim(), role)
  }

  return (
    <div className="lobby">
      <div className="logo">
        <span className="logo-icon">📝</span>
        <h1>Smart Notes</h1>
        <p className="subtitle">Note collaborative con AI</p>
      </div>

      <div className="card">
        <div className="tab-bar">
          <button
            type="button"
            className={mode === 'create' ? 'tab active' : 'tab'}
            onClick={() => setMode('create')}
          >
            Crea stanza
          </button>
          <button
            type="button"
            className={mode === 'join' ? 'tab active' : 'tab'}
            onClick={() => setMode('join')}
          >
            Entra in stanza
          </button>
        </div>

        <div className="form-fields">
          <div className="field">
            <label htmlFor="name">Il tuo nome *</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Es. Mario Rossi"
              autoFocus
              autoComplete="off"
            />
          </div>

          <div className="field">
            <label htmlFor="role">Ruolo</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {mode === 'join' && (
            <div className="field">
              <label htmlFor="join-code">Codice stanza *</label>
              <input
                id="join-code"
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Es. swift-moon-427"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>
          )}
        </div>

        {peerError && <p className="error-msg" style={{ marginBottom: '12px' }}>{peerError}</p>}

        <button
          type="button"
          className="btn-primary"
          onClick={mode === 'create' ? handleCreate : handleJoin}
          disabled={mode === 'create' ? !name.trim() : !name.trim() || !joinCode.trim()}
        >
          {mode === 'create' ? 'Crea stanza' : 'Entra nella stanza'}
        </button>
      </div>
    </div>
  )
}
