import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react'
import ReactDice, { ReactDiceRef, ReactDiceProps } from 'react-dice-complete'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import diceAtom from '../recoil/atoms/diceAtom'
import getIsColorLockedAtom from '../recoil/selectors/getIsColorLockedAtom'
import isActivePlayerAtom from '../recoil/selectors/isActivePlayerAtom'
import turnStatusAtom, { TurnStatus } from '../recoil/atoms/turnStatusAtom'
import useWebSocket from '../hooks/useWebSocket'
import appLoaded from '../utils/appLoaded'
import colorsAtom from '../recoil/selectors/colorsAtom'
import { Color } from '../types'

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
  const isColorLocked = useRecoilValue(getIsColorLockedAtom)
  const isActivePlayer = useRecoilValue(isActivePlayerAtom)
  const setTurnStatus = useSetRecoilState(turnStatusAtom)

  useEffect(() => {
    setTimeout(() => {
      appLoaded.setLoaded()
    }, 500)
  }, [])


  const onRoll = useCallback((diceValues: number[], key: Color['key'], isLast: boolean) => {
    valuesRef.current[key] = diceValues
    if (isLast && isActivePlayer) {
      sendJsonMessage({ dice: allColors.map(color => valuesRef.current[color.key]) })
    }
  }, [sendJsonMessage, isActivePlayer, allColors])

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
      {allColors.map((color, index, arr) => {
        const disabled = isColorLocked(color)

        return (
          <Die
            key={color.key}
            setRef={ref => refs.current[index] = ref}
            numDice={color.lockValue === 0 ? 2 : 1}
            rollDone={(_diceValue: number, diceValues: number[]) => appLoaded.loaded && onRoll(disabled ? [0] : diceValues, color.key, index === arr.length - 1)}
            faceColor={[color.color, disabled && '25'].filter(Boolean).join('')}
            dotColor={color.lockValue === 0 ? '#000' : disabled ? 'transparent' : '#fff'}
            defaultRoll={index + 1}
            dieCornerRadius={8}
            margin={2}
            dieSize={52}
            rollTime={Number(appLoaded.loaded && !disabled)}
          />
        )
      })}
    </div>
  )
})

export default Dice
