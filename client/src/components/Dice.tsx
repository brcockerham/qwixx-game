import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import ReactDice, { ReactDiceRef, ReactDiceProps } from 'react-dice-complete'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import diceAtom from '../recoil/atoms/diceAtom'
import isColorLockedAtom from '../recoil/selectors/isColorLockedAtom'
import isActivePlayerAtom from '../recoil/selectors/isActivePlayerAtom'
import turnStatusAtom, { TurnStatus } from '../recoil/atoms/turnStatusAtom'
import useWebSocket from '../hooks/useWebSocket'
import appLoaded from '../utils/appLoaded'
import colorsAtom from '../recoil/selectors/colorsAtom'

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
  const { allColors } = useRecoilValue(colorsAtom)
  const valuesRef = useRef(Object.fromEntries(allColors.map(color => [color.key, [0]])))
  const dice = useRecoilValue(diceAtom)
  const isColorLocked = useRecoilValue(isColorLockedAtom)
  const isActivePlayer = useRecoilValue(isActivePlayerAtom)
  const setTurnStatus = useSetRecoilState(turnStatusAtom)

  useEffect(() => {
    setTimeout(() => {
      appLoaded.setLoaded()
    }, 500)
  }, [])


  const onRoll = useCallback((diceValues: number[], index: number) => {
    valuesRef.current[allColors[index].key] = diceValues
    if (index === allColors.length - 1 && isActivePlayer) {
      sendJsonMessage({ dice: allColors.map(color => valuesRef.current[color.key]) })
    }
  }, [sendJsonMessage, isActivePlayer, allColors])

  const rollAll = useCallback((values?: number[][]) => {
    setTurnStatus(TurnStatus.IN_PROGRESS)
    refs.current.forEach((ref, index) => {
      if (!isColorLocked(allColors[index].key)) {
        ref?.rollAll(values && values[index])
      }
    })
  }, [setTurnStatus, isColorLocked, allColors])

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
      {allColors.map((color, index) => {
        const disabled = isColorLocked(color.key)

        return (
          <Die
            key={color.key}
            setRef={ref => refs.current[index] = ref}
            numDice={color.lockValue === 0 ? 2 : 1}
            rollDone={(_diceValue: number, diceValues: number[]) => appLoaded.loaded && onRoll(diceValues, index)}
            faceColor={[color.color, disabled && '25'].filter(Boolean).join('')}
            dotColor={color.lockValue === 0 ? '#000' : disabled ? 'transparent' : '#fff'}
            defaultRoll={index + 1}
            dieCornerRadius={8}
            margin={2}
            dieSize={52}
            rollTime={appLoaded.loaded ? 1 : 0}
          />
        )
      })}
    </div>
  )
})

export default Dice
