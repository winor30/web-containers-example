import { runWebContainer, writeIndexJS } from '@/webcontainers'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'

export const Editor = () => {
  const [content, setContent] = useState<string>("I am a textarea")
  useEffect(() => {
    runWebContainer()
  }, [])
  const onChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    writeIndexJS(e.target.value)
  }, [])
  return (
    <div>
      <div>
        <textarea value={content} onChange={onChange} />
      </div>
      <div>
        <iframe width="500" height="500" src="loading.html" />
      </div>
      <div id='terminal' />
    </div>
  )
}
