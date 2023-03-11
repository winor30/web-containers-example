import { runWebContainer } from '@/webcontainers'
import { useEffect } from 'react'

export const Editor = () => {
  useEffect(() => {
    runWebContainer()
  }, [])
  return (
    <div>
      <div>
        <textarea defaultValue={"I am a textarea"} />
      </div>
      <div>
        <iframe width="500" height="500" src="loading.html" />
      </div>
    </div>
  )
}
