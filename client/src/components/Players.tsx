import { useRecoilValue } from 'recoil'
import playersAtom from '../recoil/atoms/playersAtom'
import CONSTANTS from '../constants'
import { FaCheckCircle, FaLock } from 'react-icons/fa'
import { Color, Player } from '../types'
import playerCardAtom from '../recoil/selectors/playerCardAtom'
import getPointRange from '../helpers/getPointRange'

const Lock = ({ color: { key, color }, pending, locked }: { color: Color, pending: string[], locked: string[] }) => {
  const props = locked.includes(key)
    ? { color }
    : pending.includes(key)
      ? { className: ['pending-lock', key].join(' ') }
      : {}
  
  return <FaLock {...props} />
}

const PlayerCard = ({ player, index }: { player: Player, index: number}) => {
  const { color } = CONSTANTS.BASE_COLORS[(index + 2) % 4]
  const {
    score,
    penalties,
    lockedLocks,
    pendingLocks,
    isActivePlayer,
    isCurrentPlayer,
    isPlayerReady,
  } = useRecoilValue(playerCardAtom(player.userId))

  return (
    <div
      key={player.userId}
      className="Player"
      style={{
        backgroundColor: color,
      }}
    >
      <div className="player-inner" style={{ color, ...isActivePlayer && { borderColor: color } }}>
        <div style={{ margin: 16, display: 'flex' }}>
          <FaCheckCircle color={isPlayerReady ? color : 'lightgray'} />
        </div>
        <div style={{ margin: 16, width: '60%' }}>
          {player.userName}{isCurrentPlayer ? ' (you)' : ''}
        </div>
        <div style={{ margin: 16, width: '10%' }}>
        {score > 0 ? `+${score}` : score}
        </div>
        <div style={{ margin: 16, width: '30%', textAlign: 'right', color: 'lightgray' }}>
          {getPointRange(1, 4, true).map(value => (
            <span key={value} style={{ ...penalties?.includes(value) && { color }}}>X</span>
          ))}
          <div style={{ marginLeft: 16 }} />
          {CONSTANTS.BASE_COLORS.map(color => (
            <Lock key={color.key} color={color} locked={lockedLocks} pending={pendingLocks} />
          ))}
        </div>
      </div>
    </div>
  )
}

const Players = () => {
  const players = useRecoilValue(playersAtom)
  
  return (
    <div className="Players">
      {players.map((player, index) => <PlayerCard key={player.userId} player={player} index={index} />)}
    </div>
  )
}

export default Players
