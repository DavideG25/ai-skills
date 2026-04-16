import { useState, useEffect } from 'react'
import { generateRoomCode } from '../lib/roomCode'

interface LobbyProps {
  onCreateRoom: (code: string, name: string, role: string) => void
  onJoinRoom: (code: string, name: string, role: string) => void
  onApiKeySet: (key: string) => void
  savedApiKey: string
}

export function Lobby({ onCreateRoom, onJoinRoom, onApiKeySet, savedApiKey }: LobbyProps) {
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [apiKey, setApiKey] = useState(savedApiKey)
  const [mode, setMode] = useState<'create' | 'join'>('create')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const roomParam = params.get('room')
    if (roomParam) {
      setJoinCode(roomParam)
      setMode('join')
    }
  }, [])

  const handleCreate = () => {
    if (!name.trim() || !apiKey.trim()) return
    onApiKeySet(apiKey.trim())
    const code = generateRoomCode()
    onCreateRoom(code, name.trim(), role.trim() || 'Partecipante')
  }

  const handleJoin = () => {
    if (!name.trim() || !joinCode.trim()) return
    if (apiKey.trim()) onApiKeySet(apiKey.trim())
    onJoinRoom(joinCode.trim(), name.trim(), role.trim() || 'Partecipante')
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
            />
          </div>

          <div className="field">
            <label htmlFor="role">Ruolo</label>
            <input
              id="role"
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Es. Product Manager"
            />
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
              />
            </div>
          )}

          {mode === 'create' && (
            <div className="field">
              <label htmlFor="api-key">Claude API Key *</label>
              <input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-..."
              />
              <span className="hint">Usata solo localmente, non viene salvata sul server</span>
            </div>
          )}

          {mode === 'join' && !savedApiKey && (
            <div className="field">
              <label htmlFor="api-key-join">Claude API Key (opzionale)</label>
              <input
                id="api-key-join"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-..."
              />
              <span className="hint">Necessaria solo se vuoi premere "Struttura"</span>
            </div>
          )}
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={mode === 'create' ? handleCreate : handleJoin}
          disabled={mode === 'create' ? !name.trim() || !apiKey.trim() : !name.trim() || !joinCode.trim()}
        >
          {mode === 'create' ? 'Crea stanza' : 'Entra nella stanza'}
        </button>
      </div>
    </div>
  )
}
