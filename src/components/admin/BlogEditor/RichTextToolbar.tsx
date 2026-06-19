import { Bold, Italic, Underline, Heading2, List, ListOrdered, Link2, Minus, ImagePlus, UploadCloud, Video } from 'lucide-react'

interface RichTextToolbarProps {
  execCmd: (cmd: string, value?: string) => void
  insertLink: () => void
  insertImage: () => void
  handleContentImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  insertVideo: () => void
}

export function RichTextToolbar({ execCmd, insertLink, insertImage, handleContentImageUpload, insertVideo }: RichTextToolbarProps) {
  return (
    <div style={{
      background: '#f9fafb', padding: '8px 12px', borderBottom: '1px solid #e5e7eb',
      display: 'flex', gap: 4, flexWrap: 'wrap',
    }}>
      {[
        { icon: Bold, cmd: 'bold', tip: 'In đậm' },
        { icon: Italic, cmd: 'italic', tip: 'In nghiêng' },
        { icon: Underline, cmd: 'underline', tip: 'Gạch chân' },
      ].map(({ icon: Icon, cmd, tip }) => (
        <button key={cmd} type="button" title={tip}
          onClick={() => execCmd(cmd)}
          style={{
            background: 'none', border: '1px solid transparent', borderRadius: 6,
            padding: '6px 8px', cursor: 'pointer', color: '#4b5563',
            display: 'flex', alignItems: 'center',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#e5e7eb' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
        >
          <Icon size={16} />
        </button>
      ))}

      <div style={{ width: 1, height: 24, background: '#e5e7eb', margin: '0 4px', alignSelf: 'center' }} />

      <button type="button" title="Heading" onClick={() => execCmd('formatBlock', 'h2')}
        style={{ background: 'none', border: '1px solid transparent', borderRadius: 6, padding: '6px 8px', cursor: 'pointer', color: '#4b5563', display: 'flex', alignItems: 'center' }}
        onMouseEnter={e => { e.currentTarget.style.background = '#e5e7eb' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
      >
        <Heading2 size={16} />
      </button>

      <button type="button" title="Danh sách" onClick={() => execCmd('insertUnorderedList')}
        style={{ background: 'none', border: '1px solid transparent', borderRadius: 6, padding: '6px 8px', cursor: 'pointer', color: '#4b5563', display: 'flex', alignItems: 'center' }}
        onMouseEnter={e => { e.currentTarget.style.background = '#e5e7eb' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
      >
        <List size={16} />
      </button>

      <button type="button" title="Danh sách số" onClick={() => execCmd('insertOrderedList')}
        style={{ background: 'none', border: '1px solid transparent', borderRadius: 6, padding: '6px 8px', cursor: 'pointer', color: '#4b5563', display: 'flex', alignItems: 'center' }}
        onMouseEnter={e => { e.currentTarget.style.background = '#e5e7eb' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
      >
        <ListOrdered size={16} />
      </button>

      <div style={{ width: 1, height: 24, background: '#e5e7eb', margin: '0 4px', alignSelf: 'center' }} />

      <button type="button" title="Chèn liên kết" onClick={insertLink}
        style={{ background: 'none', border: '1px solid transparent', borderRadius: 6, padding: '6px 8px', cursor: 'pointer', color: '#4b5563', display: 'flex', alignItems: 'center' }}
        onMouseEnter={e => { e.currentTarget.style.background = '#e5e7eb' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
      >
        <Link2 size={16} />
      </button>

      <button type="button" title="Đường kẻ ngang" onClick={() => execCmd('insertHorizontalRule')}
        style={{ background: 'none', border: '1px solid transparent', borderRadius: 6, padding: '6px 8px', cursor: 'pointer', color: '#4b5563', display: 'flex', alignItems: 'center' }}
        onMouseEnter={e => { e.currentTarget.style.background = '#e5e7eb' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
      >
        <Minus size={16} />
      </button>

      <div style={{ width: 1, height: 24, background: '#e5e7eb', margin: '0 4px', alignSelf: 'center' }} />

      {/* Image buttons */}
      <button type="button" title="Chèn ảnh từ URL" onClick={insertImage}
        style={{ background: 'none', border: '1px solid transparent', borderRadius: 6, padding: '6px 8px', cursor: 'pointer', color: '#4b5563', display: 'flex', alignItems: 'center' }}
        onMouseEnter={e => { e.currentTarget.style.background = '#e5e7eb' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
      >
        <ImagePlus size={16} />
      </button>

      <label title="Upload ảnh vào bài viết" style={{ background: 'none', border: '1px solid transparent', borderRadius: 6, padding: '6px 8px', cursor: 'pointer', color: '#4b5563', display: 'flex', alignItems: 'center' }}
        onMouseEnter={e => { e.currentTarget.style.background = '#e5e7eb' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
      >
        <UploadCloud size={16} />
        <input type="file" accept="image/*" onChange={handleContentImageUpload} style={{ display: 'none' }} />
      </label>

      {/* Video button */}
      <button type="button" title="Chèn video (YouTube, Vimeo, .mp4)" onClick={insertVideo}
        style={{ background: 'none', border: '1px solid transparent', borderRadius: 6, padding: '6px 8px', cursor: 'pointer', color: '#e8720c', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600 }}
        onMouseEnter={e => { e.currentTarget.style.background = '#fff7ed' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
      >
        <Video size={16} /> Video
      </button>
    </div>
  )
}
