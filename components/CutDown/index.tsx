import type { NextPage } from 'next'
import { useEffect, useState } from 'react'

interface Iprops {
  time: number;
  onEnd: () => void;
}
const CutDown: NextPage<Iprops> = (props) => {
  const { time, onEnd } = props
  const [count, setCount] = useState(time)
  useEffect(() => {
    const id = setInterval(() => {
      setCount((prev: number) => {
        if (prev === 1) {
          onEnd()
          clearInterval(id)
          return time
        }
        return prev - 1
      })
    }, 1000)
    return () => {
      clearInterval(id)
    }
  }, [count, onEnd, time])
  return <div>{count}</div>
}

export default CutDown