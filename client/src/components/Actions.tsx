import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import currentTurnAtom from '../recoil/atoms/currentTurnAtom'
import isActivePlayerAtom from '../recoil/selectors/isActivePlayerAtom'
import isRollDisabledAtom from '../recoil/selectors/isRollDisabledAtom'
import playersAtom from '../recoil/atoms/playersAtom'
import isGameStartedAtom from '../recoil/atoms/isGameStartedAtom'
import isHostAtom from '../recoil/selectors/isHostAtom'
import turnStatusAtom, { TurnStatus } from '../recoil/atoms/turnStatusAtom'
import isGameOverAtom from '../recoil/selectors/isGameOverAtom'
import useWebSocket from '../hooks/useWebSocket'
import { DieContainerRef } from 'react-dice-complete/dist/DiceContainer'
import copy from 'copy-to-clipboard'
import { useState } from 'react'
import { FaCheck } from 'react-icons/fa'
import { GiPerspectiveDiceSixFacesSix } from 'react-icons/gi'

const PlayerActions = ({ diceRef }: ActionsProps) => {
  const { sendJsonMessage } = useWebSocket()
  const currentTurn = useRecoilValue(currentTurnAtom)
  const resetCurrentTurn = useResetRecoilState(currentTurnAtom)
  const isActivePlayer = useRecoilValue(isActivePlayerAtom)
  const [turnStatus, setTurnStatus] = useRecoilState(turnStatusAtom)
  const isGameStarted = useRecoilValue(isGameStartedAtom)
  const isGameOver = useRecoilValue(isGameOverAtom)
  const isRollDisabled = useRecoilValue(isRollDisabledAtom)

  if (!isGameStarted || isGameOver) {
    return null
  }

  if (!isRollDisabled) {
    return (
      <button onClick={() => diceRef.current?.rollAll()} >
        roll {<GiPerspectiveDiceSixFacesSix />}
      </button>
    )
  }

  const inProgress = turnStatus === TurnStatus.IN_PROGRESS
  const doneDisabled = !inProgress || (isActivePlayer && !currentTurn.length)
  
  return (
    <button 
      disabled={doneDisabled} 
      onClick={() => {
        setTurnStatus(TurnStatus.DONE)
        resetCurrentTurn()
        sendJsonMessage({ scoreCard: currentTurn })
      }}
    >
      done
    </button>
  )
}

const StartAction = () => {
  const { sendJsonMessage } = useWebSocket()
  const players = useRecoilValue(playersAtom)
  
  return (
    <button disabled={players.length < 2} onClick={() => sendJsonMessage({ gameStart: true })} >
      start game
    </button>
  )
}

const PlayAgainAction = () => {
  const { sendJsonMessage } = useWebSocket()

  return (
    <button onClick={() => sendJsonMessage({ restart: true })}>
      play again
    </button>
  )
}

const InviteAction = () => {
  const [linkCopied, setLinkCopied] = useState(false)

  return (
    <button
      onClick={() => {
        copy(window.location.href)
        setLinkCopied(true)
      }}
    >
      Copy Link {linkCopied && <FaCheck size={16} />}
    </button>
  )
}

const HostActions = () => {
  const isHost = useRecoilValue(isHostAtom)
  const isGameStarted = useRecoilValue(isGameStartedAtom)
  const isGameOver = useRecoilValue(isGameOverAtom)

  if (!isHost) {
    return null
  }

  if (isGameOver) {
    return <PlayAgainAction />
  }

  if (!isGameStarted) {
    return (
      <>
        <StartAction />
        <InviteAction />
      </>
    )
  }

  return null
}

type ActionsProps = { diceRef: React.RefObject<DieContainerRef> }

const Actions = (props: ActionsProps) => {
  return (
    <div className="Actions">
      <HostActions />
      <PlayerActions {...props} />
    </div>
  )
}

export default Actions
