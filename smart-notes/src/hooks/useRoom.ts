import { useCallback, useEffect, useRef, useState } from 'react'
import Peer, { type DataConnection } from 'peerjs'
import type {
  ContentUpdatePayload,
  JoinPayload,
  Participant,
  PeerMessage,
  RoomPhase,
  StructuredOutputPayload,
} from '../types'

interface UseRoomOptions {
  localName: string
  localRole: string
}

interface UseRoomReturn {
  phase: RoomPhase
  roomCode: string | null
  localPeerId: string | null
  participants: Participant[]
  structuredOutput: string
  isCreator: boolean
  createRoom: (code: string) => void
  joinRoom: (code: string) => void
  updateLocalContent: (content: string) => void
  structureAndBroadcast: (markdown: string) => void
  closeRoom: () => void
  reset: () => void
}

const PEER_SERVER_CONFIG = {
  host: 'peerjs-server.herokuapp.com',
  port: 443,
  secure: true,
}

export function useRoom({ localName, localRole }: UseRoomOptions): UseRoomReturn {
  const [phase, setPhase] = useState<RoomPhase>('lobby')
  const [roomCode, setRoomCode] = useState<string | null>(null)
  const [localPeerId, setLocalPeerId] = useState<string | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [structuredOutput, setStructuredOutput] = useState('')
  const [isCreator, setIsCreator] = useState(false)

  const peerRef = useRef<Peer | null>(null)
  const connectionsRef = useRef<Map<string, DataConnection>>(new Map())

  const broadcast = useCallback((msg: PeerMessage) => {
    connectionsRef.current.forEach((conn) => {
      if (conn.open) conn.send(msg)
    })
  }, [])

  const handleMessage = useCallback((msg: PeerMessage, senderPeerId: string) => {
    if (msg.type === 'join') {
      const payload = msg.payload as JoinPayload
      setParticipants((prev) => {
        if (prev.find((p) => p.peerId === payload.peerId)) return prev
        return [
          ...prev,
          { peerId: payload.peerId, name: payload.name, role: payload.role, content: '', isLocal: false },
        ]
      })
    } else if (msg.type === 'content-update') {
      const payload = msg.payload as ContentUpdatePayload
      setParticipants((prev) =>
        prev.map((p) => (p.peerId === payload.peerId ? { ...p, content: payload.content } : p)),
      )
    } else if (msg.type === 'room-closed') {
      setPhase('closed')
      peerRef.current?.destroy()
    } else if (msg.type === 'structured-output') {
      const payload = msg.payload as StructuredOutputPayload
      setStructuredOutput(payload.markdown)
      setPhase('structured')
    }
    void senderPeerId
  }, [])

  const setupConnection = useCallback(
    (conn: DataConnection) => {
      conn.on('open', () => {
        connectionsRef.current.set(conn.peer, conn)
      })
      conn.on('data', (data) => handleMessage(data as PeerMessage, conn.peer))
      conn.on('close', () => {
        connectionsRef.current.delete(conn.peer)
      })
    },
    [handleMessage],
  )

  const createRoom = useCallback(
    (code: string) => {
      const peer = new Peer(code, PEER_SERVER_CONFIG)
      peerRef.current = peer

      peer.on('open', (id) => {
        setLocalPeerId(id)
        setRoomCode(code)
        setIsCreator(true)
        setPhase('room')
        setParticipants([
          { peerId: id, name: localName, role: localRole, content: '', isLocal: true },
        ])
      })

      peer.on('connection', (conn) => {
        setupConnection(conn)
        conn.on('open', () => {
          const joinMsg: PeerMessage = {
            type: 'join',
            payload: { peerId: conn.peer, name: '', role: '' } as JoinPayload,
          }
          void joinMsg
        })
      })

      peer.on('error', console.error)
    },
    [localName, localRole, setupConnection],
  )

  const joinRoom = useCallback(
    (code: string) => {
      const peer = new Peer(PEER_SERVER_CONFIG)
      peerRef.current = peer

      peer.on('open', (id) => {
        setLocalPeerId(id)
        setRoomCode(code)
        setPhase('room')
        setParticipants([
          { peerId: id, name: localName, role: localRole, content: '', isLocal: true },
        ])

        const conn = peer.connect(code)
        setupConnection(conn)

        conn.on('open', () => {
          const msg: PeerMessage = {
            type: 'join',
            payload: { peerId: id, name: localName, role: localRole } satisfies JoinPayload,
          }
          conn.send(msg)
        })
      })

      peer.on('connection', (conn) => {
        setupConnection(conn)
      })

      peer.on('error', console.error)
    },
    [localName, localRole, setupConnection],
  )

  const updateLocalContent = useCallback(
    (content: string) => {
      if (!localPeerId) return
      setParticipants((prev) =>
        prev.map((p) => (p.isLocal ? { ...p, content } : p)),
      )
      const msg: PeerMessage = {
        type: 'content-update',
        payload: { peerId: localPeerId, content } satisfies ContentUpdatePayload,
      }
      broadcast(msg)
    },
    [localPeerId, broadcast],
  )

  const structureAndBroadcast = useCallback(
    (markdown: string) => {
      setStructuredOutput(markdown)
      setPhase('structured')
      const msg: PeerMessage = {
        type: 'structured-output',
        payload: { markdown } satisfies StructuredOutputPayload,
      }
      broadcast(msg)
    },
    [broadcast],
  )

  const closeRoom = useCallback(() => {
    const msg: PeerMessage = { type: 'room-closed', payload: null }
    broadcast(msg)
    setPhase('closed')
    peerRef.current?.destroy()
  }, [broadcast])

  const reset = useCallback(() => {
    peerRef.current?.destroy()
    peerRef.current = null
    connectionsRef.current.clear()
    setPhase('lobby')
    setRoomCode(null)
    setLocalPeerId(null)
    setParticipants([])
    setStructuredOutput('')
    setIsCreator(false)
  }, [])

  useEffect(() => {
    return () => {
      peerRef.current?.destroy()
    }
  }, [])

  return {
    phase,
    roomCode,
    localPeerId,
    participants,
    structuredOutput,
    isCreator,
    createRoom,
    joinRoom,
    updateLocalContent,
    structureAndBroadcast,
    closeRoom,
    reset,
  }
}
