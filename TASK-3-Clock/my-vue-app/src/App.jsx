import { useState, useEffect } from 'react'

function App() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString())

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().toLocaleString())
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <>
      <h1>WELCOME TO CHARUSAT!!</h1>
      <h1>Date Time</h1>
      <h2>{currentTime}</h2>
    </>
  )
}

export default App