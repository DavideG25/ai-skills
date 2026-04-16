export interface Participant {
  peerId: string
  name: string
  role: string
  content: string
  isLocal: boolean
}

export type RoomPhase = 'lobby' | 'room' | 'structured' | 'closed'

export interface PeerMessage {
  type: 'join' | 'content-update' | 'room-closed' | 'structured-output'
  payload: unknown
}

export interface JoinPayload {
  peerId: string
  name: string
  role: string
}

export interface ContentUpdatePayload {
  peerId: string
  content: string
}

export interface StructuredOutputPayload {
  markdown: string
}
