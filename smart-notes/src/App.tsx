import { useState, useCallback } from 'react'
import { Lobby } from './components/Lobby'
import { RoomHeader } from './components/RoomHeader'
import { ParticipantBlock } from './components/ParticipantBlock'
import { StructuredOutput } from './components/StructuredOutput'
import { useRoom } from './hooks/useRoom'
import { structureNotes } from './lib/claude'

export default function App() {
  const [localName, setLocalName] = useState('')
  const [localRole, setLocalRole] = useState('')
  const [apiKey, setApiKey] = useState(() => sessionStorage.getItem('sn-api-key') ?? '')
  const [isStructuring, setIsStructuring] = useState(false)
  const [structureError, setStructureError] = useState('')

  const room = useRoom({ localName, localRole })

  const handleCreateRoom = useCallback(
    (code: string, name: string, role: string) => {
      setLocalName(name)
      setLocalRole(role)
      room.createRoom(code)
    },
    [room],
  )

  const handleJoinRoom = useCallback(
    (code: string, name: string, role: string) => {
      setLocalName(name)
      setLocalRole(role)
      room.joinRoom(code)
    },
    [room],
  )

  const handleApiKeySet = useCallback((key: string) => {
    setApiKey(key)
    sessionStorage.setItem('sn-api-key', key)
  }, [])

  const handleStructure = useCallback(async () => {
    setStructureError('')
    setIsStructuring(true)
    try {
      const markdown = await structureNotes(room.participants, apiKey)
      room.structureAndBroadcast(markdown)
    } catch (err) {
      setStructureError(err instanceof Error ? err.message : 'Errore sconosciuto')
    } finally {
      setIsStructuring(false)
    }
  }, [room, apiKey])

  if (room.phase === 'lobby') {
    return (
      <Lobby
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
        onApiKeySet={handleApiKeySet}
        savedApiKey={apiKey}
      />
    )
  }

  if (room.phase === 'closed') {
    return (
      <div className="closed-screen">
        <div className="card">
          <h2>Stanza chiusa</h2>
          <p>Il creatore ha chiuso la stanza. La sessione è terminata.</p>
          <button type="button" className="btn-primary" onClick={room.reset}>
            Torna alla home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app-layout">
      {room.roomCode && (
        <RoomHeader roomCode={room.roomCode} participantCount={room.participants.length} />
      )}

      <main className="main-content">
        {room.phase === 'structured' && room.structuredOutput ? (
          <div className="split-view">
            <section className="blocks-panel">
              <h3 className="panel-title">Appunti dei partecipanti</h3>
              {room.participants.map((p) => (
                <ParticipantBlock
                  key={p.peerId}
                  name={p.name}
                  role={p.role}
                  content={p.content}
                  isLocal={p.isLocal}
                  onContentChange={p.isLocal ? room.updateLocalContent : undefined}
                />
              ))}
            </section>
            <section className="output-panel">
              <StructuredOutput
                markdown={room.structuredOutput}
                isCreator={room.isCreator}
                onCloseRoom={room.closeRoom}
              />
            </section>
          </div>
        ) : (
          <div className="room-view">
            <div className="blocks-grid">
              {room.participants.map((p) => (
                <ParticipantBlock
                  key={p.peerId}
                  name={p.name}
                  role={p.role}
                  content={p.content}
                  isLocal={p.isLocal}
                  onContentChange={p.isLocal ? room.updateLocalContent : undefined}
                />
              ))}
            </div>

            <div className="bottom-bar">
              {structureError && <p className="error-msg">{structureError}</p>}
              {room.isCreator && (
                <button
                  type="button"
                  className="btn-primary btn-large"
                  onClick={handleStructure}
                  disabled={isStructuring}
                >
                  {isStructuring ? 'Elaborazione...' : '✨ Struttura note'}
                </button>
              )}
              {!room.isCreator && (
                <p className="waiting-msg">In attesa che il creatore strutturi le note...</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
