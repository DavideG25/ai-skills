import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import { useEffect } from 'react'
import type { JSONContent } from '@tiptap/core'

const STORAGE_KEY = 'sn-editor-content'

function loadSavedContent(): JSONContent | undefined {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as JSONContent) : undefined
  } catch {
    return undefined
  }
}

interface RichEditorProps {
  onChange: (text: string) => void
  placeholder?: string
}

export function RichEditor({ onChange, placeholder }: RichEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Underline, Highlight],
    content: loadSavedContent() ?? '',
    onUpdate({ editor }) {
      const json = editor.getJSON()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(json))
      onChange(editor.getText())
    },
  })

  useEffect(() => {
    if (editor) {
      const saved = loadSavedContent()
      if (saved) {
        onChange(editor.getText())
      }
    }
  }, [editor, onChange])

  useEffect(() => {
    return () => {
      editor?.destroy()
    }
  }, [editor])

  if (!editor) return null

  return (
    <div className="editor-wrapper">
      <div className="toolbar">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'active' : ''}
          title="Grassetto"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? 'active' : ''}
          title="Sottolineato"
        >
          <u>U</u>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={editor.isActive('highlight') ? 'active' : ''}
          title="Evidenzia"
        >
          H
        </button>
      </div>
      <EditorContent
        editor={editor}
        className="editor-content"
        placeholder={placeholder}
      />
    </div>
  )
}
