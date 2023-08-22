import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import ReactDice, { ReactDiceRef, ReactDiceProps } from 'react-dice-complete'
import CONSTANTS from '../constants'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import diceAtom from '../recoil/atoms/diceAtom'
import isColorLockedAtom from '../recoil/selectors/isColorLockedAtom'
import isActivePlayerAtom from '../recoil/selectors/isActivePlayerAtom'
import turnStatusAtom, { TurnStatus } from '../recoil/atoms/turnStatusAtom'
import useWebSocket from '../hooks/useWebSocket'
import appLoaded from '../utils/appLoaded'

type DieProps = ReactDiceProps & {
  setRef: (ref: ReactDiceRef) => void
}

const Die = ({ setRef, ...props }: DieProps) => {
  return (
    <ReactDice
      ref={setRef}
      disableIndividual
      {...props}
    />
  )
}

const Dice = forwardRef((_, ref) => {
  const { sendJsonMessage } = useWebSocket()
  const refs = useRef(new Array<ReactDiceRef>())
  const valuesRef = useRef(Object.fromEntries(CONSTANTS.COLORS.map(color => [color.key, [0]])))
  const dice = useRecoilValue(diceAtom)
  const isColorLocked = useRecoilValue(isColorLockedAtom)
  const isActivePlayer = useRecoilValue(isActivePlayerAtom)
  const setTurnStatus = useSetRecoilState(turnStatusAtom)

  const currentColors = useMemo(() => CONSTANTS.COLORS.filter(color => !isColorLocked(color)), [isColorLocked])

  useEffect(() => {
    setTimeout(() => {
      appLoaded.setLoaded()
    }, 500)
  }, [])


  const onRoll = useCallback((diceValues: number[], index: number) => {
    valuesRef.current[currentColors[index].key] = diceValues
    if (index === currentColors.length - 1 && isActivePlayer) {
      sendJsonMessage({ dice: currentColors.map(color => valuesRef.current[color.key]) })
    }
  }, [currentColors, sendJsonMessage, isActivePlayer])

  const rollAll = useCallback((values?: number[][]) => {
    setTurnStatus(TurnStatus.IN_PROGRESS)
    refs.current.forEach((ref, index) => {
      ref?.rollAll(values && values[index])
    })
  }, [setTurnStatus])

  ;(window as any).rollAll = rollAll

  useEffect(() => {
    if (dice.length && (!isActivePlayer || !appLoaded.loaded)) {
      rollAll(dice)
    }
    // eslint-disable-next-line
  }, [dice])

  useImperativeHandle(ref, () => ({
    rollAll,
  }))

  return (
    <div className="Dice">
      {currentColors.map((color, index) => (
        <Die
          key={color.key}
          setRef={ref => refs.current[index] = ref}
          numDice={color.isWild ? 2 : 1}
          rollDone={(_diceValue: number, diceValues: number[]) => appLoaded.loaded && onRoll(diceValues, index)}
          faceColor={color.color}
          dotColor={color.isWild ? '#000' : '#fff'}
          defaultRoll={index + 1}
          dieCornerRadius={8}
          margin={2}
          dieSize={52}
          rollTime={appLoaded.loaded ? 1 : 0}
        />
      ))}
    </div>
  )
})

export default Dice
