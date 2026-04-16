import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import { useEffect } from 'react'

interface RichEditorProps {
  onChange: (text: string) => void
  placeholder?: string
}

export function RichEditor({ onChange, placeholder }: RichEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Underline, Highlight],
    content: '',
    onUpdate({ editor }) {
      onChange(editor.getText())
    },
  })

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
