import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

interface StructuredOutputProps {
  markdown: string
  isCreator: boolean
  onCloseRoom: () => void
}

export function StructuredOutput({ markdown, isCreator, onCloseRoom }: StructuredOutputProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="structured-output">
      <div className="output-toolbar">
        <h2>Nota strutturata</h2>
        <div className="output-actions">
          <button type="button" className="btn-ghost" onClick={handleCopy}>
            {copied ? '✓ Copiato' : 'Copia Markdown'}
          </button>
          {isCreator && (
            <button type="button" className="btn-danger" onClick={onCloseRoom}>
              Chiudi stanza
            </button>
          )}
        </div>
      </div>
      <div className="markdown-body">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  )
}
