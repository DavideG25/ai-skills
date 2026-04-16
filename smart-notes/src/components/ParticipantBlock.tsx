import { RichEditor } from './RichEditor'

interface ParticipantBlockProps {
  name: string
  role: string
  content: string
  isLocal: boolean
  onContentChange?: (content: string) => void
}

export function ParticipantBlock({ name, role, content, isLocal, onContentChange }: ParticipantBlockProps) {
  return (
    <div className={`participant-block ${isLocal ? 'local' : 'remote'}`}>
      <div className="participant-header">
        <span className="participant-name">{name}</span>
        <span className="participant-role">{role}</span>
        {isLocal && <span className="badge-you">Tu</span>}
      </div>
      {isLocal ? (
        <RichEditor onChange={onContentChange ?? (() => {})} placeholder="Scrivi le tue note qui..." />
      ) : (
        <div className="readonly-content">
          {content ? (
            <p>{content}</p>
          ) : (
            <p className="placeholder">In attesa di note...</p>
          )}
        </div>
      )}
    </div>
  )
}
