import { useCallback } from 'react';
import { FaUnlockAlt, FaCheck, FaCheckDouble } from "react-icons/fa";
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Color, PointBox } from '../types';
import getPointRange from '../helpers/getPointRange';
import boxStatusAtom from '../recoil/selectors/boxStatusAtom';
import currentTurnAtom from '../recoil/atoms/currentTurnAtom';
import colorsAtom from '../recoil/selectors/colorsAtom';

type PointsContainerProps = {
  color: Color
}

type ScoreBoxProps = PointsContainerProps & {
  value: number
  onSelect: (value: number) => void
}

type PenaltyBoxProps = {
  value: number
  onSelect: (value: number) => void
}

const ScoreBox = ({
  color: {
    key,
    color,
  },
  value,
  onSelect,
}: ScoreBoxProps) => {
  const {
    disabled,
    selected,
    currentTurnSelected,
    voided,
    isLock
  } = useRecoilValue(boxStatusAtom(JSON.stringify({ key, value })))

  return (
    <div className="ScoreBox"
      style={{ color: currentTurnSelected ? 'black' : color, ...disabled && { cursor: 'unset' } }}
      onClick={() => !disabled && onSelect(value)}
    >
      {selected
        ? isLock ? <FaCheckDouble /> : <FaCheck />
        : voided 
          ? '-'
          : isLock ? <FaUnlockAlt /> : value}
    </div>
  )
}

const PointsContainer = ({
  color,
}: PointsContainerProps) => {
  const setCurrentTurn = useSetRecoilState(currentTurnAtom)

  const onSelect = useCallback((value: number) => {
    const newValue = { key: color.key, value }
    const filter = (a: typeof newValue) => (a.key === newValue.key && a.value === newValue.value)
    setCurrentTurn(currVal => currVal.some(filter) ? currVal.filter(a => !filter(a)) : [...currVal, newValue])
  }, [color.key, setCurrentTurn])

  return (
    <div style={{ backgroundColor: color.color }} className="PointsContainer">
      {getPointRange(2, 12, color.lockValue === 2).map(value => (
        <ScoreBox key={value} value={value} color={color} onSelect={onSelect} />
      ))}
    </div>
  )
}

const EmptyBox = () => <div className="EmptyBox" />

const PenaltyBox = ({
  value,
  onSelect,
}: PenaltyBoxProps) => {
  const {
    disabled,
    selected,
  } = useRecoilValue(boxStatusAtom(JSON.stringify({ key: 'p', value })))

  return (
    <div
      className="PenaltyBox"
      style={{
        ...disabled && { cursor: 'unset' },
      }}
      onClick={() => !disabled && onSelect(value)}
    >
      {selected && 'X'}
    </div>
  )
}

const PenaltyContainer = () => {
  const setCurrentTurn = useSetRecoilState(currentTurnAtom)

  const onSelect = useCallback((value: number) => {
    const newValue: PointBox  = { key: 'p', value }
    const filter = (a: typeof newValue) => (a.key === newValue.key && a.value === newValue.value)
    setCurrentTurn(currVal => currVal.some(filter) ? currVal.filter(a => !filter(a)) : [...currVal, newValue])
  }, [setCurrentTurn])

  return (
    <div className="PenaltyContainer">
      {getPointRange(1, 11, true).map(value => value > 4 ? <EmptyBox key={value} /> : (
        <PenaltyBox key={value} value={value} onSelect={onSelect} />
      ))}
    </div>
  )
}

const Board = () => {
  const { baseColors } = useRecoilValue(colorsAtom)

  return (
    <div className="Board">
      {baseColors.map(color => <PointsContainer key={color.key} color={color} />)}
      <PenaltyContainer />
    </div>
  )
}

export default Board
