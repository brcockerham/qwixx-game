import { useState } from 'react'
import getRandomInt from '../helpers/getRandomInt'
import useWebSocket from '../hooks/useWebSocket'
import localStorageUtil from '../utils/localStorageUtil'

const LogIn = () => {
  const { sendJsonMessage } = useWebSocket()
  const [userName, setUserName] = useState(localStorageUtil.get('userName') || '')

  const handleLogIn = (() => {
    localStorageUtil.set('userName', userName)
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
