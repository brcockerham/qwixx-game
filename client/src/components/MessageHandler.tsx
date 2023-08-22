import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil'
import playersAtom from '../recoil/atoms/playersAtom'
import diceAtom from '../recoil/atoms/diceAtom'
import scoreCardsAtom from '../recoil/atoms/scoreCardsAtom'
import isGameStartedAtom from '../recoil/atoms/isGameStartedAtom'
import activePlayerIndexAtom from '../recoil/selectors/activePlayerIndexAtom'
import turnStatusAtom, { TurnStatus } from '../recoil/atoms/turnStatusAtom'
import useWebSocket from '../hooks/useWebSocket'
import { Player, PointBox } from '../types'
import { useEffect } from 'react'
import currentTurnAtom from '../recoil/atoms/currentTurnAtom'
import userIdAtom from '../recoil/selectors/userIdAtom'

type Message = {
  userId?: string
  players?: Player[]
  dice?: number[][]
  scoreCard?: PointBox[]
  gameStart?: true
  restart?: true
}

const MessageHandler = () => {
  const userId = useRecoilValue(userIdAtom)
  const setPlayers = useSetRecoilState(playersAtom)
  const setDice = useSetRecoilState(diceAtom)
  const setScoreCards = useSetRecoilState(scoreCardsAtom)
  const setIsGameStarted = useSetRecoilState(isGameStartedAtom)
  const activePlayerIndex = useRecoilValue(activePlayerIndexAtom)
  const setTurnStatus = useSetRecoilState(turnStatusAtom)
  const resetDice = useResetRecoilState(diceAtom)
  const resetScoreCards = useResetRecoilState(scoreCardsAtom)
  const resetCurrentTurn = useResetRecoilState(currentTurnAtom)

  useEffect(() => {
    setTurnStatus(TurnStatus.WAIT)
  }, [activePlayerIndex, setTurnStatus])

  useWebSocket({
    onMessage: ({ data }) => {      
      const message: Message = JSON.parse(data)
      const messages: Message[] = Array.isArray(message) ? message : [message]

      messages.forEach(message => {
        if (message.gameStart) {
          resetDice()
          resetScoreCards()
          setIsGameStarted(true)
          return
        }

        if (message.restart) {
          resetDice()
          resetScoreCards()
          setIsGameStarted(false)
        }
  
        if (message.players) {
          setPlayers(message.players)
          return
        }
  
        if (message.dice) {
          setDice(message.dice)
          return
        }

        if (userId === message.userId) {
          resetCurrentTurn()
        }

        return setScoreCards(currVal => message.scoreCard && message.userId ? ({
          ...currVal,
          [message.userId]: [...(currVal[message.userId] || []), message.scoreCard]
        }): currVal)
      })

    },
  })

  return null
}

export default MessageHandler
