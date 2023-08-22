import { useState } from 'react'
import getRandomInt from '../helpers/getRandomInt'
import useWebSocket from '../hooks/useWebSocket'
import storageUtil from '../utils/storageUtil'

const LogIn = () => {
  const { sendJsonMessage } = useWebSocket()
  const [userName, setUserName] = useState(storageUtil.localStorage.get('userName') || '')

  const handleLogIn = (() => {
    storageUtil.localStorage.set('userName', userName)
    sendJsonMessage({ userName, order: getRandomInt(1, 100) })
  })

    return (
      <div className="LogIn">
        <input
          placeholder="What is your name?"
          value={userName}
          onChange={e => setUserName(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleLogIn()
            }
          }}
        />
        <button
          onClick={handleLogIn}
        >
          Join Game
        </button>
      </div>
    )
}

export default LogIn
